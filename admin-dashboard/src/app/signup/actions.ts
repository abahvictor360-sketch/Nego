'use server';

import { cookies } from 'next/headers';
import { signSession } from '@/lib/jwt';
import { SESSION_COOKIE } from '@/lib/session';

export async function registerAction(
  _prev: { error: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error: string; success?: boolean }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) return { error: 'All fields are required.' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const backendUrl = process.env.BACKEND_API_URL ?? '';
  if (!backendUrl) {
    return { error: 'Backend URL not configured. Set BACKEND_API_URL in Vercel environment variables.' };
  }

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/merchants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Cannot reach backend (${backendUrl}): ${msg}` };
  }

  if (res.status === 409) {
    return { error: 'An account with this email already exists. Try signing in instead.' };
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null) as { error?: unknown } | null;
    const detail =
      body && typeof body.error === 'object'
        ? Object.values(body.error as Record<string, string[]>).flat().join(', ')
        : (body?.error as string) ?? `${res.status} ${res.statusText}`;
    return { error: `Registration failed: ${detail}` };
  }

  const merchant = await res.json() as {
    id: string; name: string; email: string; apiKey: string;
    role?: string; botName?: string; language?: string;
  };

  const token = await signSession({
    merchantId: merchant.id,
    name: merchant.name,
    email: merchant.email,
    apiKey: merchant.apiKey,
    role: merchant.role ?? 'merchant',
    botName: merchant.botName ?? 'Max',
    language: merchant.language ?? 'en',
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { error: '', success: true };
}

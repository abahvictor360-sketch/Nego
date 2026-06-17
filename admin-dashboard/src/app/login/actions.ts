'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signSession } from '@/lib/jwt';
import { SESSION_COOKIE } from '@/lib/session';

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email and password are required.' };

  const backendUrl = process.env.BACKEND_API_URL ?? 'http://localhost:3001';
  const res = await fetch(`${backendUrl}/api/merchants/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: 'Invalid email or password.' };
  }

  const merchant = await res.json() as {
    id: string; name: string; email: string; apiKey: string;
  };

  const token = await signSession({
    merchantId: merchant.id,
    name: merchant.name,
    email: merchant.email,
    apiKey: merchant.apiKey,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/dashboard');
}

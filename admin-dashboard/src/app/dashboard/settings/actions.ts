'use server';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { signSession } from '@/lib/jwt';
import { SESSION_COOKIE } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export async function changePasswordAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword)
    return { error: 'All fields are required.' };
  if (newPassword.length < 8)
    return { error: 'New password must be at least 8 characters.' };
  if (newPassword !== confirmPassword)
    return { error: 'New passwords do not match.' };

  const res = await fetch(`${BACKEND}/api/merchants/me/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error ?? 'Password change failed.' };
  }

  return { success: true };
}

export async function updateBotSettingsAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const botName = (formData.get('botName') as string).trim();
  const language = formData.get('language') as string;

  if (!botName) return { error: 'Bot name is required.' };
  if (botName.length > 50) return { error: 'Bot name must be 50 characters or fewer.' };

  const res = await fetch(`${BACKEND}/api/merchants/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify({ botName, language }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error ?? 'Update failed.' };
  }

  // Refresh session cookie with new botName/language
  const updated = await res.json() as { botName: string; language: string };
  const token = await signSession({ ...session, botName: updated.botName, language: updated.language });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

'use server';

import { getSession } from '@/lib/session';

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

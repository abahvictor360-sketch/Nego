'use server';

export async function resetPasswordAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const token = formData.get('token') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token) return { error: 'Missing reset token. Use the link from your email.' };
  if (!newPassword || newPassword.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (newPassword !== confirmPassword) return { error: 'Passwords do not match.' };

  const backendUrl = process.env.BACKEND_API_URL ?? '';
  if (!backendUrl) return { error: 'Backend URL not configured.' };

  try {
    const res = await fetch(`${backendUrl}/api/merchants/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error ?? 'This reset link is invalid or has expired.' };
    }
  } catch {
    return { error: 'Cannot reach the server. Please try again.' };
  }

  return { success: true };
}

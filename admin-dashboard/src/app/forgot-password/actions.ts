'use server';

export async function forgotPasswordAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email is required.' };

  const backendUrl = process.env.BACKEND_API_URL ?? '';
  if (!backendUrl) return { error: 'Backend URL not configured.' };

  try {
    const res = await fetch(`${backendUrl}/api/merchants/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok && res.status !== 200) {
      return { error: 'Something went wrong. Please try again.' };
    }
  } catch {
    return { error: 'Cannot reach the server. Please try again.' };
  }

  // Always report success to avoid leaking which emails exist.
  return { success: true };
}

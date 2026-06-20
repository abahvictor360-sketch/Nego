'use server';

import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

async function authed(method: string, path: string, body?: Record<string, unknown>) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Not authorized' };
  const res = await fetch(`${BACKEND}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? 'Request failed' };
  }
  return { data: await res.json() };
}

export async function saveEmailSettings(settings: Record<string, unknown>) {
  return authed('PUT', '/api/admin/email-settings', settings);
}

export async function sendTestEmail(to: string) {
  return authed('POST', '/api/admin/email-settings/test', { to });
}

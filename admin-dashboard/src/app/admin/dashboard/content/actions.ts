'use server';

import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export async function saveContentAction(content: Record<string, unknown>): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Admin access required' };

  const res = await fetch(`${BACKEND}/api/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? 'Save failed' };
  }
  return {};
}

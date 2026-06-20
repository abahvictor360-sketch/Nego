'use server';

import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

async function patchUser(id: string, body: Record<string, string>): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Not authorized' };

  const res = await fetch(`${BACKEND}/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? 'Update failed' };
  }
  return {};
}

export async function setUserPlan(id: string, plan: 'free' | 'pro') {
  return patchUser(id, { plan });
}

export async function setUserStatus(id: string, status: 'active' | 'suspended') {
  return patchUser(id, { status });
}

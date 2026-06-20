'use server';

import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

async function adminPost(path: string, body: Record<string, string>) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Not authorized' };
  const res = await fetch(`${BACKEND}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? 'Request failed' };
  }
  return { data: await res.json() };
}

async function adminPatch(path: string, body: Record<string, string>) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Not authorized' };
  const res = await fetch(`${BACKEND}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? 'Request failed' };
  }
  return { data: await res.json() };
}

export async function replyToTicket(id: string, body: string) {
  return adminPost(`/api/admin/tickets/${id}/reply`, { body });
}

export async function setTicketStatus(id: string, status: 'open' | 'pending' | 'closed') {
  return adminPatch(`/api/admin/tickets/${id}/status`, { status });
}

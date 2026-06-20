'use server';

import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

async function authedFetch(path: string, method: string, body: Record<string, unknown>) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };
  const res = await fetch(`${BACKEND}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error ?? 'Request failed' };
  }
  return { data: await res.json() };
}

export async function createTicketAction(subject: string, message: string, priority: 'low' | 'normal' | 'high') {
  if (!subject.trim() || !message.trim()) return { error: 'Subject and message are required.' };
  return authedFetch('/api/tickets', 'POST', { subject, message, priority });
}

export async function replyTicketAction(id: string, body: string) {
  if (!body.trim()) return { error: 'Message is required.' };
  return authedFetch(`/api/tickets/${id}/reply`, 'POST', { body });
}

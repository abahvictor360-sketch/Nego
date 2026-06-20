import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export async function PATCH() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await fetch(`${BACKEND}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'x-api-key': session.apiKey },
    });
  } catch { /* best-effort */ }
  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  try {
    await fetch(`${BACKEND}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'x-api-key': session.apiKey },
    });
  } catch { /* best-effort */ }
  return NextResponse.json({ success: true });
}

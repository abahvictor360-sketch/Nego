import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  try {
    const res = await fetch(`${BACKEND}/api/sessions/${id}`, {
      headers: { 'x-api-key': session.apiKey },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Unreachable' }, { status: 502 });
  }
}

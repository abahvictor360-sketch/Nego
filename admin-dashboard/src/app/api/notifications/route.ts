import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ notifications: [], unread: 0 }, { status: 401 });

  try {
    const res = await fetch(`${BACKEND}/api/notifications`, {
      headers: { 'x-api-key': session.apiKey },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ notifications: [], unread: 0 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ notifications: [], unread: 0 });
  }
}

import { cookies } from 'next/headers';
import { verifySession, type SessionData } from './jwt';

const COOKIE = 'nego-session';

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export { COOKIE as SESSION_COOKIE };

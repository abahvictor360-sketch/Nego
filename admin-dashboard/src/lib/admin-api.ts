import { getSession } from './session';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:3001';

/** Server-side fetch to the backend as the logged-in admin. Returns null on failure. */
export async function adminFetch<T>(path: string): Promise<T | null> {
  const session = await getSession();
  if (!session || session.role !== 'admin') return null;
  try {
    const res = await fetch(`${BACKEND}${path}`, {
      headers: { 'x-api-key': session.apiKey },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export { BACKEND as BACKEND_URL };

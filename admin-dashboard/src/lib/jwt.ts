import { SignJWT, jwtVerify } from 'jose';

const DEV_FALLBACK = 'dev-secret-change-in-production-min-32-chars';

// Resolve the signing secret lazily so a misconfiguration fails at request time
// (not build/prerender). In production we refuse the known dev default and any
// weak value — otherwise anyone could forge a valid (admin) session token.
function getSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s === DEV_FALLBACK || s.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SESSION_SECRET must be set to a strong, unique 32+ character value in production.',
      );
    }
    return new TextEncoder().encode(DEV_FALLBACK);
  }
  return new TextEncoder().encode(s);
}

export interface SessionData {
  merchantId: string;
  name: string;
  email: string;
  apiKey: string;
  role: string;
  botName: string;
  language: string;
}

export async function signSession(data: SessionData): Promise<string> {
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

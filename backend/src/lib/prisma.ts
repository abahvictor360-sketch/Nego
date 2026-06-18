import { PrismaClient } from '@prisma/client';

const PROJECT_REF = 'tamcebxiwxaiwaglmcqc';

function patchDbUrl(raw: string): string {
  if (!raw || !raw.includes('pooler.supabase.com')) return raw;

  try {
    const u = new URL(raw);
    let changed = false;

    if (!u.username.includes(PROJECT_REF)) {
      u.username = `postgres.${PROJECT_REF}`;
      changed = true;
    }
    // sslmode=require forces TLS → pooler receives SNI hostname as tenant identifier
    if (!u.searchParams.has('sslmode')) {
      u.searchParams.set('sslmode', 'require');
      changed = true;
    }
    // pgbouncer=true disables prepared statements (required for transaction pooler)
    if (!u.searchParams.has('pgbouncer')) {
      u.searchParams.set('pgbouncer', 'true');
      changed = true;
    }

    if (changed) {
      const patched = u.toString();
      process.env.DATABASE_URL = patched;
      console.log('[prisma] Patched DATABASE_URL for Supabase pooler');
      return patched;
    }
    return raw;
  } catch {
    // URL() failed — regex fallback
    let url = raw;
    if (!url.includes(PROJECT_REF)) {
      url = url.replace(/(:\/\/)([^:@]+)(:[^@]*@)/, `$1postgres.${PROJECT_REF}$3`);
    }
    const sep = url.includes('?') ? '&' : '?';
    if (!url.includes('pgbouncer=true')) url += `${sep}pgbouncer=true`;
    if (!url.includes('sslmode=')) url += '&sslmode=require';
    if (url !== raw) {
      process.env.DATABASE_URL = url;
      console.log('[prisma] Patched DATABASE_URL (fallback)');
    }
    return url;
  }
}

const dbUrl = patchDbUrl(process.env.DATABASE_URL ?? '');

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: dbUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

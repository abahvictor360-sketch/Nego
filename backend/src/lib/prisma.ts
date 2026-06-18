import { PrismaClient } from '@prisma/client';

const PROJECT_REF = 'tamcebxiwxaiwaglmcqc';

function buildDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? '';
  if (!raw.includes('pooler.supabase.com')) return raw;

  // The transaction pooler requires a "postgres.<project_ref>" username which
  // Render's env var doesn't have, and the username patch keeps failing in
  // production for unclear environmental reasons. The reliable fix is to switch
  // to the direct host (db.<ref>.supabase.co:5432) which accepts plain "postgres".
  try {
    const u = new URL(raw);
    u.username = 'postgres';
    u.hostname = `db.${PROJECT_REF}.supabase.co`;
    u.port = '5432';
    u.searchParams.delete('pgbouncer');
    const direct = u.toString();
    process.env.DATABASE_URL = direct;
    console.log('[prisma] Switched to direct Supabase connection (bypassed pooler)');
    return direct;
  } catch {
    // URL() failed — regex fallback
    const direct = raw
      .replace(/aws-\d+-[a-z0-9-]+\.pooler\.supabase\.com:\d+/i, `db.${PROJECT_REF}.supabase.co:5432`)
      .replace(/postgres\.[^:@]+(:)/i, 'postgres$1');
    process.env.DATABASE_URL = direct;
    console.log('[prisma] Switched to direct connection (fallback regex)');
    return direct;
  }
}

const dbUrl = buildDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: dbUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

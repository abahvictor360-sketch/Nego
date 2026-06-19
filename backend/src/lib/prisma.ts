import { PrismaClient } from '@prisma/client';

// ---------------------------------------------------------------------------
// Supabase transaction-pooler connection normalizer
// ---------------------------------------------------------------------------
// The pooler (aws-*.pooler.supabase.com) requires the username to be the tenant
// form "postgres.<project_ref>", NOT the bare role "postgres". This module runs
// whenever prisma.ts is imported (i.e. via EVERY controller), so the fix applies
// regardless of which entry point started the process.
const PROJECT_REF = 'tamcebxiwxaiwaglmcqc';

function normalize(raw: string): string {
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    if (!u.hostname.includes('pooler.supabase.com')) return raw;
    if (u.username === 'postgres') {
      u.username = `postgres.${PROJECT_REF}`;
    }
    if (!u.searchParams.has('pgbouncer')) {
      u.searchParams.set('pgbouncer', 'true');
    }
    return u.toString();
  } catch {
    return raw;
  }
}

function masked(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    return `user=${JSON.stringify(u.username)} host=${u.hostname} port=${u.port} db=${u.pathname.slice(1)} passLen=${u.password ? u.password.length : 0} params=${u.search || '(none)'}`;
  } catch {
    return '<unparseable>';
  }
}

const _raw = process.env.DATABASE_URL ?? '';
const _dbUrl = normalize(_raw);

console.log(`[prisma] DATABASE_URL provided:  ${masked(_raw)}`);
if (_dbUrl !== _raw) {
  process.env.DATABASE_URL = _dbUrl;
  console.log(`[prisma] DATABASE_URL normalized: ${masked(_dbUrl)}`);
} else {
  console.log('[prisma] DATABASE_URL unchanged (no normalization needed)');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: _dbUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

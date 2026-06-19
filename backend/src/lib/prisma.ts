import { PrismaClient } from '@prisma/client';

// Safety-net: Supabase transaction pooler requires username "postgres.<project_ref>".
// If DATABASE_URL has plain "postgres", patch it before PrismaClient is constructed.
const _raw = process.env.DATABASE_URL ?? '';
let _dbUrl = _raw;

if (_raw.includes('pooler.supabase.com') && !_raw.includes('tamcebxiwxaiwaglmcqc')) {
  _dbUrl = _raw.replace(
    /^(postgresql?:\/\/)postgres([:@])/i,
    '$1postgres.tamcebxiwxaiwaglmcqc$2',
  );
  if (!_dbUrl.includes('pgbouncer=true')) {
    _dbUrl += (_dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }
  process.env.DATABASE_URL = _dbUrl;
  console.log('[prisma] patched DATABASE_URL: added project ref + pgbouncer');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: _dbUrl } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

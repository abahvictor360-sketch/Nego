import { PrismaClient } from '@prisma/client';

// Supabase transaction pooler requires username "postgres.<project_ref>", not plain "postgres".
// We patch process.env.DATABASE_URL in-place so that both PrismaClient and any
// other code that reads the env var (e.g. prisma migrate in startCommand) see the
// corrected URL.  The guard makes this a no-op if the URL is already correct or
// is not a Supabase pooler URL at all.
const _rawUrl = process.env.DATABASE_URL;
if (
  _rawUrl &&
  _rawUrl.includes('pooler.supabase.com') &&
  !_rawUrl.includes('postgres.tamcebxiwxaiwaglmcqc')
) {
  process.env.DATABASE_URL = _rawUrl.replace(
    '://postgres:',
    '://postgres.tamcebxiwxaiwaglmcqc:',
  );
  console.log('[prisma] Patched Supabase pooler username in DATABASE_URL');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pass the (possibly patched) URL explicitly via datasources so PrismaClient
// never falls back to the un-patched env var even if module caching causes
// the env mutation to be invisible in some edge-case Node.js versions.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

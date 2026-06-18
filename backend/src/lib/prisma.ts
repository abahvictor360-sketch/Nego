import { PrismaClient } from '@prisma/client';

// Supabase pooler requires username "postgres.<project_ref>" not plain "postgres".
// Patch the env var in-place so Prisma reads the corrected URL from schema env().
const _url = process.env.DATABASE_URL;
if (_url && _url.includes('pooler.supabase.com') && !_url.includes('postgres.tamcebxiwxaiwaglmcqc')) {
  process.env.DATABASE_URL = _url.replace('://postgres:', '://postgres.tamcebxiwxaiwaglmcqc:');
  console.log('[prisma] Fixed pooler username in DATABASE_URL');
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

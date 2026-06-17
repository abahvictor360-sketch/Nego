import { PrismaClient } from '@prisma/client';

// Fix Supabase pooler username: postgres -> postgres.<project_ref>
// This is needed when DATABASE_URL uses the Supabase connection pooler
// (aws-*.pooler.supabase.com) but the username is just "postgres"
function fixDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (!url.includes('pooler.supabase.com')) return url;
  return url.replace('://postgres:', '://postgres.tamcebxiwxaiwaglmcqc:');
}

const databaseUrl = fixDatabaseUrl(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

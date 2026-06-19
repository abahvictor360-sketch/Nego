#!/usr/bin/env node
'use strict';

// Patch DATABASE_URL before dist/index.js loads (which imports Prisma).
// db-patch.ts also runs inside dist/index.js as the very first import,
// so this is a belt-and-suspenders redundancy.
const raw = process.env.DATABASE_URL || '';
if (raw.includes('pooler.supabase.com') && !raw.includes('tamcebxiwxaiwaglmcqc')) {
  let url = raw.replace(
    /^(postgresql?:\/\/)postgres([:@])/i,
    '$1postgres.tamcebxiwxaiwaglmcqc$2',
  );
  if (!url.includes('pgbouncer=true')) {
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }
  process.env.DATABASE_URL = url;
  process.stderr.write('[start] DATABASE_URL patched\n');
}

process.stderr.write('[start] loading server...\n');
require('../dist/index.js');

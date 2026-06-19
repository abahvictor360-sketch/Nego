#!/usr/bin/env node
'use strict';

// Patch DATABASE_URL before prisma migrate deploy or dist/index.js runs.
// Supabase transaction pooler (port 6543) requires username "postgres.<ref>".
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
  console.log('[start] patched DATABASE_URL: added project ref + pgbouncer');
}

const { execSync } = require('child_process');

console.log('[start] running prisma migrate deploy...');
try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname + '/..',
  });
  console.log('[start] migrations OK');
} catch (e) {
  console.error('[start] migrate failed (continuing anyway):', e.message);
}

console.log('[start] starting server...');
require('../dist/index.js');

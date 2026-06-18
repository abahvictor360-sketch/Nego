#!/usr/bin/env node
'use strict';

const PROJECT_REF = 'tamcebxiwxaiwaglmcqc';
const rawUrl = process.env.DATABASE_URL || '';

// Convert pooler URL → direct connection so prisma migrate deploy works
// without needing the postgres.<ref> username format the pooler requires.
if (rawUrl.includes('pooler.supabase.com')) {
  try {
    const u = new URL(rawUrl);
    u.username = 'postgres';
    u.hostname = `db.${PROJECT_REF}.supabase.co`;
    u.port = '5432';
    u.searchParams.delete('pgbouncer');
    process.env.DATABASE_URL = u.toString();
    console.log('[start] Converted pooler URL to direct Supabase connection');
  } catch (_) {
    process.env.DATABASE_URL = rawUrl
      .replace(/aws-\d+-[a-z0-9-]+\.pooler\.supabase\.com:\d+/i, `db.${PROJECT_REF}.supabase.co:5432`)
      .replace(/postgres\.[^:@]+(:)/i, 'postgres$1');
    console.log('[start] Converted to direct connection (fallback regex)');
  }
}

const { execSync } = require('child_process');

console.log('[start] Running prisma migrate deploy...');
try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname + '/..',
  });
  console.log('[start] Migrations OK');
} catch (err) {
  console.error('[start] Migration failed (continuing):', err.message);
}

console.log('[start] Starting server...');
require('../dist/index.js');

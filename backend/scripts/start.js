#!/usr/bin/env node
'use strict';

const PROJECT_REF = 'tamcebxiwxaiwaglmcqc';
const rawUrl = process.env.DATABASE_URL || '';

if (rawUrl.includes('pooler.supabase.com')) {
  try {
    const u = new URL(rawUrl);
    let changed = false;
    if (!u.username.includes(PROJECT_REF)) {
      u.username = `postgres.${PROJECT_REF}`;
      changed = true;
    }
    if (!u.searchParams.has('sslmode')) {
      u.searchParams.set('sslmode', 'require');
      changed = true;
    }
    if (!u.searchParams.has('pgbouncer')) {
      u.searchParams.set('pgbouncer', 'true');
      changed = true;
    }
    if (changed) {
      process.env.DATABASE_URL = u.toString();
      console.log('[start] Patched DATABASE_URL (username + ssl + pgbouncer)');
    }
  } catch (_) {
    let url = rawUrl;
    if (!url.includes(PROJECT_REF)) {
      url = url.replace(/(:\/\/)([^:@]+)(:[^@]*@)/, `$1postgres.${PROJECT_REF}$3`);
    }
    const sep = url.includes('?') ? '&' : '?';
    if (!url.includes('pgbouncer=true')) url += `${sep}pgbouncer=true`;
    if (!url.includes('sslmode=')) url += '&sslmode=require';
    if (url !== rawUrl) {
      process.env.DATABASE_URL = url;
      console.log('[start] Patched DATABASE_URL (fallback)');
    }
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
  // Migrations may already be applied — log and continue rather than killing the process
  console.error('[start] Migration step failed (continuing):', err.message);
}

console.log('[start] Starting server...');
require('../dist/index.js');

#!/usr/bin/env node
'use strict';

/**
 * Production start script.
 * Patches DATABASE_URL *before* any Prisma CLI or client code runs,
 * so the Supabase transaction pooler gets the correct username
 * (postgres.<project_ref>) regardless of what is set in the env.
 */

const rawUrl = process.env.DATABASE_URL || '';

if (rawUrl.includes('pooler.supabase.com')) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.username && parsed.username !== 'postgres.tamcebxiwxaiwaglmcqc') {
      parsed.username = 'postgres.tamcebxiwxaiwaglmcqc';
      process.env.DATABASE_URL = parsed.toString();
      console.log('[start] Patched DATABASE_URL: username -> postgres.tamcebxiwxaiwaglmcqc');
    }
  } catch (_) {
    // URL() failed — fall back to simple string replace
    if (!rawUrl.includes('postgres.tamcebxiwxaiwaglmcqc')) {
      process.env.DATABASE_URL = rawUrl.replace(
        /(:\/\/)([^:@]+)(:[^@]*@)/,
        '$1postgres.tamcebxiwxaiwaglmcqc$3',
      );
      console.log('[start] Patched DATABASE_URL (fallback replace)');
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
  console.error('[start] Migration failed:', err.message);
  process.exit(1);
}

console.log('[start] Starting server...');
require('../dist/index.js');

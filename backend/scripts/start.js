#!/usr/bin/env node
'use strict';

// ---------------------------------------------------------------------------
// Startup diagnostic + DATABASE_URL normalizer for Supabase transaction pooler
// ---------------------------------------------------------------------------
// This file is plain JS copied directly into the image (NOT compiled), so it
// always reflects the latest source and runs BEFORE dist/index.js loads Prisma.
// It prints exactly what connection the container is about to use (password
// masked) so we can see ground truth in the Render logs.

const PROJECT_REF = 'tamcebxiwxaiwaglmcqc';

function describe(label, urlStr) {
  try {
    const u = new URL(urlStr);
    process.stderr.write(
      `[start] ${label}: protocol=${u.protocol} user=${JSON.stringify(u.username)} ` +
      `host=${u.hostname} port=${u.port} db=${u.pathname.slice(1)} ` +
      `passLen=${u.password ? u.password.length : 0} ` +
      `params=${u.search || '(none)'}\n`,
    );
  } catch (e) {
    process.stderr.write(`[start] ${label}: <unparseable URL> (${e.message})\n`);
  }
}

const raw = process.env.DATABASE_URL || '';
if (!raw) {
  process.stderr.write('[start] FATAL: DATABASE_URL is empty/undefined\n');
} else {
  describe('DATABASE_URL as provided', raw);
}

// Normalize: if pointing at the Supabase pooler but the username is the bare
// role `postgres`, rewrite it to the tenant form `postgres.<project_ref>` that
// the transaction pooler requires, and ensure pgbouncer=true is present.
let url = raw;
try {
  const u = new URL(raw);
  const isPooler = u.hostname.includes('pooler.supabase.com');
  if (isPooler) {
    if (u.username === 'postgres') {
      u.username = `postgres.${PROJECT_REF}`;
      process.stderr.write(`[start] normalized username -> postgres.${PROJECT_REF}\n`);
    }
    if (!u.searchParams.has('pgbouncer')) {
      u.searchParams.set('pgbouncer', 'true');
    }
    url = u.toString();
  }
} catch {
  // leave raw as-is; describe() above already reported the parse failure
}

if (url !== raw) {
  process.env.DATABASE_URL = url;
  describe('DATABASE_URL after normalize', url);
} else {
  process.stderr.write('[start] DATABASE_URL unchanged (no normalization needed)\n');
}

process.stderr.write('[start] loading server...\n');
require('../dist/index.js');

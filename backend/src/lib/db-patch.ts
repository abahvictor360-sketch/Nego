// Patches DATABASE_URL the moment this module is loaded — before any other
// module can instantiate PrismaClient. Import this as the FIRST line of index.ts.
const _raw = process.env.DATABASE_URL ?? '';
if (_raw.includes('pooler.supabase.com') && !_raw.includes('tamcebxiwxaiwaglmcqc')) {
  let _url = _raw.replace(
    /^(postgresql?:\/\/)postgres([:@])/i,
    '$1postgres.tamcebxiwxaiwaglmcqc$2',
  );
  if (!_url.includes('pgbouncer=true')) {
    _url += (_url.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }
  process.env.DATABASE_URL = _url;
  process.stdout.write('[db-patch] DATABASE_URL patched for Supabase pooler\n');
}

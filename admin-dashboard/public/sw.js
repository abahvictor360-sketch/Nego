// Nego Bot admin — service worker
// Strategy:
//   - Precache the app shell (offline fallback + icons)
//   - Hashed Next static assets: cache-first (immutable)
//   - Page navigations: network-first, fall back to /offline when offline
//   - API / auth / everything else: pass through to network (never cached)

const CACHE = 'nego-admin-v1';
const PRECACHE = ['/offline', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept API or auth routes — always go to network.
  if (url.pathname.startsWith('/api/')) return;

  // Cache-first for immutable, hashed build assets.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        }),
      ),
    );
    return;
  }

  // Network-first for page navigations, with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline').then((r) => r || Response.error())),
    );
    return;
  }
});

// Service Worker for Patagonia Racing Academy
const CACHE_NAME = 'patagonia-v2'; // versión actual del cache

// Detect base path: '/' for Cloudflare Pages root, '/RegistroKevin' for GitHub Pages subfolder
const BASE = self.location.pathname.startsWith('/RegistroKevin') ? '/RegistroKevin' : '';

const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/logo-patagonia.png`,
  `${BASE}/logo-patagonia-texto.png`
];

// Install: precache static shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches (any cache not matching current version)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for external APIs, cache‑first for static assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Bypass cache for API routes, non‑GET methods, or requests with credentials
  if (url.pathname.startsWith('/api/') || e.request.method !== 'GET' || e.request.credentials !== 'omit') {
    e.respondWith(fetch(e.request));
    return;
  }

  // Supabase, Google Sheets – always network, no cache
  if (url.hostname.includes('supabase.co') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Do not cache responses that forbid it or are private
        const cc = response.headers.get('Cache-Control') || '';
        const isCacheable = response.ok &&
          !cc.includes('no-store') &&
          !cc.includes('private') &&
          url.hostname === self.location.hostname &&
          e.request.credentials === 'omit';
        if (isCacheable) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: serve index.html for navigation
        if (e.request.mode === 'navigate') {
          return caches.match(`${BASE}/index.html`);
        }
        return new Response('', { status: 503 });
      });
    })
  );
});
const CACHE_NAME = 'patagonia-v1';
const BASE = '/RegistroKevin';
const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/logo-patagonia.png`,
  `${BASE}/logo-patagonia-texto.png`
];

// Instalar: precachear shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first para Supabase, cache-first para assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Supabase y Google Sheets — siempre network, sin caché
  if (url.hostname.includes('supabase.co') || url.hostname.includes('googleapis.com') || url.hostname.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Assets propios — cache-first con fallback a network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Solo cachear respuestas válidas de nuestro origin
        if (response.ok && url.hostname === self.location.hostname) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: servir index.html para navegación
        if (e.request.mode === 'navigate') {
          return caches.match(`${BASE}/index.html`);
        }
        return new Response('', { status: 503 });
      });
    })
  );
});

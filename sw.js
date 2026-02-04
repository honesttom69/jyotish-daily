const CACHE_NAME = 'jyotish-v9';

const SHELL_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/calc/astronomy-engine.js',
  './js/calc/planets.js',
  './js/calc/houses.js',
  './js/calc/sidereal.js',
  './js/calc/transits.js',
  './js/calc/transitTiming.js',
  './js/calc/geocoding.js',
  './js/calc/timezone.js',
  './js/calc/dasha.js',
  './js/ui/screens.js',
  './js/ui/dateSelector.js',
  './js/ui/chart.js',
  './js/ui/calendar.js',
  './js/ui/dashas.js',
  './js/ui/learn.js',
  './js/ui/chartTooltip.js',
  './js/ui/profiles.js',
  './js/data/storage.js',
  './js/data/premium.js',
  './js/data/interpretations.js',
  './js/data/learn.js',
  './js/utils/constants.js',
  './js/synthesis.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './manifest.json',
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin, network-only for external
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // External requests (APIs): network-only
  if (url.origin !== self.location.origin) return;

  // Chrome DevTools requests
  if (url.pathname.includes('.well-known')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful responses for future use
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

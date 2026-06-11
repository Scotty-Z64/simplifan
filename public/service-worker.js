const CACHE_NAME = 'simpliflow-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return (self as any).skipWaiting();
    })
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return (self as any).clients.claim();
    })
  );
});

// Fetch - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const fetchEvent = event as FetchEvent;
  
  // Skip non-GET requests and API calls
  if (fetchEvent.request.method !== 'GET') return;
  if (fetchEvent.request.url.includes('/api/')) return;
  
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(fetchEvent.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return from cache when offline
        return caches.match(fetchEvent.request).then((cached) => {
          if (cached) return cached;
          // Fallback for HTML pages
          if (fetchEvent.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline - Content not available', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

export {};

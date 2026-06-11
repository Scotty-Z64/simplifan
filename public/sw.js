/**
 * SimpliPlan PWA Service Worker
 * Provides offline support, caching, and background sync
 */

const CACHE_NAME = 'simpliplan-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Cache-first strategy for static assets, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Strategy: Cache-first for static assets (JS, CSS, images, fonts)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/) ||
    url.pathname === '/' ||
    url.pathname === '/index.html'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        // Return cached version immediately
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            // Update cache with fresh version
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, already returning cached version
          });

        return cached || fetchPromise;
      })
    );
  }
});

// Background Sync: Queue actions when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'event-plan-sync') {
    event.waitUntil(syncPendingPlans());
  }
});

async function syncPendingPlans() {
  try {
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => {
      client.postMessage({ type: 'SYNC_COMPLETE' });
    });
  } catch (err) {
    console.error('Background sync failed:', err);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new notification from SimpliPlan',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: data.tag || 'default',
    requireInteraction: true,
    actions: data.actions || [],
    data: data.payload || {}
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'SimpliPlan',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { notification } = event;
  const payload = notification.data || {};

  let url = '/';
  if (payload.type === 'vendor_response') url = '/#/client';
  if (payload.type === 'quote_request') url = '/#/vendor';
  if (payload.type === 'event_reminder') url = '/#/client';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing tab if open
        for (const client of clientList) {
          if (client.url && new URL(client.url).pathname === '/') {
            client.focus();
            client.postMessage({ type: 'NOTIFICATION_CLICK', payload });
            return;
          }
        }
        // Open new tab
        self.clients.openWindow(url);
      })
  );
});

console.log('[SimpliPlan SW] Service Worker loaded v1');

// VIP CAR B2B - Service Worker Oficial (PWA)
// Diseñado para operaciones mineras y socavón subterráneo con conectividad intermitente
const CACHE_NAME = 'vipcar-socavon-v2.0';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/logo-vipcar.png',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-192x192.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  // Rutas críticas del módulo de Conductor para uso en socavón
  '/conductor',
  '/conductor/checkin',
  '/conductor/checkout',
  '/conductor/averia',
  '/b2b'
];

// 1. Instalación y Precaché de rutas críticas de campo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('[PWA Service Worker] Precaching parcial de socavón:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activación y Limpieza de Caches Antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[PWA Service Worker] Depurando caché anterior:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estrategia de Fetch Inteligente para Operaciones Mineras de Altura & Socavón
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar esquemas no soportados (chrome-extension:, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // A. Peticiones de Navegación HTML (SPA React / Rutas del Conductor en Socavón):
  // Intenta Red, pero si no hay señal dentro del socavón, sirve el shell cacheado de inmediato
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Fallback para socavón: Si no hay señal en interior mina, entrega la app desde caché
          const cachedRoute = await caches.match(req);
          if (cachedRoute) return cachedRoute;
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;
          return caches.match('/');
        })
    );
    return;
  }

  // B. Recursos Estáticos de Vite (JS, CSS, imágenes, logos): Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.woff2');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C. Fallback genérico de red
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// 4. Background Sync: Sincronización automática de registros de socavón al recuperar señal
self.addEventListener('sync', (event) => {
  if (
    event.tag === 'sync-driver-socavon' ||
    event.tag === 'sync-driver-telemetry' ||
    event.tag === 'sync-odometro'
  ) {
    console.log('[PWA SW] Evento Background Sync detectado en superficie:', event.tag);
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC' });
        });
      })
    );
  }
});

// 5. Recepción de mensajes desde la app (ej. forzar actualización o disparar sync)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'TRIGGER_OFFLINE_SYNC') {
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC' });
      });
    });
  }
});

const CACHE_NAME = 'noteverse-cache-v1';
const urlsToCache = [
  '/',
  '/home',
  '/about',
  '/semesters',
  '/latest-update',
  '/users',
  '/settings',
  '/profile',
  '/admin',
  '/admin/home',
  '/admin/semesters',
  '/admin/users',
  '/admin/update-note',
  '/admin/about',
  '/admin/settings',
  '/admin/profile',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const CACHE_NAME = 'ultrafit-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/diet.html',
  '/workout.html',
  '/members.html',
  '/shop.html',
  '/index.css',
  '/index.js',
  '/ultrafit-logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.error('Failed to cache one or more files:', err);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
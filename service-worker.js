const cacheName = 'milatro-v1';
const assets = [
  '/',
  '/index.html',
  '/styles.css',
  '/boot_game.js',
  '/boot_menu.js',
  '/music_manager.js',
  '/images/logo.png',
  '/offline.html'
];

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request).catch(() => caches.match('/offline.html'));
    })
  );
});

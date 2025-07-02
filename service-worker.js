const cacheName = 'milatro-v1';
const assets = [
  '/Milatro_html/',
  '/Milatro_html/index.html',
  '/Milatro_html/styles.css',
  '/Milatro_html/boot_game.js',
  '/Milatro_html/boot_menu.js',
  '/Milatro_html/music_manager.js',
  '/Milatro_html/images/logo.png',
  '/Milatro_html/offline.html'
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v2')
    .then(cache => {
      return cache.addAll([
        '/',
        '/styles/index.css',
        '/images/rocket.svg'
      ])
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  let cacheWhitelist = ['assets-v2'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

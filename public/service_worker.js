self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1')
    .then(cache => {
      return cache.addAll([
        '/',
        '/styles/index.css',
        '/images/rocket.svg'
      ])
    })
  );
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request)
    })
  );
})

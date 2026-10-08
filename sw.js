// Offline support: when the network is unavailable, serve the app from cache.
// Network first, so a new deploy is picked up as soon as the device is online.
const CACHE = 'four-paths-v1';
const PRECACHE = [
  './', './index.html', './support.js', './manifest.json',
  './vendor/react.production.min.js', './vendor/react-dom.production.min.js',
  './apple-touch-icon.png', './favicon.png', './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return;
  e.respondWith(
    // 'no-cache' revalidates with the server (cheap 304 when unchanged), so a deploy shows up on the next online
    // launch without bumping any ?v= query, even though the host sends max-age.
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.status === 200) {
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}));
      }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(hit =>
        hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
    )
  );
});

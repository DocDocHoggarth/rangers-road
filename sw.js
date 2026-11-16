/* Offline support: keep a copy of the app on the phone and refresh it quietly when online. */
var CACHE = 'rangers-road-1.1.0';
var SHELL = [
  './', 'index.html', 'styles.css', 'data.js', 'logic.js', 'app.js', 'art.js', 'scenes.js', 'manifest.webmanifest',
  'fell.woff2', 'fell-italic.woff2', 'fell-sc.woff2', 'numerals.woff2', 'numerals-italic.woff2', 'hand.woff2',
  'paper.png', 'paper-night.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(req, { ignoreSearch: true }).then(function (hit) {
      var fresh = fetch(req).then(function (res) {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(function () {
        return hit || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
      });
      return hit || fresh;
    });
  }));
});

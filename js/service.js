// Dateien, die gecacht werden sollen
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  'index.html',
  'Css/CSSco.css',
  'js/service.js',
  'js/map.js',
  'js/popup.js',
  'js/data.js',
  'js/geolocation.js',
  'js/route-planner.js',
  'js/G+R.js',
  'js/M+R.js',
  'js/MarkZ.js',
];

// Installationsereignis - Dateien werden gecacht
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Dateien werden gecacht');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('Caching fehlgeschlagen:', error);
      })
  );
});

// Aktivierungsereignis - Alte Caches werden gelöscht
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch-Ereignis - Anfragen werden abgefangen und aus dem Cache bedient
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Datei aus dem Cache zurückgeben
        }
        return fetch(event.request).then(function(response) {
          // Antwort ins Cache speichern, wenn die Anfrage erfolgreich war
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      }).catch(function(error) {
        console.error('Fetch-Fehler:', error);
      })
  );
});
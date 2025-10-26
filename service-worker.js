// service-worker.js
const CACHE_NAME = 'chhath-songs-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/CHHATHI MAAI AAILI NAIHARVA.mp3',
  '/Ho Deenanath.mp3',
  '/Pahile Pahil Chhathi Maiya.mp3',
  '/Uga Hai Suraj Dev.mp3',
  '/आदित मनाईला.mp3',
  '/काँच ही बाँस के बहंगिया.mp3',
  '/छठी माई के घाटवा पे आजन बाजन.mp3',
  '/नदिया के पनिया.mp3',
  '/पटना के घाट.mp3',
  '/पिया जोड़ा कोशी भरवाऐ के.mp3',
  '/महिमा छठी मइया के अपार.mp3',
  '/हे छठी मइया.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS).catch(err=>{
        // swallow errors for individual entries but continue install
        console.warn('Some resources failed to cache on install:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Cache-first strategy for same-origin GET requests
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Only handle same-origin requests to avoid CORS issues
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      if (cachedResp) return cachedResp;
      return fetch(event.request).then(networkResp => {
        // cache a copy for future offline use (but only if ok)
        if (networkResp && networkResp.status === 200) {
          const copy = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return networkResp;
      }).catch(() => {
        // fallback to index.html for navigation, or just fail for media
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

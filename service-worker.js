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
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS)).then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
      return res;
    }))
  );
});

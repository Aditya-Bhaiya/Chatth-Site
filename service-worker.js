const CACHE_NAME = 'chhath-songs-v2';
const BASE_PATH = '/Chatth-Site'; // <-- GitHub Pages repo folder name

const OFFLINE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/CHHATHI MAAI AAILI NAIHARVA.mp3`,
  `${BASE_PATH}/Ho Deenanath.mp3`,
  `${BASE_PATH}/Pahile Pahil Chhathi Maiya.mp3`,
  `${BASE_PATH}/Uga Hai Suraj Dev.mp3`,
  `${BASE_PATH}/आदित मनाईला.mp3`,
  `${BASE_PATH}/काँच ही बाँस के बहंगिया.mp3`,
  `${BASE_PATH}/छठी माई के घाटवा पे आजन बाजन.mp3`,
  `${BASE_PATH}/नदिया के पनिया.mp3`,
  `${BASE_PATH}/पटना के घाट.mp3`,
  `${BASE_PATH}/पिया जोड़ा कोशी भरवाऐ के.mp3`,
  `${BASE_PATH}/महिमा छठी मइया के अपार.mp3`,
  `${BASE_PATH}/हे छठी मइया.mp3`
];

// ✅ Install SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

// ✅ Activate SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// ✅ Fetch handler
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return res;
      }).catch(() => caches.match(`${BASE_PATH}/index.html`));
    })
  );
});

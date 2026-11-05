// Chỉ để trang cài được như app. Luôn lấy bản mới, không giữ bản cũ gây hiểu nhầm số liệu.
const VO = 'tamkho-ql-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VO).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const c = r.clone(); caches.open(VO).then(ca => ca.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request))
  );
});

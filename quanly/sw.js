// Chỉ để trang cài được như app. KHÔNG giữ bản cũ của trang, vì bản cũ gây đọc sai dữ liệu.
const VO = 'tamkho-ql-2026-11-08-b6';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VO).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Trang chính: luôn lấy bản mới từ máy chủ, bỏ qua bộ nhớ đệm của trình duyệt.
  // Chỉ dùng bản lưu khi thật sự mất mạng.
  if (req.mode === 'navigate' || (req.destination === '' && req.url.endsWith('/'))) {
    e.respondWith(
      fetch(req, { cache: 'reload' })
        .then(r => { const c = r.clone(); caches.open(VO).then(ca => ca.put(req, c)); return r; })
        .catch(() => caches.match(req))
    );
    return;
  }
  e.respondWith(
    fetch(req)
      .then(r => { const c = r.clone(); caches.open(VO).then(ca => ca.put(req, c)); return r; })
      .catch(() => caches.match(req))
  );
});

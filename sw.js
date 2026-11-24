/* Perfect Car Rental – ruan aplikacionin në pajisje që të hapet edhe pa internet. */
const CACHE = "pcr-app-v1";
const SHELL = [
  "./", "index.html", "manifest.json",
  "assets/html2pdf.bundle.min.js", "assets/docparse.js",
  "assets/logo-white.png", "assets/logo-dark.png", "assets/icon-192.png", "assets/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const withTimeout = (p, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("timeout")), ms); p.then(v => { clearTimeout(t); res(v); }, err => { clearTimeout(t); rej(err); }); });

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return; // Google etj. shkojnë direkt në internet

  // Faqja: provo internetin (versioni më i ri), pa internet merre nga pajisja
  if (req.mode === "navigate") {
    e.respondWith(
      withTimeout(fetch(req), 5000).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); }
        return res;
      }).catch(() => caches.match("index.html"))
    );
    return;
  }

  // Skedarët e tjerë: nga pajisja menjëherë, dhe përditësohen në sfond
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => {
      const net = fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }).catch(() => cached);
      return cached || net;
    })
  );
});

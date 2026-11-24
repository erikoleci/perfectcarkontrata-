/* Perfect Car Rental – ruan aplikacionin në pajisje që të punojë edhe pa internet,
 * dhe dërgon kontratat në pritje sapo të ketë internet (edhe me aplikacionin të mbyllur, në Android). */
const CACHE = "pcr-app-v2";
const SHELL = [
  "./", "index.html", "manifest.json",
  "assets/html2pdf.bundle.min.js", "assets/docparse.js",
  "assets/logo-white.png", "assets/logo-dark.png", "assets/icon-192.png", "assets/icon-512.png"
];
// leximi i patentës pa internet (~9 MB, shkarkohet një herë)
const OCR = [
  "assets/ocr/tesseract.min.js", "assets/ocr/worker.min.js",
  "assets/ocr/core/tesseract-core-simd-lstm.wasm.js", "assets/ocr/lang/eng.traineddata"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(SHELL);
    try { await c.addAll(OCR); } catch (err) {} // nëse dështon, provohet përsëri herës tjetër
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => caches.open(CACHE)).then(async c => { for (const u of OCR) if (!(await c.match(u))) { try { await c.add(u); } catch (err) {} } }));
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

/* ---------- dërgimi i kontratave në pritje ---------- */
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("pcr", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
function store(db, mode, fn) {
  return new Promise((res, rej) => { const t = db.transaction("outbox", mode), q = fn(t.objectStore("outbox")); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); });
}
async function flushOutbox() {
  const db = await idb(), items = await store(db, "readonly", s => s.getAll());
  for (const it of items) {
    if (!it.url) continue;
    const r = await fetch(it.url, { method: "POST", body: JSON.stringify(it.body) }).then(x => x.json());
    if (!r.ok) throw new Error(r.error || "send");
    await store(db, "readwrite", s => s.delete(it.id));
  }
}
self.addEventListener("sync", e => { if (e.tag === "pcr-outbox") e.waitUntil(flushOutbox()); });

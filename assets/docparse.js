/* Perfect Car Rental – leximi i të dhënave nga teksti i patentës / ID-së / pasaportës.
 * Merr tekstin e lexuar (OCR) dhe kthen { mbiemri, emri, dob, nrId, nrPatente, burimi }.
 * Mbështet:
 *  - patentat me fusha të numëruara (Shqipëri, Kosovë, BE, MB, shumica e SHBA-së): 1. 2. 3. 4a-4d 5.
 *  - pasaportat dhe ID-të me rreshtat MRZ (<<<), për çdo vend
 *  - patentat amerikane me etiketa: LN, FN, DOB, DL / DLN / LIC
 */
(function (global) {
  const DATE = /(\d{1,2})[.\/\- ](\d{1,2})[.\/\- ](\d{4}|\d{2})/;

  function normDate(d, m, y) {
    if (y.length === 2) { const yy = +y, now = new Date().getFullYear() % 100; y = (yy > now ? "19" : "20") + y; }
    const dd = +d, mm = +m;
    if (dd < 1 || dd > 31 || mm < 1 || mm > 12) return "";
    return String(dd).padStart(2, "0") + "." + String(mm).padStart(2, "0") + "." + y;
  }
  function usDate(m, d, y) { return normDate(d, m, y); } // SHBA: MM/DD/YYYY
  const cleanName = s => (s || "").replace(/[^A-ZÇËÄÖÜÉÈÁÀÍÓÚÑŠŽĆČĐ' -]/g, " ").replace(/\s+/g, " ").trim();
  // heq shenjat e tepërta dhe korrigjon shkronjat që OCR i ngatërron me shifra mes shifrave (I→1, O→0, L→1, S→5, B→8)
  const cleanId = s => (s || "").replace(/[^A-Z0-9-]/g, "")
    .replace(/(\d)([OILSB])(?=[\d-]|$)/g, (m, a, b) => a + ({ O: "0", I: "1", L: "1", S: "5", B: "8" })[b])
    .replace(/(\d)([OILSB])(?=[\d-]|$)/g, (m, a, b) => a + ({ O: "0", I: "1", L: "1", S: "5", B: "8" })[b]);

  /* ---------- MRZ (pasaporta / ID) ---------- */
  function mrz(text) {
    const L = text.split("\n").map(l => l.replace(/\s+/g, "").replace(/[«‹]/g, "<"))
      .filter(l => l.length >= 28 && /^[A-Z0-9<]+$/.test(l) && (l.match(/</g) || []).length >= 3);
    const ymd = s => /^\d{6}$/.test(s) ? normDate(s.slice(4, 6), s.slice(2, 4), s.slice(0, 2)) : "";
    const names = s => { const p = s.replace(/^<+/, "").split("<<"); return { mbiemri: cleanName(p[0].replace(/</g, " ")), emri: cleanName((p[1] || "").replace(/</g, " ")) }; };
    for (let i = 0; i < L.length; i++) {
      const a = L[i], b = L[i + 1], c = L[i + 2];
      // TD3 – pasaportë (2 x 44)
      if (b && a.length >= 40 && b.length >= 40 && /^P/.test(a)) {
        const n = names(a.slice(5)), pn = b.slice(28, 42).replace(/</g, "");
        return { ...n, dob: ymd(b.slice(13, 19)), nrId: cleanId(/^[A-Z0-9]{6,}$/.test(pn) ? pn : b.slice(0, 9).replace(/</g, "")), burimi: "pasaporta" };
      }
      // TD1 – kartë identiteti (3 x 30)
      if (b && c && a.length >= 28 && /^[IAC]/.test(a)) {
        const doc = a.slice(5, 14).replace(/</g, ""), opt = a.slice(15, 30).replace(/</g, "");
        const n = names(c);
        return { ...n, dob: ymd(b.slice(0, 6)), nrId: cleanId(/^[A-Z]\d{8}[A-Z]$/.test(opt) ? opt : (opt.length >= 8 ? opt : doc)), burimi: "ID" };
      }
    }
    return null;
  }

  /* ---------- fushat e numëruara (patenta BE / SHBA) ---------- */
  function numbered(text) {
    const f = {};
    const lab = /(?:^|\s)(4[A-D]|[1-9])[.,]?\s+(?=\S)/g;
    text.split("\n").forEach(line => {
      const marks = []; let m;
      lab.lastIndex = 0;
      while ((m = lab.exec(line))) marks.push({ k: m[1], start: m.index, end: lab.lastIndex });
      marks.forEach((mk, i) => {
        const v = line.slice(mk.end, i + 1 < marks.length ? marks[i + 1].start : line.length).trim();
        if (v && !(mk.k in f)) f[mk.k] = v;
        else if (v) (f["_" + mk.k] = f["_" + mk.k] || []).push(v);
      });
    });
    const out = {};
    if (f["1"]) out.mbiemri = cleanName(f["1"].replace(/^(LN|SURNAME|MBIEMRI)\s+/, ""));
    if (f["2"]) out.emri = cleanName(f["2"].replace(/^(FN|NAME|EMRI)\s+/, ""));
    // 3 = datëlindja (mund të vijë edhe si "3 DOB 01/02/1990")
    const dobSrc = [f["3"], ...(f["_3"] || [])].find(v => v && DATE.test(v));
    if (dobSrc) { const d = dobSrc.match(DATE); out.dob = /DOB/.test(dobSrc) && +d[1] <= 12 && +d[2] > 12 ? usDate(d[1], d[2], d[3]) : normDate(d[1], d[2], d[3]); }
    if (f["4D"]) {
      const v = cleanId(f["4D"].replace(/^(DLN|DL|ID|NO)\s+/, "").split(/\s+/)[0]);
      // në SHBA 4d është nr. i patentës, jo nr. personal
      if (/^(DLN|DL)\b/.test(f["4D"])) out.nrPatente = v; else out.nrId = v;
    }
    // 5 = nr. i patentës (OCR ndonjëherë e lexon "5." si "3.", prandaj kontrollo edhe "3" pa datë)
    const licSrc = [f["5"], ...(f["_5"] || []), ...[f["3"], ...(f["_3"] || [])].filter(v => v && !DATE.test(v))].find(v => v && /\d{4,}/.test(v));
    if (licSrc && !out.nrPatente) out.nrPatente = cleanId(licSrc.replace(/^(DD|DL|DLN|NO)\s+/, "").split(/\s+/)[0]);
    return out;
  }

  /* ---------- etiketa amerikane / të tjera ---------- */
  function labelled(text) {
    const out = {}, lines = text.split("\n").map(l => l.trim());
    const t = " " + lines.join("  ") + " ";
    let m;
    if ((m = t.match(/\bDOB[:\s]+(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/))) out.dob = usDate(m[1], m[2], m[3]);
    if ((m = t.match(/\b(?:DLN|DL|LIC(?:ENSE)?\s*(?:NO|#)?|LICENCE\s*NO)[:#\s]+([A-Z0-9-]{5,})/))) out.nrPatente = cleanId(m[1]);
    lines.forEach(l => {
      if (!out.mbiemri && (m = l.match(/^(?:1\s+)?LN[:\s]+(.+)$/))) out.mbiemri = cleanName(m[1]);
      if (!out.emri && (m = l.match(/^(?:2\s+)?FN[:\s]+(.+)$/))) out.emri = cleanName(m[1]);
    });
    return out;
  }

  function parseDoc(raw) {
    const text = String(raw || "").toUpperCase().replace(/\r/g, "").replace(/[“”"]/g, "");
    const z = mrz(text);
    const n = numbered(text), l = labelled(text);
    const r = { ...l, ...n };
    if (z) { ["mbiemri", "emri", "dob", "nrId"].forEach(k => { if (z[k]) r[k] = z[k]; }); r.burimi = z.burimi; }
    else r.burimi = "patenta";
    // nr. personal shqiptar diku në tekst (p.sh. K31104050E), nëse nuk u gjet te 4d
    if (!r.nrId) { const p = text.match(/\b[A-Z]\d{8}[A-Z]\b/); if (p) r.nrId = p[0]; }
    // pastrim: emrat duhet të kenë të paktën 2 shkronja
    ["mbiemri", "emri"].forEach(k => { if (r[k] && r[k].replace(/[^A-Z]/g, "").length < 2) delete r[k]; });
    if (r.nrPatente && r.nrPatente.replace(/[^0-9]/g, "").length < 4) delete r.nrPatente;
    return r;
  }

  global.parseDoc = parseDoc;
  if (typeof module !== "undefined") module.exports = { parseDoc };
})(typeof window !== "undefined" ? window : globalThis);

# Perfect Car Rental – Kontrata elektronike

Aplikacion i thjeshtë për kontratën **Autorizim / Authorization**. Klienti e plotëson dhe e firmos në telefon, dhe kontrata i vjen kompanisë si PDF në WhatsApp.

- Nuk ka nevojë për server dhe nuk ka kosto. Faqja hostohet falas në GitHub Pages.
- Të dhënat e klientëve dhe fotot e dokumenteve **nuk ruhen në internet**. PDF-ja krijohet në telefonin e klientit dhe dërgohet direkt te kompania.

---

## 1. Vendosja në internet (vetëm një herë)

1. Hap repon në GitHub, pastaj **Settings → Pages**.
2. Te **Source** zgjidh **Deploy from a branch**, pastaj **Branch: `main`** dhe **`/ (root)`**, dhe shtyp **Save**.
3. Pas 1–2 minutash faqja del në këtë adresë:
   `https://erikoleci.github.io/perfectcarkontrata-/`

> Repoja duhet të jetë **Public** që GitHub Pages të jetë falas. Në repo nuk ka asnjë të dhënë klienti, vetëm kodin e faqes.

## 2. Instalimi si aplikacion në telefonin e zyrës

- **Android (Chrome):** hap linkun, pastaj menyja ⋮ → **Add to Home screen / Shto në ekranin bazë**.
- **iPhone (Safari):** hap linkun, pastaj butoni Share → **Add to Home Screen**.

Del ikona **Perfect Car** si aplikacion.

## 3. Si punohet çdo ditë

### Stafi (ti)
1. Hap aplikacionin. Faqja kryesore është **paneli i stafit**.
2. Plotëso makinën: marka, modeli, ngjyra, targa dhe KM.
3. Plotëso datat dhe oraret e marrjes dhe të kthimit.
4. Shëno pajisjet, sigurimin (Full Kasko ose Simple) dhe territorin.
5. Te **Dëmtimet ekzistuese** prek mbi skemën e makinës aty ku ka gërvishtje.
6. Shëno depozitën, karburantin dhe komentet.
7. **Firma e kompanisë** bëhet vetëm herën e parë. Ruhet në telefon.
8. Zgjidh njërën nga këto:
   - **"Krijo linkun për klientin"**, pastaj **"Dërgo me WhatsApp"**: klienti e plotëson në telefonin e vet.
   - **"Plotëso këtu (në tablet)"**: klienti e plotëson në pajisjen tënde, në zyrë.

### Klienti
1. Hap linkun.
2. Shkruan emrin, nr. e ID-së ose pasaportës, nr. e patentës dhe telefonin.
3. Fotografon ID-në ose pasaportën dhe patentën.
4. Fotografon makinën nga të gjitha anët.
5. Firmos me gisht dhe pranon kushtet.
6. Shtyp **"Shiko kontratën"**, pastaj **"Dërgo kontratën"**, zgjedh WhatsApp dhe ia dërgon Perfect Car Rental.

### Pas kësaj
- PDF-ja të vjen në WhatsApp: **faqja 1** është kontrata e firmosur, **faqja 2** janë fotot e dokumenteve dhe të makinës.
- Ruaje në një dosje, p.sh. në Google Drive, dosja *Kontratat 2026*.
- Mund ta printosh direkt nga telefoni ose kompjuteri.

## 4. Ndryshimet

Të dhënat e kompanisë janë në `index.html`, te blloku `CO`:

```js
const CO = {
  emri: "PERFECT CAR RENTAL",
  tel: "+355 69 68 38 939",
  whatsapp: "355696838939",   // numri ku vijnë kontratat
  email: "",                  // opsionale
  pastrimi: 10                // € për makinë të pa larë
};
```

Pas çdo ndryshimi në GitHub, faqja përditësohet vetë brenda 1–2 minutash.

## 5. Shënime

- **Serial nr.** numërohet në pajisjen e stafit, p.sh. 2026-0001, 2026-0002. Linket krijoji gjithmonë nga i njëjti telefon.
- Linku përmban vetëm të dhënat e makinës dhe të qirasë. Të dhënat e klientit nuk kalojnë kurrë në link.
- Klienti mund të ndryshojë teorikisht linkun. Kontrollo PDF-në kur të vjen, para se t'i japësh makinën.

## Skedarët

| Skedari | Çfarë është |
|---|---|
| `index.html` | i gjithë aplikacioni |
| `manifest.json` | që të instalohet si aplikacion |
| `assets/logo-*.png` | logoja |
| `assets/icon-*.png` | ikona e aplikacionit |
| `assets/html2pdf.bundle.min.js` | libraria që krijon PDF-në |

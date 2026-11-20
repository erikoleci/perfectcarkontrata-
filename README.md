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
2. Plotëso makinën, datat, pajisjet, sigurimin, territorin, depozitën dhe karburantin.
3. Te **Dëmtimet ekzistuese** prek mbi skemën e makinës aty ku ka gërvishtje.
4. **Fotot e makinës:** shtyp "+ Shto foto" dhe fotografo makinën nga të gjitha anët. Fotot i bën **vetëm stafi**.
5. **Firma e kompanisë** bëhet vetëm herën e parë. Ruhet në telefon.
6. Shtyp **"Plotëso këtu"** dhe jepi telefonin ose tabletin klientit. *(Kjo është mënyra kryesore.)*
   - Ka edhe mundësinë **"Krijo linkun"** për klientin, por kështu kontrata vjen **pa fotot e makinës**, sepse fotot nuk kalojnë dot me link pa server.
7. Pas çdo kontrate shtyp **"Pastro formularin"** për të filluar kontratën tjetër.

> Nëse faqja rifreskohet (p.sh. pas kamerës), të dhënat nuk humbin, sepse ruhen automatikisht.

### Klienti
1. Shkruan emrin, nr. e ID-së ose pasaportës, nr. e patentës dhe telefonin.
2. Fotografon **ID-në përpara dhe mbrapa** dhe **patentën**.
3. Shtyp **"Vazhdo: shiko kontratën"** dhe lexon kontratën.
4. Në fund del pyetja **"A jeni dakord me kontratën?"**. Shtyp **PO**.
5. Firmos me gisht dhe shtyp **"Firmos kontratën"**.
6. Shtyp **"Dërgo kontratën"**, zgjedh WhatsApp dhe ia dërgon Perfect Car Rental. Mund edhe ta shkarkojë ose ta printojë.

### PDF-ja
- Emri i skedarit: **Emri_Mbiemri_DD-MM-VVVV.pdf**, p.sh. `Ervis_Mydini_20-11-2026.pdf`.
- **Faqja 1:** kontrata e plotë me firmat.
- **Faqja 2:** ID përpara dhe mbrapa, patenta, dhe poshtë tyre fotot e makinës.
- Ruaji në një dosje, p.sh. në Google Drive, dosja *Kontratat 2026*.

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

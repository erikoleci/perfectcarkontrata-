# Perfect Car Rental – Kontrata elektronike

Aplikacion i thjeshtë për kontratën **Autorizim / Authorization**. Klienti e plotëson dhe e firmos në telefon, dhe kontrata i vjen kompanisë si PDF në WhatsApp.

- Nuk ka nevojë për server dhe nuk ka kosto. Faqja hostohet falas në GitHub Pages.
- Kontratat ruhen në **Google Drive-in tënd** dhe të vijnë me **email** (shih seksionin 6).

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
7. Për kontratën tjetër shtyp **"＋ Kontratë e re"** lart. Kur hap aplikacionin dhe ka të dhëna të mbetura, del shiriti *"Ke një kontratë të filluar"* me **Vazhdo këtë / Fillo kontratë të re**.
   - Në tablet ("Plotëso këtu") formulari pastrohet vetë pasi klienti firmos, dhe në fund del butoni **"＋ Kontratë e re"**.

> Nëse faqja rifreskohet (p.sh. pas kamerës), të dhënat nuk humbin, sepse ruhen automatikisht.

### Klienti (4 hapa, një ekran për secilin)
1. **Dokumentet:** fotografon patentën përpara dhe mbrapa (ID/pasaporta opsionale). Të dhënat lexohen vetë. Pastaj **Vazhdo**.
2. **Të dhënat:** "A janë të sakta të dhënat tuaja?". Sheh emrin, datëlindjen, nr. ID dhe nr. e patentës, i korrigjon nëse duhet, shton telefonin dhe shtyp **Po, janë të sakta**.
3. **Kontrata:** e lexon. "A jeni dakord?": **PO** çon te firma; **JO** e lë në të njëjtin ekran.
4. **Firma:** firmos me gisht dhe shtyp **Firmos kontratën**.
5. **✓ Përfundoi:** kontrata dërgohet vetë me email dhe ruhet në Drive. Mund edhe të dërgohet në WhatsApp, të shkarkohet ose të printohet.

### PDF-ja
- Emri i skedarit: **Emri_Mbiemri_DD-MM-VVVV.pdf**, p.sh. `Ervis_Mydini_20-11-2026.pdf`.
- **Faqja 1:** kontrata e plotë me firmat.
- **Faqja 2:** ID përpara dhe mbrapa, patenta, dhe poshtë tyre fotot e makinës.
- Ruaji në një dosje, p.sh. në Google Drive, dosja *Kontratat 2026*.

## 3b. Makinat (flota)
- Shtyp **🚗 Makinat**, pastaj **＋ Shto makinë**: targa, marka, modeli, ngjyra, karburanti, KM, viti dhe shënime.
- Te kontrata, te **"Zgjidh makinën nga lista"**, zgjedh targën dhe plotësohen vetë marka, modeli, ngjyra, karburanti, KM-të dhe dëmtimet e shënuara herën e fundit.
- Çdo kontratë e përditëson vetë makinën në listë (KM dhe dëmtimet). Edhe makina që nuk është në listë shtohet vetë.
- Lista ruhet në Google Drive (`flota.json`) dhe është e njëjtë në çdo telefon.

## 3c. Pa internet (p.sh. në garazh, kati -3)
- Aplikacioni duhet hapur **një herë me internet** pas çdo përditësimi. Atëherë ruhet në telefon (~10 MB, bashkë me lexuesin e patentës).
  Instaloje në ekranin bazë (**Add to Home screen**), që telefoni të mos e fshijë.
- Pa internet punon **"Plotëso këtu"**: fotot, **leximi i patentës në vetë telefonin** (10–20 sekonda), konfirmimi, PO/JO, firma dhe PDF-ja.
- Kontrata **ruhet në telefon** dhe **dërgohet vetë** (email + Drive) sapo telefoni të kapë internet. Në Android dërgohet edhe me aplikacionin të mbyllur. Te paneli del "📤 N kontrata në pritje" me butonin **Dërgo tani**.
- Pa internet **nuk** punon vetëm linku për klientin, sepse klienti duhet ta hapë në telefonin e vet.

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

## 6. Google Drive + Email (ruajtja automatike)

Kur klienti firmos, kontrata **ruhet vetë në Google Drive** dhe **dërgohet me email** te Perfect Car Rental dhe te klienti, nëse ka shkruar email-in. Me link kalojnë edhe fotot e makinës që bën stafi.

Script-i punon në llogarinë tënde Google (mund të jetë email-i personal). Email-et dalin me emrin **"Perfect Car Rental"**.

### Vendosja (një herë, ~5 minuta)
1. Hyr në **script.google.com** me email-in tënd dhe shtyp **New project**.
2. Fshi gjithçka që është në editor dhe ngjit përmbajtjen e skedarit [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Email-et ku vijnë kontratat janë te `COMPANY_EMAILS` (tani: info@perfectcarrentaltirana.com, lomilomi727@gmail.com dhe nedkaleci2017@gmail.com).
4. *(Opsionale)* Në të majtë shtyp **Services +**, zgjidh **Drive API** dhe **Add**. Leximi i patentës punon edhe pa këtë.
5. Shtyp 💾 **Save**. Pastaj zgjidh funksionin **`provo`** dhe shtyp **▶ Run**.
   - Google kërkon leje. Shtyp **Review permissions**, zgjidh email-in tënd, pastaj **Advanced → Go to … (unsafe) → Allow**.
   - Kjo është normale për script-et që shkruan vetë. Script-i ka qasje vetëm në Drive dhe dërgim email-esh në llogarinë tënde.
6. Lart djathtas shtyp **Deploy → New deployment**:
   - ⚙️ **Select type → Web app**
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
   - **Deploy**, pastaj kopjo **Web app URL** (fillon me `https://script.google.com/macros/s/...`).
7. Te `index.html`, te blloku `CO`, vendos linkun: `api: "https://script.google.com/macros/s/.../exec",`

### Ku ruhen
```
Google Drive
└── Perfect Car Rental – Kontratat
    ├── 2026
    │   └── 11 Nëntor
    │       └── Ervis_Mydini_20-11-2026.pdf
    └── _Fotot e makinave (stafi)
```

### Leximi automatik i dokumenteve
- Patentat me fusha të numëruara: Shqipëri, Kosovë, BE, MB dhe shumica e SHBA-së (1. mbiemri, 2. emri, 3. datëlindja, 4d. nr. personal, 5. nr. i patentës).
- Pasaportat dhe ID-të me rreshtat `<<<` (MRZ), për çdo vend.
- Nëse fotoja është e turbullt ose me reflektim, fushat mbeten bosh ose me gabim. Klienti i kontrollon gjithmonë.

### Kufijtë
- Gmail falas lejon rreth **100 email në ditë**. Çdo kontratë dërgon 1–2 email.
- Nëse ndryshon `Code.gs` më vonë: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. Linku mbetet i njëjti.

## Skedarët

| Skedari | Çfarë është |
|---|---|
| `index.html` | i gjithë aplikacioni |
| `manifest.json` | që të instalohet si aplikacion |
| `sw.js` | që aplikacioni të hapet edhe pa internet dhe të dërgojë kontratat në pritje |
| `assets/ocr/` | lexuesi i patentës pa internet (tesseract.js, licenca Apache 2.0) |
| `assets/logo-*.png` | logoja |
| `assets/icon-*.png` | ikona e aplikacionit |
| `assets/html2pdf.bundle.min.js` | libraria që krijon PDF-në |
| `google-apps-script/Code.gs` | kodi për Google Drive + Email |

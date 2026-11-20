/**
 * Perfect Car Rental – ruajtja e kontratave në Google Drive dhe dërgimi me email.
 *
 * Udhëzimet e plota janë në README.md (seksioni "Google Drive + Email").
 * KUJDES: duhet shtuar shërbimi "Drive API" (Services +) që të punojë leximi i patentës.
 * Ndrysho vetëm vlerat te CONFIG.
 */
const CONFIG = {
  // Email-et ku vjen çdo kontratë e firmosur
  COMPANY_EMAILS: ["info@perfectcarrentaltirana.com", "lomilomi727@gmail.com", "nedkaleci2017@gmail.com"],
  // Kur klienti shtyp "Reply", përgjigjja shkon këtu
  REPLY_TO: "info@perfectcarrentaltirana.com",
  // Emri që del si dërgues te email-et
  SENDER_NAME: "Perfect Car Rental",
  // Dosja kryesore në Google Drive
  ROOT_FOLDER: "Perfect Car Rental – Kontratat",
  // Duhet të jetë i njëjtë me CO.key te index.html
  KEY: "pcr-2026-kontrata"
};

const MUAJT = ["01 Janar","02 Shkurt","03 Mars","04 Prill","05 Maj","06 Qershor","07 Korrik","08 Gusht","09 Shtator","10 Tetor","11 Nëntor","12 Dhjetor"];

/* ---------- ndihmëse ---------- */
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function folder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
function root_() {
  const it = DriveApp.getFoldersByName(CONFIG.ROOT_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(CONFIG.ROOT_FOLDER);
}
function photosFolder_() { return folder_(root_(), "_Fotot e makinave (stafi)"); }
function blobFromDataUrl_(dataUrl, name) {
  const m = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!m) throw new Error("Foto e pavlefshme");
  return Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], name);
}
function cleanToken_(t) { return String(t || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 40); }

/* Lexon tekstin nga një foto (OCR i Google Drive). Skedari i përkohshëm fshihet menjëherë. */
function ocr_(blob) {
  let id;
  if (Drive.Files.insert) {                       // Drive API v2
    id = Drive.Files.insert({ title: "ocr-tmp", mimeType: blob.getContentType() }, blob, { ocr: true, ocrLanguage: "en" }).id;
  } else {                                        // Drive API v3
    id = Drive.Files.create({ name: "ocr-tmp", mimeType: "application/vnd.google-apps.document" }, blob, { ocrLanguage: "en" }).id;
  }
  try { return DocumentApp.openById(id).getBody().getText(); }
  finally { try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {} }
}

/* ---------- GET: fotot e makinës për linkun ---------- */
function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.action === "photos") {
      const token = cleanToken_(p.t);
      if (!token) return json_({ ok: false, error: "token" });
      const it = photosFolder_().getFoldersByName(token);
      if (!it.hasNext()) return json_({ ok: true, photos: [] });
      const files = [], fi = it.next().getFiles();
      while (fi.hasNext()) files.push(fi.next());
      files.sort((a, b) => a.getName().localeCompare(b.getName()));
      const photos = files.map(f => "data:" + f.getMimeType() + ";base64," + Utilities.base64Encode(f.getBlob().getBytes()));
      return json_({ ok: true, photos });
    }
    return json_({ ok: true, app: "Perfect Car Rental" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- POST: ngarkimi i fotove / kontratës ---------- */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.key !== CONFIG.KEY) return json_({ ok: false, error: "key" });

    if (body.action === "photos") {
      const token = cleanToken_(body.token);
      if (!token || !Array.isArray(body.photos)) return json_({ ok: false, error: "data" });
      const f = folder_(photosFolder_(), token);
      body.photos.slice(0, 12).forEach((d, i) => f.createFile(blobFromDataUrl_(d, "foto-" + String(i + 1).padStart(2, "0") + ".jpg")));
      return json_({ ok: true });
    }

    if (body.action === "ocr") {
      return json_({ ok: true, text: ocr_(blobFromDataUrl_(body.image, "doc.jpg")) });
    }

    if (body.action === "contract") {
      const now = new Date();
      const year = folder_(root_(), String(now.getFullYear()));
      const month = folder_(year, MUAJT[now.getMonth()]);
      const pdf = Utilities.newBlob(Utilities.base64Decode(body.pdf), "application/pdf", String(body.filename || "Kontrata.pdf"));
      const file = month.createFile(pdf);

      const emri = String(body.name || "");
      const info = [
        "Kontrata nr. " + (body.serial || "-"),
        "Klienti: " + emri,
        "Tel: " + (body.phone || "-"),
        "Email: " + (body.email || "-"),
        "Makina: " + (body.car || "-") + " (" + (body.plate || "-") + ")",
        "Periudha: " + (body.period || "-"),
        "",
        "Kontrata është ruajtur në Google Drive: " + file.getUrl()
      ].join("\n");

      MailApp.sendEmail({
        to: CONFIG.COMPANY_EMAILS.join(","),
        subject: "Kontratë e re " + (body.serial || "") + " – " + emri + " – " + (body.plate || ""),
        body: info,
        name: CONFIG.SENDER_NAME,
        attachments: [pdf]
      });

      const email = String(body.email || "").trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        MailApp.sendEmail({
          to: email,
          subject: "Kontrata juaj – Perfect Car Rental",
          body: "Përshëndetje " + emri + ",\n\nBashkëngjitur gjeni kontratën tuaj të qirasë (nr. " + (body.serial || "") + ").\n" +
                "Faleminderit që zgjodhët Perfect Car Rental!\n\n" +
                "Hello " + emri + ",\nAttached is your rental agreement. Thank you for choosing Perfect Car Rental!\n\n" +
                "Perfect Car Rental · +355 69 68 38 939 · perfectcarrentaltirana.com",
          name: CONFIG.SENDER_NAME,
          replyTo: CONFIG.REPLY_TO,
          attachments: [pdf]
        });
      }
      return json_({ ok: true, url: file.getUrl(), clientEmailed: !!email });
    }

    return json_({ ok: false, error: "action" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* Ekzekutoje një herë nga editori (▶ Run) që Google të kërkojë lejet. */
function provo() {
  root_();
  Logger.log("Drive API: " + (typeof Drive !== "undefined" ? "OK" : "MUNGON – shto Services → Drive API"));
  Logger.log("Gati! Dosja: " + CONFIG.ROOT_FOLDER + " · Email: " + CONFIG.COMPANY_EMAILS.join(", "));
}

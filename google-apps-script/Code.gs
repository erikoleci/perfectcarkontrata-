/**
 * Perfect Car Rental – ruajtja e kontratave në Google Drive dhe dërgimi me email.
 *
 * Udhëzimet e plota janë në README.md (seksioni "Google Drive + Email").
 * Leximi i patentës (OCR) punon me ose pa shërbimin "Drive API" te Services.
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

const PROVA_PNG_ = "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";

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
  const id = (typeof Drive !== "undefined") ? ocrService_(blob) : ocrRest_(blob);
  try { return DocumentApp.openById(id).getBody().getText(); }
  finally { try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {} }
}
// me shërbimin "Drive API" (nëse është shtuar te Services)
function ocrService_(blob) {
  if (Drive.Files.insert) return Drive.Files.insert({ title: "ocr-tmp", mimeType: blob.getContentType() }, blob, { ocr: true, ocrLanguage: "en" }).id;
  return Drive.Files.create({ name: "ocr-tmp", mimeType: "application/vnd.google-apps.document" }, blob, { ocrLanguage: "en" }).id;
}
// pa shërbimin: thirrje direkte te Google Drive me lejen e script-it
function ocrRest_(blob) {
  const boundary = "pcr" + Date.now();
  const meta = { name: "ocr-tmp", mimeType: "application/vnd.google-apps.document" };
  const head = "--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(meta) +
               "\r\n--" + boundary + "\r\nContent-Type: " + blob.getContentType() + "\r\n\r\n";
  const payload = Utilities.newBlob(head).getBytes().concat(blob.getBytes()).concat(Utilities.newBlob("\r\n--" + boundary + "--").getBytes());
  const res = UrlFetchApp.fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&ocrLanguage=en", {
    method: "post", contentType: "multipart/related; boundary=" + boundary, payload: payload,
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() }, muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) throw new Error("OCR " + res.getResponseCode() + ": " + res.getContentText().slice(0, 200));
  return JSON.parse(res.getContentText()).id;
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
  // provë e leximit me një imazh të vogël me tekst
  const png = Utilities.newBlob(Utilities.base64Decode(PROVA_PNG_), "image/png", "prova.png");
  try { Logger.log("Leximi i patentës: OK (" + (typeof Drive !== "undefined" ? "Drive API" : "pa Services") + ") · lexoi: " + ocr_(png).trim().slice(0, 40)); }
  catch (e) { Logger.log("Leximi i patentës: GABIM – " + e); }
  Logger.log("Gati! Dosja: " + CONFIG.ROOT_FOLDER + " · Email: " + CONFIG.COMPANY_EMAILS.join(", "));
}

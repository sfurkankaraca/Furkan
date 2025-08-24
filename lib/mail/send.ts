export async function sendContactMail(input: { name: string; email: string; subject: string; message: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[contact]", input);
    return { ok: true };
  }

  const fromAddress = process.env.RESEND_FROM || "noqta <onboarding@resend.dev>";
  const toAddress = "hi@noqta.club"; // force target
  const bccAddress = process.env.RESEND_BCC || "sfurkankaraca@gmail.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      bcc: bccAddress ? [bccAddress] : undefined,
      subject: `[noqta] ${input.subject}`,
      html: `<p><b>${input.name}</b> (${input.email})</p><p>${input.message}</p>`,
      text: `${input.name} (${input.email})\n\n${input.message}`,
      reply_to: [input.email],
    }),
  });
  return { ok: res.ok };
}

export type EventApplicationPayload = {
  eventId: string;
  eventTitle?: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // ISO date string YYYY-MM-DD
  city: string;
  mainReason: "DJ performansı" | "Kokteyl" | "Gökyüzü";
  musicGenres: string[]; // e.g. ["House", "Techno", ...]
  djExcitement:
    | "Güçlü basslar & yüksek enerji"
    | "Melodik ve duygusal geçişler"
    | "Sürpriz mash-up’lar"
    | "Tanıdık hit parçalar"
    | "Yeni ve keşfedilmemiş şarkılar";
  hasCar: boolean;
  instagram: string;
  consentLocation: boolean;
  consentInstructions: boolean;
  referrer?: string;
};

export async function sendEventApplicationMail(input: EventApplicationPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[apply]", input);
    return { ok: true };
  }

  // Zorunlu olarak Resend'in doğrulanmış gönderenini kullan
  const fromAddress = "noqta <onboarding@resend.dev>";
  // İstenen hedef Gmail; opsiyonel env ile değiştirilebilir
  const toPrimary = process.env.EVENTS_TO || "sfurkankaraca@gmail.com";
  // hi@noqta.club da BCC'ye alınsın
  const bccSecondary = process.env.EVENTS_BCC || "hi@noqta.club";

  const subject = `[apply] ${input.eventTitle || input.eventId} — ${input.name}`;

  const html = `
    <h2>Yeni Etkinlik Başvurusu</h2>
    <p><b>Etkinlik:</b> ${input.eventTitle || input.eventId}</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><b>Ad Soyad</b></td><td>${escapeHtml(input.name)}</td></tr>
      <tr><td><b>E‑posta</b></td><td>${escapeHtml(input.email)}</td></tr>
      <tr><td><b>Telefon</b></td><td>${escapeHtml(input.phone)}</td></tr>
      <tr><td><b>Doğum Tarihi</b></td><td>${escapeHtml(input.birthDate)}</td></tr>
      <tr><td><b>Şehir</b></td><td>${escapeHtml(input.city)}</td></tr>
      <tr><td><b>Gelme Nedeni</b></td><td>${escapeHtml(input.mainReason)}</td></tr>
      <tr><td><b>Müzik Türleri</b></td><td>${input.musicGenres.map(escapeHtml).join(", ")}</td></tr>
      <tr><td><b>DJ Setlerinde Heyecanlandıran</b></td><td>${escapeHtml(input.djExcitement)}</td></tr>
      <tr><td><b>Kendi Aracı</b></td><td>${input.hasCar ? "Evet" : "Hayır"}</td></tr>
      <tr><td><b>Instagram</b></td><td>${escapeHtml(input.instagram)}</td></tr>
      <tr><td><b>Gizlilik Kabulü</b></td><td>${input.consentLocation ? "Evet" : "Hayır"}</td></tr>
      <tr><td><b>Talimat/Seçim Kabulü</b></td><td>${input.consentInstructions ? "Evet" : "Hayır"}</td></tr>
      ${input.referrer ? `<tr><td><b>Referans</b></td><td>${escapeHtml(input.referrer)}</td></tr>` : ""}
    </table>
  `;

  const text = [
    `Etkinlik: ${input.eventTitle || input.eventId}`,
    `Ad Soyad: ${input.name}`,
    `E‑posta: ${input.email}`,
    `Telefon: ${input.phone}`,
    `Doğum Tarihi: ${input.birthDate}`,
    `Şehir: ${input.city}`,
    `Gelme Nedeni: ${input.mainReason}`,
    `Müzik Türleri: ${input.musicGenres.join(", ")}`,
    `DJ Setlerinde Heyecanlandıran: ${input.djExcitement}`,
    `Kendi Aracı: ${input.hasCar ? "Evet" : "Hayır"}`,
    `Instagram: ${input.instagram}`,
    `Gizlilik Kabulü: ${input.consentLocation ? "Evet" : "Hayır"}`,
    `Talimat/Seçim Kabulü: ${input.consentInstructions ? "Evet" : "Hayır"}`,
    input.referrer ? `Referans: ${input.referrer}` : undefined,
  ].filter(Boolean).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toPrimary],
      bcc: bccSecondary ? [bccSecondary] : undefined,
      subject,
      html,
      text,
      reply_to: [input.email],
    }),
  });
  return { ok: res.ok };
}

export type AdminEventMailPayload = {
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  note?: string;
};

export async function sendAdminEventMail(input: AdminEventMailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[admin-event]", input);
    return { ok: true };
  }
  const fromAddress = "noqta <onboarding@resend.dev>";
  const toAddress = process.env.EVENTS_TO || "sfurkankaraca@gmail.com";
  const bccAddress = process.env.EVENTS_BCC || "hi@noqta.club";
  const subject = `[admin] Yeni Etkinlik Talebi — ${input.title}`;
  const html = `
    <h2>Yeni Etkinlik</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><b>Başlık</b></td><td>${escapeHtml(input.title)}</td></tr>
      <tr><td><b>Tarih</b></td><td>${escapeHtml(input.date)}</td></tr>
      <tr><td><b>Şehir</b></td><td>${escapeHtml(input.city)}</td></tr>
      ${input.venue ? `<tr><td><b>Mekan</b></td><td>${escapeHtml(input.venue)}</td></tr>` : ""}
      ${input.ctaUrl ? `<tr><td><b>CTA</b></td><td>${escapeHtml(input.ctaUrl)}</td></tr>` : ""}
      ${input.image ? `<tr><td><b>Görsel</b></td><td>${escapeHtml(input.image)}</td></tr>` : ""}
      ${input.note ? `<tr><td><b>Not</b></td><td>${escapeHtml(input.note)}</td></tr>` : ""}
    </table>
  `;
  const text = [
    `Başlık: ${input.title}`,
    `Tarih: ${input.date}`,
    `Şehir: ${input.city}`,
    input.venue ? `Mekan: ${input.venue}` : undefined,
    input.ctaUrl ? `CTA: ${input.ctaUrl}` : undefined,
    input.image ? `Görsel: ${input.image}` : undefined,
    input.note ? `Not: ${input.note}` : undefined,
  ].filter(Boolean).join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      bcc: bccAddress ? [bccAddress] : undefined,
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

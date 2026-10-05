const DEFAULT_ADMIN_ACTIVITY_EMAIL = "sfurkankaraca@gmail.com";

/** Virgül veya noktalı virgülle çoklu adres. `ADMIN_ACTIVITY_EMAIL` yoksa varsayılan Gmail. */
export function adminActivityRecipients(): string[] {
  const raw = (process.env.ADMIN_ACTIVITY_EMAIL || "").trim() || DEFAULT_ADMIN_ACTIVITY_EMAIL;
  return [...new Set(raw.split(/[,;]+/).map((s) => s.trim()).filter(Boolean))];
}

/**
 * Site aktivitelerinin kopyasını gideceği BCC listesi.
 * `allTo` içinde olanlar (alıcı zaten) eklenmez; `extra` önce (mevcut BCC vb.).
 */
function adminActivityBcc(allTo: string[], ...extra: (string | string[] | undefined)[]): string[] | undefined {
  const toSet = new Set(allTo.map((t) => t.trim().toLowerCase()));
  const extras = extra.flatMap((seg) => (Array.isArray(seg) ? seg : seg ? [seg] : []));
  const merged = [
    ...extras.map((s) => String(s).trim()).filter(Boolean),
    ...adminActivityRecipients(),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const addr of merged) {
    const low = addr.toLowerCase();
    if (!low || toSet.has(low) || seen.has(low)) continue;
    seen.add(low);
    out.push(addr);
  }
  return out.length ? out : undefined;
}

export async function sendContactMail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  formType?: "booking" | "b2b" | "collective" | "general";
  details?: Record<string, string>;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[contact]", input);
    return { ok: true };
  }

  const fromAddress = process.env.RESEND_FROM || "noqta <onboarding@resend.dev>";
  const toAddress = "hi@noqta.club"; // force target
  const bccList = adminActivityBcc([toAddress], process.env.RESEND_BCC);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      bcc: bccList,
      subject: `[noqta:${input.formType || "general"}] ${input.subject}`,
      html: `
        <p><b>${escapeHtml(input.name)}</b> (${escapeHtml(input.email)})</p>
        ${input.phone ? `<p><b>Telefon:</b> ${escapeHtml(input.phone)}</p>` : ""}
        <p><b>Form tipi:</b> ${escapeHtml(input.formType || "general")}</p>
        ${
          input.details && Object.keys(input.details).length > 0
            ? `<p><b>Detaylar:</b></p><ul>${Object.entries(input.details)
                .map(([k, v]) => `<li><b>${escapeHtml(k)}:</b> ${escapeHtml(v)}</li>`)
                .join("")}</ul>`
            : ""
        }
        <p>${escapeHtml(input.message).replaceAll("\n", "<br/>")}</p>
      `,
      text: [
        `${input.name} (${input.email})`,
        input.phone ? `Telefon: ${input.phone}` : undefined,
        `Form tipi: ${input.formType || "general"}`,
        input.details && Object.keys(input.details).length > 0
          ? `Detaylar:\n${Object.entries(input.details)
              .map(([k, v]) => `- ${k}: ${v}`)
              .join("\n")}`
          : undefined,
        "",
        input.message,
      ]
        .filter(Boolean)
        .join("\n"),
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
  const toPrimary = process.env.EVENTS_TO?.trim() || adminActivityRecipients()[0];
  const bccSecondary = process.env.EVENTS_BCC?.trim() || "hi@noqta.club";

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
      bcc: adminActivityBcc([toPrimary, input.email], bccSecondary),
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
  const toAddress = process.env.EVENTS_TO?.trim() || adminActivityRecipients()[0];
  const bccAddress = process.env.EVENTS_BCC?.trim() || "hi@noqta.club";
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
      bcc: adminActivityBcc([toAddress], bccAddress),
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

export type WorkshopApplicationMailPayload = {
  kind: "dj" | "production" | string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  instagram?: string;
  answers: Record<string, string | number | boolean>;
};

export async function sendWorkshopApplicationMail(input: WorkshopApplicationMailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[workshop-apply]", input);
    return { ok: true };
  }
  const fromAddress = "noqta <onboarding@resend.dev>";
  const toPrimary = process.env.EVENTS_TO?.trim() || adminActivityRecipients()[0];
  const bccSecondary = process.env.EVENTS_BCC?.trim() || "hi@noqta.club";
  const subject = `[workshop] ${input.kind} — ${input.name}`;

  const rows = Object.entries(input.answers).map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(String(v))}</td></tr>`).join("");
  const html = `
    <h2>Yeni Workshop Başvurusu</h2>
    <p><b>Workshop:</b> ${escapeHtml(input.kind)}</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><b>Ad Soyad</b></td><td>${escapeHtml(input.name)}</td></tr>
      <tr><td><b>E‑posta</b></td><td>${escapeHtml(input.email)}</td></tr>
      ${input.phone ? `<tr><td><b>Telefon</b></td><td>${escapeHtml(input.phone)}</td></tr>` : ""}
      ${input.city ? `<tr><td><b>Şehir</b></td><td>${escapeHtml(input.city)}</td></tr>` : ""}
      ${input.instagram ? `<tr><td><b>Instagram</b></td><td>${escapeHtml(input.instagram)}</td></tr>` : ""}
      ${rows}
    </table>
  `;
  const textLines = [
    `Workshop: ${input.kind}`,
    `Ad Soyad: ${input.name}`,
    `E‑posta: ${input.email}`,
    input.phone ? `Telefon: ${input.phone}` : undefined,
    input.city ? `Şehir: ${input.city}` : undefined,
    input.instagram ? `Instagram: ${input.instagram}` : undefined,
    ...Object.entries(input.answers).map(([k, v]) => `${k}: ${v}`),
  ].filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [toPrimary],
      bcc: adminActivityBcc([toPrimary, input.email], bccSecondary),
      subject,
      html,
      text: textLines.join("\n"),
      reply_to: [input.email],
    }),
  });
  return { ok: res.ok };
}

// -----------------------
// Noqta Club Mail
// -----------------------

export type NoqtaClubApplicationMailPayload = {
  name: string;
  email: string;
  phone?: string;
  city: string;
  /** YYYY-MM-DD */
  birthDate?: string;
  /** Eski kayıtlar */
  age?: number;
  instagram: string;
  referrer?: string;
  referralSource?: string;
  mainReason: string;
  musicInterest: string;
};

export async function sendNoqtaClubApplicationMail(input: NoqtaClubApplicationMailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[club-apply] (dev):", {
      email: input.email,
      name: input.name,
      city: input.city,
      birthDate: input.birthDate,
    });
    return { ok: true };
  }

  const fromAddress = "noqta <onboarding@resend.dev>";
  const toPrimary = process.env.NOQTACLUB_TO?.trim() || "hi@noqta.club";
  const subject = `[club] Yeni başvuru — ${input.name}`;

  const html = `
    <h2>Yeni Noqta Club Başvurusu</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><b>Ad Soyad</b></td><td>${escapeHtml(input.name)}</td></tr>
      <tr><td><b>E-posta</b></td><td>${escapeHtml(input.email)}</td></tr>
      ${input.phone ? `<tr><td><b>Telefon</b></td><td>${escapeHtml(input.phone)}</td></tr>` : ""}
      <tr><td><b>Şehir</b></td><td>${escapeHtml(input.city)}</td></tr>
      <tr><td><b>Doğum tarihi</b></td><td>${escapeHtml(input.birthDate ? String(input.birthDate) : input.age != null ? `Eski kayıt (yaş: ${input.age})` : "—")}</td></tr>
      <tr><td><b>Instagram</b></td><td>${escapeHtml(input.instagram)}</td></tr>
      ${input.referrer ? `<tr><td><b>Referans</b></td><td>${escapeHtml(input.referrer).replaceAll("\n","<br/>")}</td></tr>` : ""}
      ${input.referralSource ? `<tr><td><b>Nasıl ulaştın</b></td><td>${escapeHtml(input.referralSource)}</td></tr>` : ""}
      <tr><td><b>Neden katılmak istiyorsun?</b></td><td>${escapeHtml(input.mainReason).replaceAll("\n","<br/>")}</td></tr>
      <tr><td><b>Daha önceki ilgi / etkinlikler</b></td><td>${escapeHtml(input.musicInterest).replaceAll("\n","<br/>")}</td></tr>
    </table>
  `;

  const text = [
    `Noqta Club Başvurusu: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Telefon: ${input.phone}` : undefined,
    `Şehir: ${input.city}`,
    input.birthDate
      ? `Doğum tarihi: ${input.birthDate}`
      : input.age != null
        ? `Yaş (eski kayıt): ${input.age}`
        : undefined,
    `Instagram: ${input.instagram}`,
    input.referrer ? `Referans: ${input.referrer}` : undefined,
    input.referralSource ? `Nasıl ulaştın: ${input.referralSource}` : undefined,
    "",
    "Neden:",
    input.mainReason,
    "",
    "İlgi/Etkinlik:",
    input.musicInterest,
  ].filter(Boolean).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [toPrimary],
      bcc: adminActivityBcc([toPrimary, input.email]),
      subject,
      html,
      text,
      reply_to: [input.email],
    }),
  });

  return { ok: res.ok };
}

export async function sendNoqtaClubApprovedMail(input: { name?: string; email: string }) {
  if (!process.env.RESEND_API_KEY) return { ok: true };
  const fromAddress = "noqta <onboarding@resend.dev>";
  const subject = "Noqta Club — aramıza hoş geldin";
  const html = `
    <p>Merhaba${input.name ? ` ${escapeHtml(input.name)}` : ""},</p>
    <p>Başvurunu okuduk ve seni aramızda görmekten mutluluk duyacağız.</p>
    <p>Gerekirse erişim ve sonraki adımlar için sana ayrıca yazacağız.</p>
    <p>noqta</p>
  `;
  const text = `Merhaba${input.name ? ` ${input.name}` : ""},\n\nBaşvurunu okuduk ve seni aramızda görmekten mutluluk duyacağız.\n\nnoqta`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [input.email],
      bcc: adminActivityBcc([input.email]),
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok };
}

export async function sendNoqtaClubRejectedMail(input: { name?: string; email: string }) {
  if (!process.env.RESEND_API_KEY) return { ok: true };
  const fromAddress = "noqta <onboarding@resend.dev>";
  const subject = "Noqta Club — başvurun hakkında";
  const html = `
    <p>Merhaba${input.name ? ` ${escapeHtml(input.name)}` : ""},</p>
    <p>Başvurun için teşekkürler. Bu turda aramıza katılmak için uygun bir eşleşme bulamadık; bu senin değerinin eksik olduğu anlamına gelmez.</p>
    <p>Bir süre sonra tekrar başvurabilir veya etkinlikler ve collective üzerinden yine yanımızda olabilirsin.</p>
    <p>noqta</p>
  `;
  const text = `Merhaba${input.name ? ` ${input.name}` : ""},\n\nBaşvurun için teşekkürler. Bu turda aramıza katılmak için uygun bir eşleşme bulamadık.\nİstersen bir süre sonra tekrar deneyebilirsin.\n\nnoqta`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [input.email],
      bcc: adminActivityBcc([input.email]),
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok };
}

export async function sendEventAnnouncementMail(input: {
  to: string[];
  title: string;
  date?: string;
  city?: string;
  venue?: string;
  eventUrl: string;
  ticketUrl: string;
}) {
  if (!input.to.length) return { ok: true, sent: 0 };
  if (!process.env.RESEND_API_KEY) {
    console.log("[event-announcement]", input);
    return { ok: true, sent: input.to.length };
  }
  const fromAddress = "noqta <onboarding@resend.dev>";
  const subject = `Yeni etkinlik: ${input.title}`;
  const when = input.date ? new Date(input.date).toLocaleString("tr-TR") : "Tarih yakında";
  const place = [input.venue, input.city].filter(Boolean).join(" · ") || "Lokasyon yakında";
  const html = `
    <h2>Yeni etkinlik yayında</h2>
    <p><b>${escapeHtml(input.title)}</b></p>
    <p><b>Tarih:</b> ${escapeHtml(when)}</p>
    <p><b>Yer:</b> ${escapeHtml(place)}</p>
    <p>
      <a href="${escapeHtml(input.eventUrl)}">Etkinlik detayını görüntüle</a><br/>
      <a href="${escapeHtml(input.ticketUrl)}">Bilet al</a>
    </p>
  `;
  const text = `Yeni etkinlik: ${input.title}\nTarih: ${when}\nYer: ${place}\n\nDetay: ${input.eventUrl}\nBilet: ${input.ticketUrl}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [input.to[0]],
      bcc: adminActivityBcc(input.to, input.to.slice(1)),
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok, sent: input.to.length };
}

export async function sendTicketPurchasedMail(input: {
  to: string;
  name?: string | null;
  eventTitle: string;
  date?: string;
  city?: string;
  venue?: string;
  ticketCodes: string[];
  ticketsUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[ticket-purchased]", input);
    return { ok: true };
  }
  const fromAddress = "noqta <onboarding@resend.dev>";
  const subject = `Bilet satın alımın başarılı: ${input.eventTitle}`;
  const when = input.date ? new Date(input.date).toLocaleString("tr-TR") : "Tarih yakında";
  const place = [input.venue, input.city].filter(Boolean).join(" · ") || "Lokasyon yakında";
  const codes = input.ticketCodes.map((c) => `<li><code>${escapeHtml(c)}</code></li>`).join("");
  const html = `
    <p>Merhaba${input.name ? ` ${escapeHtml(input.name)}` : ""},</p>
    <p><b>${escapeHtml(input.eventTitle)}</b> için bilet satın alımın başarıyla tamamlandı.</p>
    <p><b>Tarih:</b> ${escapeHtml(when)}<br/><b>Yer:</b> ${escapeHtml(place)}</p>
    <p><b>Bilet kodların:</b></p>
    <ul>${codes}</ul>
    <p><a href="${escapeHtml(input.ticketsUrl)}">Biletlerim sayfasına git</a></p>
  `;
  const text = [
    `Merhaba${input.name ? ` ${input.name}` : ""},`,
    `${input.eventTitle} için bilet satın alımın başarıyla tamamlandı.`,
    `Tarih: ${when}`,
    `Yer: ${place}`,
    "",
    "Bilet kodların:",
    ...input.ticketCodes.map((c) => `- ${c}`),
    "",
    `Biletlerim: ${input.ticketsUrl}`,
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [input.to],
      bcc: adminActivityBcc([input.to]),
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok };
}

export async function sendNewsletterWelcomeMail(input: { email: string; source?: string }) {
  const fromAddress = process.env.RESEND_FROM || "noqta <onboarding@resend.dev>";
  const subject = "noqta journal'a hoş geldin";
  const html = `
    <p>Merhaba,</p>
    <p><b>noqta journal</b> bültenine kaydoldun. Elektronik müzik dünyasından haberler,
    türün efsaneleri, sahne yazıları ve rehberleri artık e-postana göndereceğiz.</p>
    <p><a href="https://noqt.club/blog">Journal'a göz at →</a></p>
    <p style="color:#888;font-size:12px">Bu e-postayı beklemiyorsan görmezden gelebilirsin.</p>
  `;
  const text = [
    "Merhaba,",
    "noqta journal bültenine kaydoldun. Elektronik müzik dünyasından haberler, efsaneler, sahne yazıları ve rehberler artık e-postana gelecek.",
    "Journal: https://noqt.club/blog",
  ].join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.log("[newsletter]", input.email, input.source);
    return { ok: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [input.email],
      bcc: adminActivityBcc([input.email]),
      subject,
      html,
      text,
    }),
  });
  return { ok: res.ok };
}

"use server";

import { addContactInquiry, type ContactInquiryType } from "@/lib/admin/store";
import { sendContactMail } from "@/lib/mail/send";
import type { OzelEtkinlikPayload } from "@/lib/ozel-etkinlik-teklif-config";
import { KVKK_CHECKBOX_LABELS } from "@/lib/ozel-etkinlik-teklif-config";

type ActionResult = { ok: true } | { ok: false; error: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asBool(v: unknown): boolean {
  return v === true;
}

function asStrArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.length > 0);
}

function formatEventDateForMail(iso: string): string {
  const s = iso.trim();
  if (!s) return "— (tarih henüz net değil)";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    }
  }
  return s;
}

function buildMessage(p: OzelEtkinlikPayload): string {
  const lines: string[] = [
    "Özel etkinlik teklif formu (web)",
    "",
    `Kaynak: ${p.kaynak === "b2b" ? "B2B" : "Booking"}`,
    "",
    "— İletişim ve temel bilgiler —",
    `Ad Soyad: ${p.fullName}`,
    `Telefon: ${p.phone}`,
    `E-posta: ${p.email}`,
    `Marka / işletme / kişi: ${p.brandName || "—"}`,
    `Bize nasıl ulaştınız: ${p.referralSource}`,
    "",
    "— Etkinlik bilgileri —",
    `Etkinlik türü: ${p.eventType}`,
    `Tarih: ${formatEventDateForMail(p.eventDate)}`,
    `Başlangıç: ${p.startTime} — Bitiş: ${p.endTime}`,
    `Şehir: ${p.city}`,
    `Mekân: ${p.venueName}`,
    `Adres / link: ${p.addressLink || "—"}`,
    `Açık / kapalı: ${p.indoorOutdoor}`,
    `Tahmini davetli: ${p.guestCount}`,
    "",
    "— Etkinlik akışı ve beklenti —",
    `Konsept: ${p.concept || "—"}`,
    `Önemli anlar: ${p.importantMoments || "—"}`,
    `Önemli anlar detay: ${p.importantMomentsDetail || "—"}`,
    `Enerji: ${p.energy}`,
    `Misafir profili: ${p.guestProfile || "—"}`,
    "",
    "— Müzik tercihleri —",
    `Öncelikli tarzlar: ${p.musicGenres.length ? p.musicGenres.join(", ") : "—"}`,
    `DJ anons / yönlendirme: ${p.djAnnounce}`,
    `Playlist linki: ${p.playlistLink || "—"}`,
    "",
    "— Teknik ve operasyon —",
    `Hazır ses sistemi: ${p.hasSoundSystem}`,
    `Mevcut sistem notu: ${p.soundSystemNotes || "—"}`,
    `Ek kurulum: ${p.extraTech.length ? p.extraTech.join(", ") : "—"}`,
    `Elektrik / masa / alan: ${p.powerOk}`,
    "",
    "— Teklif ve faturalandırma —",
    `Paket: ${p.packageChoice}`,
    `Ekstralar: ${p.extras.length ? p.extras.join(", ") : "—"}`,
    `Teklif adına: ${p.invoiceName}`,
    `Ödeme tercihi: ${p.paymentPref}`,
    "",
    "— Onaylar —",
    `${KVKK_CHECKBOX_LABELS[0]}: ${p.kvkkProcess ? "Evet" : "Hayır"}`,
    `${KVKK_CHECKBOX_LABELS[1]}: ${p.kvkkMarketing ? "Evet" : "Hayır"}`,
    `${KVKK_CHECKBOX_LABELS[2]}: ${p.kvkkAccurate ? "Evet" : "Hayır"}`,
    "",
    "— Ek not —",
    p.extraNotes || "—",
  ];
  return lines.join("\n");
}

function buildDetails(p: OzelEtkinlikPayload): Record<string, string> {
  return {
    form: "ozel_etkinlik_teklif",
    kaynak: p.kaynak,
    eventType: p.eventType,
    eventDate: p.eventDate,
    city: p.city,
    packageChoice: p.packageChoice,
    guestCount: p.guestCount,
  };
}

export async function submitOzelEtkinlikTeklif(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = formData.get("payload");
  if (typeof raw !== "string" || !raw.trim()) {
    return { ok: false, error: "Geçersiz gönderim" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, error: "Form verisi okunamadı" };
  }
  if (!isRecord(parsed)) return { ok: false, error: "Geçersiz form verisi" };

  const kaynakRaw = asStr(parsed.kaynak);
  const kaynak: "booking" | "b2b" = kaynakRaw === "b2b" ? "b2b" : "booking";
  const formType: ContactInquiryType = kaynak === "b2b" ? "b2b" : "booking";

  const p: OzelEtkinlikPayload = {
    kaynak,
    fullName: asStr(parsed.fullName),
    phone: asStr(parsed.phone),
    email: asStr(parsed.email),
    brandName: asStr(parsed.brandName),
    referralSource: asStr(parsed.referralSource),
    eventType: asStr(parsed.eventType),
    eventDate: asStr(parsed.eventDate),
    startTime: asStr(parsed.startTime),
    endTime: asStr(parsed.endTime),
    city: asStr(parsed.city),
    venueName: asStr(parsed.venueName),
    addressLink: asStr(parsed.addressLink),
    indoorOutdoor: asStr(parsed.indoorOutdoor),
    guestCount: asStr(parsed.guestCount),
    concept: asStr(parsed.concept),
    importantMoments: asStr(parsed.importantMoments),
    importantMomentsDetail: asStr(parsed.importantMomentsDetail),
    energy: asStr(parsed.energy),
    guestProfile: asStr(parsed.guestProfile),
    musicGenres: asStrArr(parsed.musicGenres),
    djAnnounce: asStr(parsed.djAnnounce),
    playlistLink: asStr(parsed.playlistLink),
    hasSoundSystem: asStr(parsed.hasSoundSystem),
    soundSystemNotes: asStr(parsed.soundSystemNotes),
    extraTech: asStrArr(parsed.extraTech),
    powerOk: asStr(parsed.powerOk),
    packageChoice: asStr(parsed.packageChoice),
    extras: asStrArr(parsed.extras),
    invoiceName: asStr(parsed.invoiceName),
    paymentPref: asStr(parsed.paymentPref),
    kvkkProcess: asBool(parsed.kvkkProcess),
    kvkkMarketing: asBool(parsed.kvkkMarketing),
    kvkkAccurate: asBool(parsed.kvkkAccurate),
    extraNotes: asStr(parsed.extraNotes),
  };

  if (!p.fullName || !p.phone || !p.email) {
    return { ok: false, error: "Ad, telefon ve e-posta zorunludur" };
  }
  if (!p.referralSource || !p.eventType || !p.startTime || !p.endTime) {
    return { ok: false, error: "Etkinlik ve saat bilgilerini tamamlayın" };
  }
  if (p.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(p.eventDate)) {
    return { ok: false, error: "Etkinlik tarihi geçersiz; takvimden seçin veya atlayın" };
  }
  if (!p.city || !p.venueName || !p.indoorOutdoor || !p.guestCount) {
    return { ok: false, error: "Mekân ve davetli bilgilerini eksiksiz doldurun" };
  }
  if (!p.energy || !p.djAnnounce || !p.hasSoundSystem || !p.powerOk || !p.packageChoice || !p.invoiceName || !p.paymentPref) {
    return { ok: false, error: "Teknik ve teklif adımlarında zorunlu seçimler eksik" };
  }
  if (!p.kvkkProcess || !p.kvkkAccurate) {
    return { ok: false, error: "KVKK ve doğruluk onaylarını işaretleyin" };
  }

  const subject = `${kaynak === "b2b" ? "B2B" : "Booking"} — Özel etkinlik teklif formu`;
  const message = buildMessage(p);
  const name = p.fullName;
  const details = buildDetails(p);

  try {
    await addContactInquiry({ type: formType, name, email: p.email, phone: p.phone, subject, message, details });
    const result = await sendContactMail({
      name,
      email: p.email,
      phone: p.phone,
      subject,
      message,
      formType,
      details,
    });
    if (!result.ok) return { ok: false, error: "E‑posta gönderilemedi" };
    return { ok: true };
  } catch (e) {
    console.error("[teklif] submit", e);
    return { ok: false, error: "Sunucu hatası" };
  }
}

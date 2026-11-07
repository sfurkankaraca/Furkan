// noqt club radio: DJ başvurusu ve marka teklifi. Doğrulama ve okunur etiketler (API, e-posta, admin ortak kullanır).
import { BRAND_BUDGET_OPTIONS, BRAND_KINDS, DJ_GENRES } from "@/lib/club-radio/content";

export type ClubRequestKindValue = "dj" | "brand";
export type ClubRequestStatusValue = "new" | "contacted" | "done" | "rejected";

export const CLUB_REQUEST_KIND_LABELS: Record<ClubRequestKindValue, string> = {
  dj: "DJ başvurusu",
  brand: "Marka teklifi",
};

/** E-posta konusu ve başlığı */
export const CLUB_REQUEST_MAIL_TITLES: Record<ClubRequestKindValue, string> = {
  dj: "Yeni DJ başvurusu",
  brand: "Yeni marka işbirliği teklifi",
};

export const CLUB_REQUEST_STATUSES: { value: ClubRequestStatusValue; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Görüşüldü" },
  { value: "done", label: "Tamamlandı" },
  { value: "rejected", label: "Reddedildi" },
];

export type DjPayload = {
  stageName: string;
  city: string;
  genres: string[];
  setUrl: string;
  instagram: string;
  experience: string;
};

export type BrandPayload = {
  brand: string;
  kinds: string[];
  date: string;
  budget: string;
  message: string;
};

export type ParsedClubRequest =
  | { kind: "dj"; name: string; email: string; phone: string; payload: DjPayload }
  | { kind: "brand"; name: string; email: string; phone: string; payload: BrandPayload };

type Parsed = { ok: true; data: ParsedClubRequest } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function tooLong(v: unknown, max: number): boolean {
  return typeof v === "string" && v.trim().length > max;
}

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(v: string): boolean {
  if (!/^[+\d\s()\-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isValidInstagram(v: string): boolean {
  if (/^@?[A-Za-z0-9._]{1,30}$/.test(v)) return true;
  return isHttpUrl(v) && /(^|\.)instagram\.com$/i.test(new URL(v).hostname);
}

function pickFrom(raw: unknown, allowed: readonly string[]): string[] | null {
  const arr = Array.isArray(raw) ? raw : [];
  const out: string[] = [];
  for (const g of arr) {
    if (typeof g !== "string" || !allowed.includes(g)) return null;
    if (!out.includes(g)) out.push(g);
  }
  return out;
}

const LABEL_EN: Record<string, string> = {
  "Ad soyad": "Full name",
  "E-posta": "Email",
  Telefon: "Phone",
  "Sahne adı": "Stage name",
  Şehir: "City",
  "Set bağlantısı": "Set link",
  Instagram: "Instagram",
  "Deneyim alanı": "Experience field",
  "Marka adı": "Brand name",
  Tarih: "Date",
  Mesaj: "Message",
};

/** `lang` yalnız hata metnini belirler ("en" → İngilizce); doğrulama mantığı aynıdır. */
export function parseClubRequest(body: unknown, lang: "tr" | "en" = "tr"): Parsed {
  const m = (tr: string, en: string) => (lang === "en" ? en : tr);
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const kind = b.kind;
  if (kind !== "dj" && kind !== "brand") return { ok: false, error: m("Geçersiz istek.", "Invalid request.") };

  const limits: [unknown, number, string][] = [
    [b.fullName, 100, "Ad soyad"],
    [b.email, 200, "E-posta"],
    [b.phone, 30, "Telefon"],
    [b.stageName, 100, "Sahne adı"],
    [b.city, 80, "Şehir"],
    [b.setUrl, 500, "Set bağlantısı"],
    [b.instagram, 100, "Instagram"],
    [b.experience, 300, "Deneyim alanı"],
    [b.brand, 150, "Marka adı"],
    [b.date, 120, "Tarih"],
    [b.message, 2000, "Mesaj"],
  ];
  for (const [v, max, label] of limits) {
    if (tooLong(v, max)) return { ok: false, error: m(`${label} çok uzun.`, `${LABEL_EN[label] ?? label} is too long.`) };
  }

  const name = str(b.fullName, 100);
  if (name.length < 2) return { ok: false, error: m("Lütfen adını ve soyadını yaz.", "Please enter your first and last name.") };
  const phone = str(b.phone, 30);

  if (kind === "dj") {
    const stageName = str(b.stageName, 100);
    const city = str(b.city, 80);
    if (!stageName) return { ok: false, error: m("Sahne adını yaz.", "Enter your stage name.") };
    if (!phone) return { ok: false, error: m("WhatsApp telefon numaranı yaz.", "Enter your WhatsApp phone number.") };
    if (!isValidPhone(phone)) return { ok: false, error: m("Telefon numarası geçerli görünmüyor.", "That phone number doesn't look valid.") };
    if (!city) return { ok: false, error: m("Şehrini yaz.", "Enter your city.") };

    const genres = pickFrom(b.genres, DJ_GENRES);
    if (genres === null) return { ok: false, error: m("Seçilen türlerden biri geçerli değil.", "One of the selected genres isn't valid.") };
    if (genres.length === 0) return { ok: false, error: m("En az bir tür seç.", "Pick at least one genre.") };

    const setUrl = str(b.setUrl, 500);
    if (!setUrl) return { ok: false, error: m("Set bağlantını ekle.", "Add your set link.") };
    if (!isHttpUrl(setUrl)) return { ok: false, error: m("Set bağlantısı http:// ya da https:// ile başlamalı.", "The set link must start with http:// or https://.") };

    const instagram = str(b.instagram, 100);
    if (instagram && !isValidInstagram(instagram)) return { ok: false, error: m("Instagram hesabı geçerli görünmüyor.", "That Instagram account doesn't look valid.") };

    return {
      ok: true,
      data: {
        kind: "dj",
        name,
        email: "",
        phone,
        payload: { stageName, city, genres, setUrl, instagram, experience: str(b.experience, 300) },
      },
    };
  }

  // Marka teklifi
  const email = str(b.email, 200);
  const brand = str(b.brand, 150);
  if (!brand) return { ok: false, error: m("Marka ya da şirket adını yaz.", "Enter the brand or company name.") };
  if (!EMAIL_RE.test(email)) return { ok: false, error: m("E-posta adresi geçerli görünmüyor.", "That email address doesn't look valid.") };
  if (phone && !isValidPhone(phone)) return { ok: false, error: m("Telefon numarası geçerli görünmüyor.", "That phone number doesn't look valid.") };

  const kinds = pickFrom(b.kinds, BRAND_KINDS);
  if (kinds === null) return { ok: false, error: m("Seçilen işbirliği türlerinden biri geçerli değil.", "One of the selected collaboration types isn't valid.") };
  if (kinds.length === 0) return { ok: false, error: m("En az bir işbirliği türü seç.", "Pick at least one collaboration type.") };

  const budget = str(b.budget, 60);
  if (budget && !(BRAND_BUDGET_OPTIONS as readonly string[]).includes(budget)) {
    return { ok: false, error: m("Seçilen bütçe aralığı geçerli değil.", "The selected budget range isn't valid.") };
  }

  const message = str(b.message, 2000);
  if (message.length < 5) return { ok: false, error: m("Fikrini kısaca anlat.", "Tell us your idea in brief.") };

  return {
    ok: true,
    data: {
      kind: "brand",
      name,
      email,
      phone,
      payload: { brand, kinds, date: str(b.date, 120), budget, message },
    },
  };
}

export type PayloadRow = { label: string; value: string; href?: string };

function instagramHref(v: string): string {
  if (isHttpUrl(v)) return v;
  return `https://www.instagram.com/${v.replace(/^@/, "")}`;
}

/** Kayıtlı payload'ı okunur satırlara çevirir (admin ve e-posta). Bozuk/eksik alanlarda çökmez. */
export function describeClubPayload(kind: ClubRequestKindValue, payload: unknown): PayloadRow[] {
  const p = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const s = (k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
  const list = (k: string) =>
    Array.isArray(p[k]) ? (p[k] as unknown[]).filter((x): x is string => typeof x === "string").join(", ") : "";
  const rows: PayloadRow[] = [];
  const add = (label: string, value: string, href?: string) => {
    if (value) rows.push({ label, value, href });
  };

  if (kind === "dj") {
    add("Sahne adı", s("stageName"));
    add("Şehir", s("city"));
    add("Türler", list("genres"));
    add("Set bağlantısı", s("setUrl"), isHttpUrl(s("setUrl")) ? s("setUrl") : undefined);
    add("Instagram", s("instagram"), s("instagram") && isValidInstagram(s("instagram")) ? instagramHref(s("instagram")) : undefined);
    add("Daha önce çaldığı yerler", s("experience"));
  } else {
    add("Marka / şirket", s("brand"));
    add("İşbirliği türü", list("kinds"));
    add("Tarih", s("date"));
    add("Bütçe", s("budget"));
    add("Fikir", s("message"));
  }
  return rows;
}

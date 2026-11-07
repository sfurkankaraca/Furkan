/** noqt club radio dil seçimi: çerez adı, türler ve yardımcılar (sunucu ve istemci güvenli). */
export type Lang = "tr" | "en";

export const LANG_COOKIE = "noqt_lang";
export const DEFAULT_LANG: Lang = "tr";

export function parseLang(v: unknown): Lang {
  return v === "en" ? "en" : "tr";
}

export function isLang(v: unknown): v is Lang {
  return v === "tr" || v === "en";
}

/** Tarih/sayı biçimi için Intl yerel adı. */
export function intlLocale(lang: Lang): string {
  return lang === "en" ? "en-GB" : "tr-TR";
}

export const SITE_TZ = "Europe/Istanbul";

export function formatDate(iso: string | Date, lang: Lang, opts: Intl.DateTimeFormatOptions): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(intlLocale(lang), { timeZone: SITE_TZ, ...opts }).format(d);
}

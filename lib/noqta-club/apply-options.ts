/** Noqta Club başvuru formu — çoktan seçmeli sabitler (API ile paylaşılır). */

export const NOQTA_CLUB_REFERRAL_SOURCE_OPTIONS = [
  "Arkadaş / referans",
  "Instagram",
  "Etkinlikte / sahadan",
  "Radio / playlist",
  "Web sitesi",
  "Diğer",
] as const;

export const NOQTA_CLUB_MAIN_REASON_OPTIONS = [
  "Topluluk / network",
  "Öğrenmek ve gelişmek (DJ, prodüksiyon)",
  "Sahne ve performans",
  "Birlikte etkinlik veya proje üretmek",
  "Diğer",
] as const;

export const NOQTA_CLUB_MUSIC_INTEREST_OPTIONS = [
  "Elektronik (techno, house, trance vb.)",
  "Canlı / indie / alternatif",
  "Hip-hop / R&B",
  "Çok çeşitli — tek türle sınırlı değilim",
  "Henüz emin değilim / keşfediyorum",
  "Diğer",
] as const;

export function isAllowedOption<T extends readonly string[]>(value: string, list: T): value is T[number] {
  return (list as readonly string[]).includes(value);
}

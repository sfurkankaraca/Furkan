/**
 * Sanatçı / DJ dizini — noqta'nın dikey network sütununun ilk adımı.
 * Keşfedilebilir vitrin: profil, tür, bağlantı ve rozetler. Feed/mesaj yok.
 *
 * Küratörlüdür: buraya yalnızca GERÇEK, kendi onayıyla listelenen kişiler girer.
 * Yeni kayıtlar /join (DJ rolü) başvurusundan gelir; admin onayıyla eklenir.
 * Sahte/uydurma profil eklenmez.
 */

export type ArtistBadge = "booking" | "mentor" | "resident" | "producer" | "educator";

export type ArtistLink = {
  label: string;
  href: string;
};

export type ArtistProfile = {
  slug: string;
  name: string;
  /** Kısa rol tanımı, ör. "DJ · Prodüktör · Ses mühendisi" */
  role: string;
  city?: string;
  genres: string[];
  badges: ArtistBadge[];
  /** 1-2 cümlelik vitrin özeti */
  tagline: string;
  /** Profil sayfasındaki paragraflar */
  bio: string[];
  links: ArtistLink[];
  /** SoundCloud/Spotify/YouTube gömme URL'i (iframe src) — opsiyonel */
  embedUrl?: string;
  /** Profil görseli /public yolu ya da tam URL — boşsa monogram */
  imageUrl?: string;
  /** noqt ekosistemiyle ilişkisi (kurucu, mezun, resident, partner) */
  affiliation?: string;
  /** Booking butonunun gideceği adres — yoksa /booking */
  bookingUrl?: string;
  /** İçerik başka bir sitede asılsa (ör. noqt.events profili) kanonik adres orası olur */
  canonicalUrl?: string;
};

export const BADGE_LABEL: Record<ArtistBadge, string> = {
  booking: "Booking'e açık",
  mentor: "Mentorluk veriyor",
  resident: "Resident",
  producer: "Prodüktör",
  educator: "Eğitmen",
};

export const ARTISTS: readonly ArtistProfile[] = [
  {
    slug: "furkan-karaca",
    name: "Furkan Karaca",
    role: "Müzisyen · Prodüktör · Ses mühendisi · DJ · Eğitmen",
    city: "Kayseri / İstanbul",
    genres: ["Elektronik", "House", "Downtempo", "Alternatif"],
    badges: ["resident", "producer", "educator", "mentor", "booking"],
    affiliation: "noqt kurucusu",
    tagline:
      "8 yaşında bağlamayla başlayan; sahne, stüdyo ve eğitimi tek çatı altında toplayan çok yönlü bir müzisyen ve noqt'un kurucusu.",
    bio: [
      "Furkan Karaca; müzisyen, yapımcı, ses mühendisi, DJ, eğitmen ve mentordur. Müziğe 8 yaşında bağlama ile başladı; yıllar içinde trombon, bas gitar, elektro gitar, vokal, prodüksiyon, ses ve sahne alanlarında çok yönlü bir deneyim geliştirdi.",
      "2020'de İstanbul Bilgi Üniversitesi Müzik Bölümü'nü %100 bursla kazandı. İstanbul'da farklı sahnelerde müzisyen ve sesçi olarak, stüdyo tarafında ise prodüktör, kayıt ses mühendisi ve vokal koçu olarak çalıştı. 2023-2026 arasında Jolly Joker Kayseri'de tonmaister ve resident DJ olarak görev aldı.",
      "2022'de yayımladığı ilk albümündeki bestelerinden \"Her Şey Biter De\", Sertab Erener tarafından yeniden yorumlanarak 2025'te \"Böyledir Benim Ayrılıklarım\" adıyla yayımlandı. 29 Eylül 2025'te kurduğu noqt ile müzik üretimi, eğitim ve yaratıcı ekosistem geliştirme alanlarında çalışmalarını sürdürüyor.",
    ],
    links: [{ label: "Profil sayfası", href: "/furkan-karaca" }],
    imageUrl: "",
  },
];

export function artistBySlug(slug: string): ArtistProfile | undefined {
  return ARTISTS.find((a) => a.slug === slug);
}

export function artistSlugs(): string[] {
  return ARTISTS.map((a) => a.slug);
}

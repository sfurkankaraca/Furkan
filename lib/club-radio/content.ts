// noqt club radio: sabit içerik ve yapılandırma. Boş (null / []) değerler, bağlı bölümü ya da bağlantıyı gizler.
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@noqtclubradio";
export const INSTAGRAM_URL = "https://www.instagram.com/noqtclub";
export const CONTACT_EMAIL = "hi@noqt.club";

/** Kurucudan gelecek: dolunca ilgili bağlantı/bölüm görünür. */
export const SOUNDCLOUD_URL: string | null = null;
export const WHATSAPP_CHANNEL_URL: string | null = null;
export const MEDIA_KIT_URL: string | null = null;

export const NOQT_SOCIAL = {
  site: "https://noqt.social",
  appStore: null as string | null,
  googlePlay: null as string | null,
};

/** Kitle istatistikleri (gerçek rakamlar gelince doldurulur); boşsa "Kitlemiz" bölümü gösterilmez. */
export const AUDIENCE_STATS: { value: string; label: string }[] = [];

export type SetVideo = {
  id: string;
  kind: string;
  artists: string;
  title: string;
  image: string;
};

export const SET_VIDEOS: SetVideo[] = [
  {
    id: "Jv4LONVJgW8",
    kind: "House mix · noqt stüdyo",
    artists: "YSEIKO · Furkan Karaca · Aslound",
    title: "House Mix at noqtastudio",
    image: "/club-radio/yt-house-mix.jpg",
  },
  {
    id: "P4bYVZOm22w",
    kind: "Halloween · nu disco",
    artists: "YSEİKO · Furkan Karaca · Mahmut Can",
    title: "Halloween Nu Disco Mix at Alley's Nail Studio",
    image: "/club-radio/yt-halloween.jpg",
  },
];

export const DJ_GENRES = ["House", "Tech house", "Techno", "Hardgroove", "Afro house", "Nu disco", "Breaks", "R&B", "Hip hop"] as const;

export const BRAND_KINDS = [
  "Ortak gece",
  "Yayın sponsorluğu",
  "Ürün ve tadım",
  "Mekân işbirliği",
  "İçerik üretimi",
  "Lansman ve özel etkinlik",
] as const;

export const BRAND_BUDGET_OPTIONS = [
  "₺25.000'e kadar",
  "₺25.000 – ₺75.000",
  "₺75.000 – ₺150.000",
  "₺150.000 üzeri",
  "Henüz bilmiyorum",
] as const;

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

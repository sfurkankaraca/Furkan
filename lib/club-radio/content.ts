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

/** Bilinen videolar: başlık, sanatçılar ve yerel küçük resim. Bilinmeyen kimlikler için başlık YouTube oEmbed'den çekilir. */
export const KNOWN_SET_VIDEOS: Record<string, SetVideo> = {
  _HhoBgmEHPs: {
    id: "_HhoBgmEHPs",
    kind: "noqt club meeting",
    artists: "Furkan Karaca · YSEIKO · ASLOUND · Erdal Coşkun",
    title: "NoqtClub Meeting 4.0",
    image: "/club-radio/yt-meeting-4.jpg",
  },
  "4CyGEtQNvWo": {
    id: "4CyGEtQNvWo",
    kind: "House set",
    artists: "Mahmut Can · Furkan Karaca · YSEİKO · Aslound · Erdal Coşkun",
    title: "Nostalgic House Set",
    image: "/club-radio/yt-nostalgic-house.jpg",
  },
  Jv4LONVJgW8: {
    id: "Jv4LONVJgW8",
    kind: "House mix · noqt stüdyo",
    artists: "YSEIKO · Furkan Karaca · Aslound",
    title: "House Mix at noqtastudio",
    image: "/club-radio/yt-house-mix.jpg",
  },
  P4bYVZOm22w: {
    id: "P4bYVZOm22w",
    kind: "Halloween · nu disco",
    artists: "YSEİKO · Furkan Karaca · Mahmut Can",
    title: "Halloween Nu Disco Mix at Alley's Nail Studio",
    image: "/club-radio/yt-halloween.jpg",
  },
};

/** Site yapılandırması okunamazsa kullanılan sıra; _HhoBgmEHPs (Meeting 4.0) her zaman başta. */
export const DEFAULT_SET_IDS = ["_HhoBgmEHPs", "4CyGEtQNvWo", "Jv4LONVJgW8", "P4bYVZOm22w"] as const;

/** Geriye dönük uyumluluk: varsayılan sırada bilinen videolar. */
export const SET_VIDEOS: SetVideo[] = DEFAULT_SET_IDS.map((id) => KNOWN_SET_VIDEOS[id]);

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

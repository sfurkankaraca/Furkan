import { BLOG_POSTS, type BlogPostMeta } from "@/lib/blog/registry";

export type SeriesId =
  | "sahne-raporu"
  | "efsaneler"
  | "parcanin-hikayesi"
  | "sahne-haritasi"
  | "baslangic-seti";

export type SeriesMeta = {
  id: SeriesId;
  name: string;
  tagline: string;
  /** Yayın sıklığı — okura verilen söz */
  cadence: string;
};

/**
 * Devam eden yazı dizileri. Her dizi kendi ritmiyle sürer; okur bir diziyi
 * takip edebilsin diye yazı sayfasında ve Journal ana sayfasında gruplanır.
 */
export const SERIES: Record<SeriesId, SeriesMeta> = {
  "sahne-raporu": {
    id: "sahne-raporu",
    name: "Sahne raporu",
    tagline: "Elektronik müzik dünyasından haberler, çıkışlar ve sahne gelişmeleri — kaynağıyla birlikte.",
    cadence: "Aylık",
  },
  efsaneler: {
    id: "efsaneler",
    name: "Efsaneler",
    tagline: "Türün tarihini yazan isimler: kökenleri, kilit işleri ve bugüne uzanan etkileri.",
    cadence: "İki haftada bir",
  },
  "parcanin-hikayesi": {
    id: "parcanin-hikayesi",
    name: "Parçanın hikâyesi",
    tagline: "Tek bir kaydın peşine düşüyoruz: nasıl yapıldı, neyi değiştirdi, neden hâlâ çalınıyor.",
    cadence: "Haftalık",
  },
  "sahne-haritasi": {
    id: "sahne-haritasi",
    name: "Sahne haritası",
    tagline: "Şehir şehir elektronik müzik: mekanlar, kolektifler, geceye çıkma rehberi.",
    cadence: "Aylık",
  },
  "baslangic-seti": {
    id: "baslangic-seti",
    name: "Başlangıç seti",
    tagline: "Bir türe ya da bir konuya sıfırdan girmek isteyenler için seçki ve yol haritası.",
    cadence: "İki haftada bir",
  },
};

export const SERIES_ORDER: SeriesId[] = [
  "sahne-raporu",
  "parcanin-hikayesi",
  "efsaneler",
  "sahne-haritasi",
  "baslangic-seti",
];

export function seriesOf(post: BlogPostMeta): SeriesMeta | undefined {
  return post.series ? SERIES[post.series] : undefined;
}

/** Bir dizinin yazıları — eskiden yeniye (bölüm numarası için). */
export function postsInSeries(id: SeriesId): BlogPostMeta[] {
  return BLOG_POSTS.filter((p) => p.series === id).sort((a, b) =>
    a.publishedAt < b.publishedAt ? -1 : a.publishedAt > b.publishedAt ? 1 : 0
  );
}

/** Yazının dizideki sıra numarası (1'den başlar). */
export function episodeNumber(post: BlogPostMeta): number | undefined {
  if (!post.series) return undefined;
  const i = postsInSeries(post.series).findIndex((p) => p.slug === post.slug);
  return i >= 0 ? i + 1 : undefined;
}

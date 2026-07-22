import type { BlogPostMeta } from "@/lib/blog/registry";

export type BlogCover = {
  /** /public altındaki dosya ya da tam URL */
  src: string;
  alt: string;
  /** Fotoğrafın kaynağı — telif gereği görünür şekilde basılır */
  credit?: string;
  creditUrl?: string;
};

/**
 * Yazı kapakları. Telifli basın fotoğrafı kullanmıyoruz; buraya yalnızca
 * (a) noqta'nın kendi arşivi veya (b) lisansı uygun (CC/kamu malı) görseller girer.
 * Kapak tanımlanmayan yazılar tipografik kapağa düşer (BlogCoverArt).
 */
export const BLOG_COVERS: Record<string, BlogCover> = {
  "kraftwerk-elektronik-muzigin-mimarlari": {
    src: "/journal/kraftwerk-elektronik-muzigin-mimarlari.jpg",
    alt: "Kraftwerk sahnede, neon ızgara kostümleriyle dört üye klavyelerinin başında",
    credit: "Slyronit, CC BY-SA 4.0 / Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Kraftwerk_Multimedia_Tour_Bangkok_2026_-_Numbers.jpg",
  },
  "frankie-knuckles-house-muzigin-babasi": {
    src: "/journal/frankie-knuckles-house-muzigin-babasi.jpg",
    alt: "Frankie Knuckles DJ kabininde plak çalarların başında",
    credit: "HaeB, CC BY-SA 4.0 / Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Frankie_Knuckles_at_The_Mighty_(SF),_2012_-2.jpg",
  },
  "detroit-belleville-three-techno-dogusu": {
    src: "/journal/detroit-belleville-three-techno-dogusu.jpg",
    alt: "Detroit techno öncülerinden Derrick May",
    credit: "ThatChickOverThere, CC BY-SA 4.0 / Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Derrick_May_of_Transmat_Records_Detroit_Techno_Pioneer.jpg",
  },
  "jeff-mills-the-wizard-techno-ustasi": {
    src: "/journal/jeff-mills-the-wizard-techno-ustasi.jpg",
    alt: "Jeff Mills kulaklıkla DJ kabininde",
    credit: "Dave Walker, CC BY 2.0 / Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Jeff_Mills_5.jpg",
  },
  "daft-punk-elektronik-muzigi-pop-yapan-ikili": {
    src: "/journal/daft-punk-elektronik-muzigi-pop-yapan-ikili.jpg",
    alt: "Daft Punk ikilisi gümüş ve altın kasklarıyla",
    credit: "Sony Music Entertainment, CC BY 4.0 / Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Daft_Punk_in_2013.jpg",
  },
  "carl-cox-sahnenin-yasayan-efsanesi": {
    src: "/journal/carl-cox-sahnenin-yasayan-efsanesi.jpg",
    alt: "Carl Cox güneş gözlükleriyle etkinlik alanında",
    credit: "Sergey Kozak, CC BY 2.0 / Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Carl_Cox_@_ADE_2012.jpg",
  },
};

export function coverFor(post: BlogPostMeta): BlogCover | undefined {
  return BLOG_COVERS[post.slug];
}

/** Slug'dan sabit bir renk çifti — tipografik kapak için. */
export function coverPalette(slug: string): { from: string; to: string; ink: string } {
  const palettes = [
    { from: "oklch(0.72 0.17 20)", to: "oklch(0.55 0.20 350)", ink: "oklch(0.99 0 0)" },
    { from: "oklch(0.70 0.15 250)", to: "oklch(0.45 0.18 285)", ink: "oklch(0.99 0 0)" },
    { from: "oklch(0.78 0.16 85)", to: "oklch(0.58 0.17 40)", ink: "oklch(0.15 0.02 60)" },
    { from: "oklch(0.74 0.14 175)", to: "oklch(0.48 0.15 220)", ink: "oklch(0.99 0 0)" },
    { from: "oklch(0.68 0.18 320)", to: "oklch(0.42 0.16 265)", ink: "oklch(0.99 0 0)" },
    { from: "oklch(0.80 0.13 130)", to: "oklch(0.52 0.16 165)", ink: "oklch(0.15 0.02 150)" },
  ];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

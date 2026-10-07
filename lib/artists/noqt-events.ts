import { ARTISTS, type ArtistLink, type ArtistProfile } from "./registry";

/**
 * noqt.events kadrosundaki DJ'ler — tek kaynak noqt.events (Supabase dj_profiles, onaylı + aktif).
 * Gizli anahtar paylaşmamak için noqt.events'in herkese açık sayfalarından okunur:
 *   1) /sanatcilar (varsayılan DJ sekmesi) → profil id'leri, sitedeki sırasıyla
 *   2) /sanatcilar/<id> → Person JSON-LD (ad, bio, görsel, sosyal linkler)
 * 5 dakika önbelleklenir; noqt.events'e ulaşılamazsa boş liste döner, sayfa yalnızca registry ile açılır.
 */
const EVENTS_BASE = "https://www.noqt.events";
const REVALIDATE_SECONDS = 300; // noqt.events değişiklikleri en geç 5 dk içinde yansır

type PersonLd = {
  "@type"?: string;
  name?: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  sameAs?: string[];
};

export function slugifyTr(s: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
  return s
    .replace(/[çğıİöşüâîû]/gi, (ch) => map[ch] ?? map[ch.toLowerCase()] ?? ch)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const nameKey = (s: string) => slugifyTr(s);

function linkLabel(href: string) {
  const h = href.toLowerCase();
  if (h.includes("instagram.com")) return "Instagram";
  if (h.includes("spotify.com")) return "Spotify";
  if (h.includes("soundcloud.com")) return "SoundCloud";
  if (h.includes("mixcloud.com")) return "Mixcloud";
  if (h.includes("youtube.com") || h.includes("youtu.be")) return "YouTube";
  return "Web sitesi";
}

async function fetchText(url: string) {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

function parsePersonLd(html: string): PersonLd | null {
  const blocks = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw) as PersonLd;
      if (data["@type"] === "Person" && data.name) return data;
    } catch {
      // diğer JSON-LD blokları
    }
  }
  return null;
}

/** Profil sayfasındaki videolar: noqt.events'e yüklenmiş dosyalar + gömülü YouTube videoları. */
function parseVideos(html: string): NonNullable<ArtistProfile["videos"]> {
  const files = [...new Set([...html.matchAll(/https:\/\/media\.noqt\.events\/[^"'\s\\]+?\.(?:mp4|webm|mov)/g)].map((m) => m[0]))];
  const yt = [...new Set([...html.matchAll(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/g)].map((m) => m[1]))];
  return [
    ...files.map((src) => ({ kind: "file" as const, src })),
    ...yt.map((v) => ({ kind: "youtube" as const, src: `https://www.youtube.com/watch?v=${v}` })),
  ];
}

function toArtist(id: string, p: PersonLd, videos: ArtistProfile["videos"] = []): ArtistProfile {
  const bio = (p.description ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  // İlk cümle vitrin özeti olur; profilde tekrar etmesin diye gövdeden çıkarılır.
  const firstSentence = bio[0]?.match(/^.{0,220}?[.!?](\s|$)/)?.[0].trim() ?? "";
  if (firstSentence) {
    bio[0] = bio[0].slice(firstSentence.length).trim();
    if (!bio[0]) bio.shift();
  }
  const profileUrl = `${EVENTS_BASE}/sanatcilar/${id}`;
  const links: ArtistLink[] = (p.sameAs ?? []).map((href) => ({ label: linkLabel(href), href }));
  links.push({ label: "noqt.events profili", href: profileUrl });

  return {
    slug: slugifyTr(p.name!),
    name: p.name!,
    role: "DJ",
    genres: [],
    badges: ["booking"],
    tagline: firstSentence || `${p.name} noqt.events kadrosunda yer alan bir DJ.`,
    bio,
    links,
    imageUrl: p.image,
    affiliation: "noqt.events kadrosu",
    bookingUrl: profileUrl,
    canonicalUrl: profileUrl,
    videos,
  };
}

export async function fetchNoqtEventsDjs(): Promise<ArtistProfile[]> {
  try {
    const listHtml = await fetchText(`${EVENTS_BASE}/sanatcilar`);
    const ids = [...new Set([...listHtml.matchAll(/href="\/sanatcilar\/([0-9a-f-]{36})"/g)].map((m) => m[1]))];
    const profiles = await Promise.all(
      ids.map(async (id) => {
        try {
          const html = await fetchText(`${EVENTS_BASE}/sanatcilar/${id}`);
          const p = parsePersonLd(html);
          return p ? toArtist(id, p, parseVideos(html)) : null;
        } catch {
          return null;
        }
      }),
    );
    return profiles.filter((a): a is ArtistProfile => a !== null);
  } catch {
    return [];
  }
}

/**
 * Sitedeki tüm sanatçılar: önce küratörlü registry, ardından noqt.events DJ'leri.
 * Aynı kişi iki yerde de varsa registry profili kalır; eksik görsel ve noqt.events bağlantısı tamamlanır.
 */
export async function getAllArtists(): Promise<ArtistProfile[]> {
  const events = await fetchNoqtEventsDjs();
  const curatedByName = new Map(ARTISTS.map((a) => [nameKey(a.name), a]));

  // Sıra noqt.events'teki sıradır; registry'de özel profili olan kişi kendi yerinde, zenginleştirilmiş haliyle gelir.
  const merged = events.map((e) => {
    const a = curatedByName.get(nameKey(e.name));
    if (!a) return e;
    curatedByName.delete(nameKey(e.name));
    const eventsLink = e.links.find((l) => l.label === "noqt.events profili");
    return {
      ...a,
      imageUrl: a.imageUrl || e.imageUrl,
      links: eventsLink && !a.links.some((l) => l.href === eventsLink.href) ? [...a.links, eventsLink] : a.links,
      bookingUrl: a.bookingUrl ?? e.bookingUrl,
      videos: a.videos?.length ? a.videos : e.videos,
    };
  });

  // noqt.events'te olmayan registry profilleri başa; slug çakışması varsa noqt.events kaydına ek alır.
  const onlyCurated = [...curatedByName.values()];
  const usedSlugs = new Set(onlyCurated.map((a) => a.slug));
  return [...onlyCurated, ...merged.map((e) => (usedSlugs.has(e.slug) ? { ...e, slug: `${e.slug}-dj` } : e))];
}

export async function getArtistBySlug(slug: string) {
  return (await getAllArtists()).find((a) => a.slug === slug);
}

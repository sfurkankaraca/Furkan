import { ARTISTS, type ArtistLink, type ArtistProfile } from "./registry";

/**
 * noqt.events kadrosundaki DJ'ler — tek kaynak noqt.events (Supabase dj_profiles, onaylı + aktif).
 * Gizli anahtar paylaşmamak için noqt.events'in herkese açık sayfalarından okunur:
 *   1) /sanatcilar (varsayılan DJ sekmesi) → profil id'leri, sitedeki sırasıyla
 *   2) /sanatcilar/<id> → Person JSON-LD (ad, bio, görsel, sosyal linkler)
 * 6 saat önbelleklenir; noqt.events'e ulaşılamazsa boş liste döner, sayfa yalnızca registry ile açılır.
 */
const EVENTS_BASE = "https://www.noqt.events";
const REVALIDATE_SECONDS = 21600;

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

function toArtist(id: string, p: PersonLd): ArtistProfile {
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
  };
}

export async function fetchNoqtEventsDjs(): Promise<ArtistProfile[]> {
  try {
    const listHtml = await fetchText(`${EVENTS_BASE}/sanatcilar`);
    const ids = [...new Set([...listHtml.matchAll(/href="\/sanatcilar\/([0-9a-f-]{36})"/g)].map((m) => m[1]))];
    const profiles = await Promise.all(
      ids.map(async (id) => {
        try {
          const p = parsePersonLd(await fetchText(`${EVENTS_BASE}/sanatcilar/${id}`));
          return p ? toArtist(id, p) : null;
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
  const byName = new Map(events.map((e) => [nameKey(e.name), e]));

  const curated = ARTISTS.map((a) => {
    const match = byName.get(nameKey(a.name));
    if (!match) return a;
    byName.delete(nameKey(a.name));
    const eventsLink = match.links.find((l) => l.label === "noqt.events profili");
    return {
      ...a,
      imageUrl: a.imageUrl || match.imageUrl,
      links: eventsLink && !a.links.some((l) => l.href === eventsLink.href) ? [...a.links, eventsLink] : a.links,
      bookingUrl: a.bookingUrl ?? match.bookingUrl,
    };
  });

  const usedSlugs = new Set(curated.map((a) => a.slug));
  const rest = events
    .filter((e) => byName.has(nameKey(e.name)))
    .map((e) => (usedSlugs.has(e.slug) ? { ...e, slug: `${e.slug}-dj` } : e));

  return [...curated, ...rest];
}

export async function getArtistBySlug(slug: string) {
  return (await getAllArtists()).find((a) => a.slug === slug);
}

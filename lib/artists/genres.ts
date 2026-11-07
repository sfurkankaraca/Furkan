/**
 * noqt.events DJ listesinden "ana türler" çıkarma.
 * /sanatcilar sayfasının Next/RSC yükünde (kaçışlı JSON) her DJ kaydı `speciality` (serbest metin)
 * ve `concept_tags` (tür adları + slug biçimli ruh hali etiketleri) alanlarını taşır. Her hata "tür yok" demektir.
 */

export const MAX_MAIN_GENRES = 3;

const ROLE_WORDS = new Set(["dj", "producer", "prodüktör", "produktor", "music curator", "curator", "mc"]);

/** concept_tags içinden yalnızca bilinen türler alınır. */
export const KNOWN_GENRES = [
  "House",
  "Deep House",
  "Tech House",
  "Afro House",
  "Latin House",
  "Melodic House",
  "Techno",
  "Hard Techno",
  "Melodic Techno",
  "Minimal",
  "Hardgroove",
  "Disco",
  "Nu Disco",
  "Indie Dance",
  "Breaks",
  "Drum & Bass",
  "Hip Hop",
  "R&B",
  "Türkçe Pop",
  "Türkçe Rap",
  "Amapiano",
  "Moombahton",
] as const;

const lower = (s: string) => s.toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
const key = (s: string) => lower(s).replace(/i̇/g, "i").replace(/ı/g, "i");

const KNOWN_BY_KEY = new Map<string, string>(KNOWN_GENRES.map((g) => [key(g), g]));

function capitalizeWord(w: string): string {
  if (!w) return w;
  // R&B, DnB gibi içinde büyük harf olan sözcükler olduğu gibi kalır.
  if (/[A-ZÇĞİÖŞÜ]/.test(w.slice(1))) return w;
  const first = w[0];
  const up = first === "i" || first === "ı" ? "I" : first.toLocaleUpperCase("en");
  return up + w.slice(1).toLocaleLowerCase("tr-TR").replace(/^i̇/, "i");
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w === "&" || w === "ve" || w === "and" ? w : w.includes("-") ? w.split("-").map(capitalizeWord).join("-") : capitalizeWord(w)))
    .join(" ");
}

function isRoleOnly(item: string): boolean {
  const l = lower(item);
  if (ROLE_WORDS.has(l)) return true;
  // "DJ Producer" gibi yalnız rol sözcüklerinden oluşan öbekler
  const words = l.split(" ");
  let i = 0;
  while (i < words.length) {
    const two = words.slice(i, i + 2).join(" ");
    if (ROLE_WORDS.has(two)) i += 2;
    else if (ROLE_WORDS.has(words[i])) i += 1;
    else return false;
  }
  return true;
}

/** `speciality` serbest metninden tür listesi. */
export function genresFromSpeciality(speciality: string | null | undefined): string[] {
  if (!speciality) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of speciality.split(/[,/•·;]/)) {
    const item = raw.replace(/\s+/g, " ").trim();
    if (!item || item.length > 28 || isRoleOnly(item)) continue;
    const known = KNOWN_BY_KEY.get(key(item));
    // Harf içermeyen ("80-90"), çok kısa ya da tek harfle başlayan (yazım hatası) öbekler tür sayılmaz.
    if (!known && (!/\p{L}/u.test(item) || item.length < 4 || /^\p{L}\s/u.test(item))) continue;
    const nice = known ?? titleCase(item);
    const k = key(nice);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(nice);
  }
  return out;
}

/** `concept_tags` içinden bilinen türler (slug biçimli ruh hali etiketleri elenir). */
export function genresFromConceptTags(tags: readonly string[] | null | undefined): string[] {
  if (!tags) return [];
  const out: string[] = [];
  for (const t of tags) {
    const g = typeof t === "string" ? KNOWN_BY_KEY.get(key(t)) : undefined;
    if (g && !out.includes(g)) out.push(g);
  }
  return out;
}

export function mainGenres(speciality: string | null | undefined, tags: readonly string[] | null | undefined): string[] {
  const fromSpec = genresFromSpeciality(speciality);
  const list = fromSpec.length >= 1 ? fromSpec : genresFromConceptTags(tags);
  return list.slice(0, MAX_MAIN_GENRES);
}

type ListRecord = { speciality: string | null; tags: string[] };

/** JSON dizgesi hazırlığı: `"..."` biçiminde bir literal'i çöz, olmazsa null. */
function jsonString(lit: string): string | null {
  try {
    const v = JSON.parse(lit);
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Liste sayfası HTML'inden { profilId → tür listesi }.
 * Her kayıt `"id":"<uuid>"` ile başlar; bir sonraki kimliğe kadar olan dilimden `speciality` ve `concept_tags` okunur.
 */
export function parseListGenres(html: string): Map<string, string[]> {
  const result = new Map<string, string[]>();
  try {
    const text = html.replace(/\\"/g, '"');
    const re = /"id":"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/g;
    const starts: { id: string; at: number }[] = [];
    for (const m of text.matchAll(re)) starts.push({ id: m[1], at: m.index ?? 0 });
    for (let i = 0; i < starts.length; i++) {
      const { id, at } = starts[i];
      if (result.has(id)) continue;
      const end = Math.min(starts[i + 1]?.at ?? text.length, at + 12000);
      const chunk = text.slice(at, end);
      const rec: ListRecord = { speciality: null, tags: [] };
      const sp = chunk.match(/"speciality":(null|"(?:[^"\\]|\\.)*")/);
      if (sp && sp[1] !== "null") rec.speciality = jsonString(sp[1]);
      const ct = chunk.match(/"concept_tags":(\[[^\]]*\])/);
      if (ct) {
        try {
          const arr = JSON.parse(ct[1]);
          if (Array.isArray(arr)) rec.tags = arr.filter((x): x is string => typeof x === "string");
        } catch {
          /* etiketler okunamadı */
        }
      }
      const g = mainGenres(rec.speciality, rec.tags);
      if (g.length > 0) result.set(id, g);
    }
  } catch {
    return new Map();
  }
  return result;
}

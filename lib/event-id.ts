/** Etkinlik URL segmenti: yalnızca [a-z0-9-] — &, /, .. ve Unicode sorunlarını önler */

export function slugifyForEventPath(title: string): string {
  let s = title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "");
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return s.slice(0, 72) || "etkinlik";
}

export function datePartFromFormDate(dateInput: string): string {
  const raw = String(dateInput).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return "tarih";
}

export function makeUniqueEventId(title: string, dateInput: string, existingIds: ReadonlySet<string>): string {
  const base = `${slugifyForEventPath(title)}-${datePartFromFormDate(dateInput)}`;
  if (!existingIds.has(base)) return base;
  let n = 2;
  while (existingIds.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** YYYY-MM-DD doğrula ve Date döndür (yerel gün, UTC gece yarısı değil) */
export function parseIsoBirthDate(s: string): Date | null {
  const t = s.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [y, m, d] = t.split("-").map(Number);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

/** Bugünden itibaren en az `years` yaşında mı (doğum günü dahil) */
export function isAtLeastAge(birth: Date, years: number): boolean {
  const today = new Date();
  const cutoff = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
  return birth <= cutoff;
}

export function birthDateNotInFuture(birth: Date): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return birth <= today;
}

export function formatBirthDateTr(iso: string): string {
  const d = parseIsoBirthDate(iso);
  return d
    ? d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : iso;
}

/** Kendi başlık/altlığını getiren noqt club radio sayfaları: global Navbar ve Footer burada gizlenir. */
const CLUB_RADIO_PATHS = new Set(["/", "/djler-icin", "/isbirlikleri"]);

export function isClubRadioPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return CLUB_RADIO_PATHS.has(p);
}

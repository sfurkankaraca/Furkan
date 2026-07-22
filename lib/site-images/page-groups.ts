/** Admin “Site görselleri” listesinde bölüm başlıkları — görsel hangi sayfada kullanılıyor */
export const SITE_IMAGE_PAGE_ORDER: readonly string[] = [
  "/",
  "/booking",
  "/b2b",
  "/academy",
  "/events",
  "/radio",
  "/collective",
  "/noqta-club",
  "/odeme",
  "/join",
  "/furkan-karaca",
  "/hakkimizda",
  "/contact",
];

export function siteImagePageSectionLabel(pagePath: string): string {
  const labels: Record<string, string> = {
    "/": "Ana sayfa",
    "/booking": "Booking — DJ & etkinlik müziği",
    "/b2b": "B2B — Marka & kurumsal iş birlikleri",
    "/academy": "Academy — DJ & prodüksiyon eğitimi",
    "/events": "Etkinlikler",
    "/radio": "Radio — Playlist & kürasyon",
    "/collective": "Collective — Sanatçı ağı",
    "/noqta-club": "Noqta Club — Üyelik",
    "/odeme": "Ödeme & logolar",
    "/join": "Katıl — Topluluğa üyelik kartları",
    "/furkan-karaca": "Furkan Karaca — Bio & portfolyo",
    "/hakkimizda": "Hakkımızda",
    "/contact": "İletişim",
  };
  return labels[pagePath] ?? pagePath;
}

export function sortSiteImageSlotsByPage<T extends { page: string }>(slots: readonly T[]): T[] {
  const orderIndex = (p: string) => {
    const i = SITE_IMAGE_PAGE_ORDER.indexOf(p);
    return i === -1 ? SITE_IMAGE_PAGE_ORDER.length : i;
  };
  return [...slots].sort((a, b) => {
    const d = orderIndex(a.page) - orderIndex(b.page);
    if (d !== 0) return d;
    return a.page.localeCompare(b.page);
  });
}

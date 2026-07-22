export type EventTicketing = {
  enabled: boolean;
  /** Bilet fiyatı (TRY, tam sayı veya ondalık) */
  priceTry: number;
  /** Sipariş başına üst limit */
  maxPerOrder?: number;
  /** Toplam satılabilir bilet (opsiyonel) */
  totalCap?: number;
  /** Kısa açıklama */
  note?: string;
};

export type LineupItem = {
  name: string;
  imageUrl?: string;
  href?: string;
  /** Örn. sahne / slot: "Açılış" */
  slot?: string;
};

export type EventOrganizer = {
  name?: string;
  imageUrl?: string;
  href?: string;
};

export type PublicEvent = {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  photos?: unknown[];
  memberPhotos?: unknown[];
  playlists?: unknown[];
  ticketing?: EventTicketing;
  /** Alt başlık / etiket */
  subtitle?: string;
  /** Çok günlük etkinlik bitişi (ISO) */
  endDate?: string;
  /** Uzun açıklama (düz metin) */
  description?: string;
  genres?: string[];
  lineup?: LineupItem[];
  organizer?: EventOrganizer;
  /** Mekan tam adresi */
  venueAddress?: string;
  /** Google Haritalar arama sorgusu (boşsa adres/mekan kullanılır) */
  venueMapQuery?: string;
  /** Kurallar (çok satırlı metin) */
  rules?: string;
  /** true ise kulüp etkinliği: herkese listelenir; bilet için onaylı başvuru + aktif kulüp aboneliği gerekir */
  membersOnly?: boolean;
};

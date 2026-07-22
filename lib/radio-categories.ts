export const CANONICAL_RADIO_CATEGORIES = [
  "Tech House",
  "Techno",
  "House",
  "R&B",
  "Rock",
  "Hip Hop",
  "Disco",
  "Indie",
  "Ambient",
  "Pop",
  "Live",
  "Diğer",
] as const;

export type CanonicalRadioCategory = (typeof CANONICAL_RADIO_CATEGORIES)[number];

/**
 * Admin panelden veya DB'den gelebilen serbest metin kategorilerini,
 * radyo sayfasındaki sabit kategori setine yaklaştırır.
 */
export function normalizeRadioCategory(raw: string): CanonicalRadioCategory {
  const s = (raw || "").trim().toLowerCase();
  if (!s) return "Diğer";

  // Order matters: more specific first.
  if (s.includes("tech house")) return "Tech House";
  if (s === "techhouse" || (s.includes("tech") && s.includes("house"))) return "Tech House";

  if (s.includes("techno")) return "Techno";

  // Avoid matching "tech house" here because it's handled above
  if (s === "house" || (s.includes("house") && !s.includes("tech"))) return "House";

  if (s.includes("r&b") || s.includes("rb&") || s.includes("rnb") || s.includes("r b")) return "R&B";

  if (s.includes("rock")) return "Rock";

  if (s.includes("hip hop") || s.includes("hiphop") || s.includes("trap")) return "Hip Hop";

  if (s.includes("disco")) return "Disco";

  if (s.includes("indie")) return "Indie";

  if (s.includes("ambient") || s.includes("atm")) return "Ambient";

  if (s.includes("pop")) return "Pop";

  if (s.includes("live")) return "Live";

  return "Diğer";
}

export function getCanonicalRadioCategoryOrder(category: CanonicalRadioCategory) {
  return CANONICAL_RADIO_CATEGORIES.indexOf(category);
}


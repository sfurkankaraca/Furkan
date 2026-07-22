/**
 * Prisma / pg için tek connection string.
 * Vercel + Neon entegrasyonu bazen yalnızca önekli veya UNPOOLED değişkeni verir; @see https://neon.tech/docs/guides/vercel-native-integration
 */
export function normalizeDatabaseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  const needsSsl =
    /neon\.tech|neon\.internal|supabase\.co|pooler\.supabase/i.test(trimmed) &&
    !/sslmode=/i.test(trimmed);
  if (!needsSsl) return trimmed;
  return trimmed.includes("?") ? `${trimmed}&sslmode=require` : `${trimmed}?sslmode=require`;
}

export function getDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
  ];
  for (const c of candidates) {
    const t = typeof c === "string" ? c.trim() : "";
    if (t) return normalizeDatabaseUrl(t);
  }
  return undefined;
}

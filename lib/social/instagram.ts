export function parseInstagramEmbedUrl(rawUrl: string): string | null {
  const raw = String(rawUrl || "").trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (!host.includes("instagram.com")) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const kind = parts[0];
  const code = parts[1];
  if (!code) return null;
  if (kind !== "reel" && kind !== "p" && kind !== "tv") return null;

  return `https://www.instagram.com/${kind}/${code}/embed`;
}

export function isInstagramUrl(rawUrl: string): boolean {
  return parseInstagramEmbedUrl(rawUrl) !== null;
}


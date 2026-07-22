import { getPrisma } from "@/lib/prisma";

export const RADIO_LIVE_CONFIG_ID = "default";

export type PublicRadioLive = {
  isLive: boolean;
  streamUrl: string;
  title: string;
};

function envFallback(): { streamUrl: string; title: string } {
  const streamUrl = (process.env.NEXT_PUBLIC_RADIO_LIVE_STREAM_URL ?? "").trim();
  const title = (process.env.NEXT_PUBLIC_RADIO_LIVE_TITLE ?? "").trim() || "Noqta canlı";
  return { streamUrl, title };
}

/** /radio oynatıcı: DB yoksa env; DB varsa admin `isLive` + URL. */
export async function getPublicRadioLiveForPlayer(): Promise<PublicRadioLive> {
  const env = envFallback();
  const prisma = getPrisma();
  if (!prisma) {
    if (!env.streamUrl) return { isLive: false, streamUrl: "", title: env.title };
    return { isLive: true, streamUrl: env.streamUrl, title: env.title };
  }

  const row = await prisma.radioLiveConfig.findUnique({ where: { id: RADIO_LIVE_CONFIG_ID } });
  if (!row) {
    if (!env.streamUrl) return { isLive: false, streamUrl: "", title: env.title };
    return { isLive: true, streamUrl: env.streamUrl, title: env.title };
  }

  const url = row.streamUrl.trim();
  if (row.isLive && url.length > 0) {
    return {
      isLive: true,
      streamUrl: url,
      title: (row.title || "Noqta canlı").trim() || "Noqta canlı",
    };
  }
  return { isLive: false, streamUrl: "", title: (row.title || env.title).trim() || "Noqta canlı" };
}

export type RadioLiveAdminRow = {
  streamUrl: string;
  title: string;
  isLive: boolean;
};

export async function getRadioLiveConfigForAdmin(): Promise<RadioLiveAdminRow | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  const row = await prisma.radioLiveConfig.findUnique({ where: { id: RADIO_LIVE_CONFIG_ID } });
  if (!row) {
    return { streamUrl: "", title: "Noqta canlı", isLive: false };
  }
  return {
    streamUrl: row.streamUrl,
    title: row.title || "Noqta canlı",
    isLive: row.isLive,
  };
}

const MAX_URL = 2048;
const MAX_TITLE = 120;

export function normalizeRadioStreamUrl(raw: string): string {
  const s = raw.trim().slice(0, MAX_URL);
  if (!s) return "";
  const lower = s.toLowerCase();
  if (!lower.startsWith("https://") && !lower.startsWith("http://")) {
    throw new Error("Akış adresi http:// veya https:// ile başlamalıdır.");
  }
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
  } catch {
    throw new Error("Geçerli bir akış URL’si girin.");
  }
  return s;
}

export async function saveRadioLiveConfig(input: {
  streamUrl: string;
  title: string;
  isLive: boolean;
}): Promise<RadioLiveAdminRow> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Veritabanı yok (DATABASE_URL).");

  const rawUrl = input.streamUrl.trim().slice(0, MAX_URL);
  const streamUrl = rawUrl === "" ? "" : normalizeRadioStreamUrl(rawUrl);
  const title = input.title.trim().slice(0, MAX_TITLE) || "Noqta canlı";
  const isLive = input.isLive;

  if (isLive && !streamUrl) {
    throw new Error("Yayını açmak için akış URL’si gerekli.");
  }

  await prisma.radioLiveConfig.upsert({
    where: { id: RADIO_LIVE_CONFIG_ID },
    create: {
      id: RADIO_LIVE_CONFIG_ID,
      streamUrl,
      title,
      isLive,
    },
    update: { streamUrl, title, isLive },
  });

  return { streamUrl, title, isLive };
}

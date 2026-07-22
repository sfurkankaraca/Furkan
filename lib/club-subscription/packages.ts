import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { getClubSubscriptionPriceTry } from "@/lib/club-subscription/constants";

export type ClubMembershipPackage = {
  id: string;
  name: string;
  priceTry: number;
  periodLabel: string;
  description: string;
  features: string[];
  mappedRole: "participant" | "student" | "dj";
  coverUrl?: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "club-packages.json");
const BLOB_PATHNAME = "club-packages.json";

const blobToken =
  process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

function blobRwToken(): string | undefined {
  return blobToken?.trim() || undefined;
}

function defaultPackages(): ClubMembershipPackage[] {
  const base = getClubSubscriptionPriceTry() || 250;
  return [
    {
      id: "baslangic",
      name: "Başlangıç Noqtası",
      priceTry: base,
      periodLabel: "/ ay",
      description: "Topluluk ve temel avantajlar.",
      features: [
        "Etkinlik ve buluşmalardan ilk sen haberdar ol",
        "Kulüp partnerlerinde özel indirimler",
      ],
      mappedRole: "participant",
    },
    {
      id: "dongu",
      name: "Döngü Noqtası",
      priceTry: base * 2,
      periodLabel: "/ ay",
      description: "Daha fazla içerik ve topluluk avantajı.",
      features: [
        "Başlangıç paketindeki tüm avantajlar",
        "Etkinlik içeriklerine erken erişim",
      ],
      mappedRole: "participant",
    },
    {
      id: "groove",
      name: "Groove Noqtası",
      priceTry: base * 3,
      periodLabel: "/ ay",
      description: "Eğitim tarafında daha derin üyelik.",
      features: [
        "Döngü paketindeki tüm avantajlar",
        "Workshop ve eğitimlerde ek indirim",
      ],
      mappedRole: "participant",
    },
    {
      id: "dj-adaylari",
      name: "DJ Adayları",
      priceTry: base * 4,
      periodLabel: "/ ay",
      description: "DJ gelişim odaklı üyelik.",
      features: [
        "Groove paketindeki tüm avantajlar",
        "Sahne ve set geri bildirim oturumları",
      ],
      mappedRole: "student",
    },
    {
      id: "dj-plus",
      name: "DJ Plus",
      priceTry: base * 5,
      periodLabel: "/ ay",
      description: "En kapsamlı üyelik paketi.",
      features: [
        "DJ Adayları paketindeki tüm avantajlar",
        "Aylık prodüksiyon odaklı atölye erişimi",
      ],
      mappedRole: "dj",
    },
  ];
}

function sanitizePackage(input: unknown, i: number): ClubMembershipPackage | null {
  if (!input || typeof input !== "object") return null;
  const row = input as Record<string, unknown>;
  const id = String(row.id || "").trim();
  const name = String(row.name || "").trim();
  const priceTry = Number(row.priceTry);
  const mappedRole = row.mappedRole;
  if (!id || !name || !Number.isFinite(priceTry) || priceTry <= 0) return null;
  if (mappedRole !== "participant" && mappedRole !== "student" && mappedRole !== "dj") return null;
  const features = Array.isArray(row.features)
    ? row.features.map((f) => String(f || "").trim()).filter(Boolean)
    : [];
  return {
    id: id || `paket-${i + 1}`,
    name,
    priceTry,
    periodLabel: String(row.periodLabel || "/ ay").trim() || "/ ay",
    description: String(row.description || "").trim(),
    features,
    mappedRole,
    coverUrl: String(row.coverUrl || "").trim() || undefined,
  };
}

function parsePackagesJson(raw: string): ClubMembershipPackage[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const items = parsed
      .map((item, i) => sanitizePackage(item, i))
      .filter((v): v is ClubMembershipPackage => !!v);
    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

async function readPackagesFromBlob(): Promise<ClubMembershipPackage[] | null> {
  const token = blobRwToken();
  if (!token) return null;
  try {
    const { blobs } = await list({ prefix: "club-packages", token });
    const exact = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    const pick =
      exact?.url ??
      blobs
        .filter((b) => typeof b.pathname === "string" && b.pathname.startsWith("club-packages"))
        .sort(
          (a, b) =>
            new Date((b as { uploadedAt?: Date }).uploadedAt ?? 0).getTime() -
            new Date((a as { uploadedAt?: Date }).uploadedAt ?? 0).getTime(),
        )[0]?.url;
    if (!pick) return null;
    const res = await fetch(pick, { cache: "no-store" });
    if (!res.ok) return null;
    const text = await res.text();
    return parsePackagesJson(text);
  } catch (e) {
    console.error("[club-packages] blob read", e);
    return null;
  }
}

async function writePackagesToBlob(json: string): Promise<boolean> {
  const token = blobRwToken();
  if (!token) return false;
  try {
    await put(BLOB_PATHNAME, json, {
      access: "public",
      addRandomSuffix: false,
      token,
      contentType: "application/json",
    });
    return true;
  } catch (e) {
    console.error("[club-packages] blob write", e);
    return false;
  }
}

export async function readClubPackages(): Promise<ClubMembershipPackage[]> {
  const fromBlob = await readPackagesFromBlob();
  if (fromBlob !== null) return fromBlob;

  try {
    const raw = await readFile(DATA_PATH, "utf8");
    const items = parsePackagesJson(raw);
    return items ?? defaultPackages();
  } catch {
    return defaultPackages();
  }
}

export async function writeClubPackages(input: unknown): Promise<ClubMembershipPackage[]> {
  if (!Array.isArray(input)) {
    throw new Error("Paket listesi dizi olmalı");
  }
  const items = input
    .map((item, i) => sanitizePackage(item, i))
    .filter((v): v is ClubMembershipPackage => !!v);
  if (items.length === 0) {
    throw new Error("En az bir geçerli paket olmalı");
  }

  const json = JSON.stringify(items, null, 2) + "\n";
  const blobOk = await writePackagesToBlob(json);

  if (blobOk) {
    try {
      await mkdir(path.dirname(DATA_PATH), { recursive: true });
      await writeFile(DATA_PATH, json, "utf8");
    } catch {
      /* Vercel: salt okunur FS — Blob yeterli */
    }
    return items;
  }

  try {
    await mkdir(path.dirname(DATA_PATH), { recursive: true });
    await writeFile(DATA_PATH, json, "utf8");
    return items;
  } catch (e) {
    const code = typeof e === "object" && e && "code" in e ? String((e as { code?: string }).code) : "";
    const hint =
      code === "EROFS" || (e instanceof Error && e.message.includes("EROFS"))
        ? " Vercel ortamında dosya yazılamaz: Project → Storage → Blob veya Environment Variables içinde BLOB_READ_WRITE_TOKEN ekleyin (site görselleriyle aynı token kullanılabilir)."
        : " Yerel disk yazılamadı; BLOB_READ_WRITE_TOKEN ile Blob depolama tanımlayın.";
    throw new Error(`Kulüp paketleri kaydedilemedi.${hint}`);
  }
}

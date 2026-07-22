import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRadioLiveConfigForAdmin, saveRadioLiveConfig } from "@/lib/radio-live-config";

export const runtime = "nodejs";

async function ensureAdmin() {
  const jar = await cookies();
  return jar.get("admin")?.value === "1";
}

export async function GET() {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const row = await getRadioLiveConfigForAdmin();
  if (!row) {
    return NextResponse.json({ error: "Veritabanı yok (DATABASE_URL)." }, { status: 503 });
  }
  return NextResponse.json(row);
}

export async function PUT(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: { streamUrl?: unknown; title?: unknown; isLive?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const streamUrl = String(body.streamUrl ?? "");
  const title = String(body.title ?? "");
  const isLive = Boolean(body.isLive);

  try {
    const saved = await saveRadioLiveConfig({ streamUrl, title, isLive });
    return NextResponse.json({ ok: true, ...saved });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Kaydedilemedi" },
      { status: 400 },
    );
  }
}

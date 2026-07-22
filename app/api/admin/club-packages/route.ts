import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readClubPackages, writeClubPackages } from "@/lib/club-subscription/packages";

export const runtime = "nodejs";

async function ensureAdmin() {
  const jar = await cookies();
  return jar.get("admin")?.value === "1";
}

export async function GET() {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const packages = await readClubPackages();
  return NextResponse.json({ packages });
}

export async function PUT(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }
  try {
    const packages = await writeClubPackages((body as { packages?: unknown })?.packages ?? []);
    return NextResponse.json({ ok: true, packages });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Kaydetme hatası" },
      { status: 400 },
    );
  }
}


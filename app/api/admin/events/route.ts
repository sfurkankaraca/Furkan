import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readEventsJson } from "@/lib/server/events-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  if (jar.get("admin")?.value !== "1") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const events = await readEventsJson();
    return NextResponse.json(events);
  } catch (e) {
    console.error("GET /api/admin/events", e);
    return NextResponse.json({ error: "Liste alınamadı" }, { status: 500 });
  }
}

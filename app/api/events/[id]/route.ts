import { NextResponse } from "next/server";
import { getPublicEventById } from "@/lib/server/public-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const event = await getPublicEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (e) {
    console.error("GET /api/events/[id]", e);
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}

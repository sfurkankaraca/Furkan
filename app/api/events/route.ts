import { NextResponse } from "next/server";
import { listPublicEvents } from "@/lib/server/public-events";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const events = await listPublicEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

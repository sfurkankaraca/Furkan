import { NextResponse } from "next/server";
import { readEventsJson } from "@/lib/server/events-store";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const events = await readEventsJson();
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

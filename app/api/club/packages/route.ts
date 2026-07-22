import { NextResponse } from "next/server";
import { readClubPackages } from "@/lib/club-subscription/packages";

export const runtime = "nodejs";

export async function GET() {
  const packages = await readClubPackages();
  return NextResponse.json({ packages });
}


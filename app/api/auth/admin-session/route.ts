import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const admin = jar.get("admin")?.value === "1";
  return NextResponse.json({ admin });
}

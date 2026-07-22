import { NextResponse } from "next/server";
import { getClubSubscriptionPriceTry } from "@/lib/club-subscription/constants";
import { readClubPackages } from "@/lib/club-subscription/packages";

export const runtime = "nodejs";

/** Aylık abonelik fiyatını göstermek için (kimlik doğrulamasız). */
export async function GET() {
  const priceTry = getClubSubscriptionPriceTry();
  const packages = await readClubPackages();
  if (priceTry <= 0) {
    return NextResponse.json({
      priceTry: packages[0]?.priceTry ?? null,
      configured: packages.length > 0,
      packages,
    });
  }
  return NextResponse.json({ priceTry, configured: true, packages });
}

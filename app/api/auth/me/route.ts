import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getClubAccessForUser } from "@/lib/club-subscription/access";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null, club: null });
  }

  const prisma = getPrisma();
  if (!prisma) {
    const club = await getClubAccessForUser(null, session.sub, session.email);
    return NextResponse.json({
      user: { id: session.sub, email: session.email, name: null, image: null },
      needsOnboarding: false,
      club,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true, image: true, profileCompletedAt: true },
  });

  if (!user) {
    return NextResponse.json({ user: null, club: null });
  }

  const club = await getClubAccessForUser(prisma, user.id, user.email);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
    needsOnboarding: user.profileCompletedAt == null,
    club,
  });
}

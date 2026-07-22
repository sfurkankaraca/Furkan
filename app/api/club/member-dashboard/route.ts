import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { getClubAccessForUser } from "@/lib/club-subscription/access";
import { readEventsJson } from "@/lib/server/events-store";
import { readClubMemberPosts, sortClubMemberPosts } from "@/lib/server/club-posts-store";
import type { PublicEvent } from "@/lib/event-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const prisma = getPrisma();
  const access = await getClubAccessForUser(prisma, session.sub, session.email);
  if (!access.fullMember) {
    return NextResponse.json({ error: "Kulüp aboneliği gerekli" }, { status: 403 });
  }

  const all = await readEventsJson();
  const memberEvents: PublicEvent[] = all.filter((e) => e.membersOnly === true);
  const posts = sortClubMemberPosts(await readClubMemberPosts());

  return NextResponse.json({
    access,
    events: memberEvents,
    posts,
  });
}

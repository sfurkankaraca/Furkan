import { NextResponse } from "next/server";
import { listPlaylistsForPublic } from "@/lib/playlists";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listPlaylistsForPublic();
  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      spotifyUrl: r.spotifyUrl,
      coverImage: r.coverImage,
      category: r.category,
      featured: r.featured,
      sortOrder: r.sortOrder,
    })),
  );
}

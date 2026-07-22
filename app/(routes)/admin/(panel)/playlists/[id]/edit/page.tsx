import { notFound } from "next/navigation";
import AdminPlaylistForm from "@/components/admin/AdminPlaylistForm";
import { getPlaylistById } from "@/lib/playlists";
import { updatePlaylist } from "../../actions";
import { ContentCard } from "@/components/layout/PageShell";
import { AdminPrismaErrorCard } from "@/lib/admin/admin-prisma-fallback";

export const metadata = { title: "Playlist düzenle | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminEditPlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let playlist: Awaited<ReturnType<typeof getPlaylistById>> = null;
  try {
    playlist = await getPlaylistById(id);
  } catch (e) {
    console.error("[admin/playlists/edit] prisma", e);
    return <AdminPrismaErrorCard title="Playlist düzenle" />;
  }
  if (!playlist) notFound();

  return (
    <ContentCard className="bg-white p-6 md:p-8 max-w-3xl mx-auto">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Playlist düzenle</h1>
          <p className="mt-1 text-sm text-muted-foreground">{playlist.title}</p>
        </div>
        <AdminPlaylistForm action={updatePlaylist} playlist={playlist} />
      </div>
    </ContentCard>
  );
}

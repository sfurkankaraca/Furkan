import AdminPlaylistForm from "@/components/admin/AdminPlaylistForm";
import { createPlaylist } from "../actions";
import { ContentCard } from "@/components/layout/PageShell";

export const metadata = { title: "Yeni playlist | Admin" };

export default function AdminNewPlaylistPage() {
  return (
    <ContentCard className="bg-white p-6 md:p-8 max-w-3xl mx-auto">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Yeni playlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">Spotify playlist linki ve kapak zorunludur.</p>
        </div>
        <AdminPlaylistForm action={createPlaylist} />
      </div>
    </ContentCard>
  );
}

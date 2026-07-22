import Link from "next/link";
import Image from "next/image";
import { listPlaylistsForAdmin } from "@/lib/playlists";
import { getPrisma } from "@/lib/prisma";
import { deletePlaylist } from "./actions";
import { AdminPrismaErrorCard } from "@/lib/admin/admin-prisma-fallback";
import type { PlaylistRow } from "@/lib/playlists";

export const metadata = { title: "Playlistler | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const prisma = getPrisma();
  const noDb = !prisma;
  let items: PlaylistRow[] = [];
  let queryFailed = false;

  if (prisma) {
    try {
      items = await listPlaylistsForAdmin();
    } catch (e) {
      console.error("[admin/playlists] prisma", e);
      queryFailed = true;
    }
  }

  if (queryFailed) {
    return <AdminPrismaErrorCard title="Radio playlistleri" subtitle="Spotify bağlantısı ve kapak." />;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Radio playlistleri</h1>
          <p className="mt-1 text-sm text-muted-foreground">Spotify bağlantısı ve kapak; /radio sayfasında listelenir.</p>
        </div>
        <Link
          href="/admin/playlists/new"
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-white/90"
        >
          Yeni playlist
        </Link>
      </div>

      {noDb ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800/90">
          Veritabanı yok — <code className="text-amber-100">DATABASE_URL</code> tanımlayıp migrasyon çalıştırın.
        </p>
      ) : null}

      {items.length === 0 && !noDb ? (
        <p className="text-sm text-muted-foreground">Henüz kayıt yok. Yeni playlist ekleyin.</p>
      ) : null}

      {items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-2">Kapak</th>
                <th className="px-3 py-2">Başlık</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Öne çıkan</th>
                <th className="px-3 py-2">Sıra</th>
                <th className="px-3 py-2">Spotify</th>
                <th className="px-3 py-2">Düzenle</th>
                <th className="px-3 py-2">Sil</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    {p.coverImage?.startsWith("http") ? (
                      <Image
                        src={p.coverImage}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="size-10 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium text-white">{p.title}</td>
                  <td className="px-3 py-2 text-foreground/70">{p.category}</td>
                  <td className="px-3 py-2">{p.featured ? "Evet" : "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.sortOrder}</td>
                  <td className="px-3 py-2">
                    <a className="text-cyan-400 underline hover:text-cyan-300" href={p.spotifyUrl} target="_blank" rel="noreferrer">
                      aç
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    <Link className="underline text-foreground/80 hover:text-white" href={`/admin/playlists/${p.id}/edit`}>
                      düzenle
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <form action={deletePlaylist} onSubmit={(ev) => !confirm("Silmek istediğinize emin misiniz?") && ev.preventDefault()}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-400 underline hover:text-red-300">
                        sil
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

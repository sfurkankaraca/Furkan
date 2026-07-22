import Link from "next/link";
import { readClubMemberPosts, sortClubMemberPosts } from "@/lib/server/club-posts-store";
import { ContentCard } from "@/components/layout/PageShell";
import { DeleteClubPostButton } from "./DeleteClubPostButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Kulüp içerikleri | noqta" };

export default async function AdminClubMemberContentPage() {
  const posts = sortClubMemberPosts(await readClubMemberPosts());

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-medium text-white">Kulüp üyelerine özel içerik</h2>
          <p className="text-sm text-muted-foreground mt-1">Abonelikli üyeler /account/club panelinde görür.</p>
        </div>
        <Link
          href="/admin/club-member-content/new"
          className="rounded-xl bg-foreground text-background px-3 py-1.5 text-sm font-medium hover:bg-white/90"
        >
          Yeni içerik
        </Link>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="px-3 py-2">Sıra</th>
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Düzenle</th>
              <th className="px-3 py-2">Sil</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-white/45">
                  Henüz içerik yok.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground/70">{p.sortOrder}</td>
                  <td className="px-3 py-2 text-white/90">{p.title}</td>
                  <td className="px-3 py-2">
                    <Link href={`/admin/club-member-content/${p.id}/edit`} className="underline text-fuchsia-300">
                      düzenle
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <DeleteClubPostButton id={p.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ContentCard>
  );
}

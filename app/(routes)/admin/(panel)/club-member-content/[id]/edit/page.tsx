import Link from "next/link";
import { notFound } from "next/navigation";
import { getClubMemberPostById } from "@/lib/server/club-posts-store";
import { ContentCard } from "@/components/layout/PageShell";
import { updateClubMemberPost } from "../../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: "Admin — İçerik düzenle | noqta" };
}

export default async function EditClubMemberContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getClubMemberPostById(id);
  if (!post) notFound();

  return (
    <ContentCard className="bg-white p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/club-member-content" className="text-sm text-muted-foreground hover:text-foreground/80">
          ← Listeye dön
        </Link>
        <h2 className="text-xl font-medium text-white mt-2">İçeriği düzenle</h2>
      </div>

      <form action={updateClubMemberPost} className="grid gap-4">
        <input type="hidden" name="id" value={post.id} />
        <label className="grid gap-1 text-sm">
          <span className="text-foreground/70">Başlık *</span>
          <input
            name="title"
            required
            defaultValue={post.title}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-foreground/70">Metin</span>
          <textarea
            name="body"
            rows={10}
            defaultValue={post.body}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-foreground/70">Görsel URL</span>
          <input
            name="image"
            defaultValue={post.image ?? ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-foreground/70">Link URL</span>
            <input name="linkUrl" defaultValue={post.linkUrl ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-foreground/70">Link etiketi</span>
            <input
              name="linkLabel"
              defaultValue={post.linkLabel ?? ""}
              className="rounded-xl bg-background border border-border px-3 py-2 text-white"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm max-w-[120px]">
          <span className="text-foreground/70">Sıra</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={post.sortOrder}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </label>
        <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium w-fit hover:bg-white/90">
          Güncelle
        </button>
      </form>
    </ContentCard>
  );
}

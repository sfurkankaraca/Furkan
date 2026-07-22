import Link from "next/link";
import { ContentCard } from "@/components/layout/PageShell";
import { createClubMemberPost } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Yeni kulüp içeriği | noqta" };

export default function NewClubMemberContentPage() {
  return (
    <ContentCard className="bg-white p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/club-member-content" className="text-sm text-muted-foreground hover:text-foreground/80">
          ← Listeye dön
        </Link>
        <h2 className="text-xl font-medium text-white mt-2">Yeni içerik</h2>
      </div>

      <form action={createClubMemberPost} className="grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="text-foreground/70">Başlık *</span>
          <input
            name="title"
            required
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-foreground/70">Metin</span>
          <textarea name="body" rows={10} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-foreground/70">Görsel URL</span>
          <input name="image" className="rounded-xl bg-background border border-border px-3 py-2 text-white" placeholder="https://..." />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-foreground/70">Link URL</span>
            <input name="linkUrl" className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-foreground/70">Link etiketi</span>
            <input name="linkLabel" className="rounded-xl bg-background border border-border px-3 py-2 text-white" placeholder="Detaya git" />
          </label>
        </div>
        <label className="grid gap-1 text-sm max-w-[120px]">
          <span className="text-foreground/70">Sıra</span>
          <input name="sortOrder" type="number" defaultValue={0} className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
        </label>
        <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium w-fit hover:bg-white/90">
          Kaydet
        </button>
      </form>
    </ContentCard>
  );
}

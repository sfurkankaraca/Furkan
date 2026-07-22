import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";

export const metadata: Metadata = {
  title: "Çerez Politikası | noqta",
  description:
    "noqta.club çerez ve benzeri teknolojilere ilişkin bilgilendirme taslağı. Analitik ve tercih çerezleri netleştikçe güncellenecek.",
  robots: { index: false, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <main>
      <PageHeroVideo sources={resolveRandomHeroSources("/cerez-politikasi")} posterAlt="Noqta — çerez politikası arka plan görseli">
        <PageShell withGlow={false}>
      <div className="max-w-2xl grid gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">Çerez politikası</h1>
        <p className="text-sm text-white/65 leading-relaxed">
          Site performansı ve ölçümleme için çerez veya benzeri teknolojiler kullanılabilir. Bu sayfa, kullanılan çerez
          türleri ve yönetim seçenekleri netleştirilecek şekilde güncellenecek bir taslaktır.
        </p>
        <p className="text-xs text-white/45">Son güncelleme: Mart 2026 — taslak</p>
      </div>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}

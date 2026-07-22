import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | noqta",
  description:
    "6698 sayılı KVKK kapsamında noqta.club aydınlatma metni özeti. Kulüp başvuruları için ayrı metin bağlantısı.",
  robots: { index: false, follow: true },
};

export default function KvkkAydinlatmaPage() {
  return (
    <main>
      <PageHeroVideo sources={resolveRandomHeroSources("/kvkk-aydinlatma")} posterAlt="Noqta — KVKK aydınlatma arka plan görseli">
        <PageShell withGlow={false}>
      <div className="max-w-2xl grid gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">KVKK aydınlatma metni</h1>
        <p className="text-sm text-white/65 leading-relaxed">
          Bu metin yer tutucudur; veri sorumlusu, işleme amaçları ve haklarınız hukuki danışmanlıkla kesinleştirildikçe
          genişletilecektir. Noqta Club üyelik sürecine özel düzenlemeler için{" "}
          <Link href="/kvkk/noqta-club" className="text-cyan-300/90 hover:text-cyan-200">
            Kulüp KVKK sayfasına
          </Link>{" "}
          göz atabilirsiniz.
        </p>
        <p className="text-xs text-white/45">Son güncelleme: Mart 2026 — taslak</p>
      </div>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}

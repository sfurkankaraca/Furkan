import Link from "next/link";
import {
  ArrowRight,
  Disc3,
  Mic2,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Video,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHeader, ContentCard } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolvePageHeroSources } from "@/lib/page-hero-videos";
import { contactHref } from "@/lib/contact-href";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";

export const metadata = {
  title: "Noqta Collective — DJ ve Sanatçı Network",
  description:
    "DJ, prodüktör ve sanatçılar için iş birliği, set çekimi, içerik ve booking koordinasyonu. Türkiye genelinde noqta collective ağı.",
  alternates: { canonical: "/collective" },
};

const forDjs = [
  { icon: Video, text: "Set çekimi ve içerik üretimi — görünürlüğünüzü büyütelim." },
  { icon: Workflow, text: "Kariyer yönetimi ve release / gig takvimi ile net rota." },
  { icon: UserRound, text: "Menejerlik ve booking görüşmelerinde temsil ve koordinasyon." },
];

const forProducers = [
  { icon: Disc3, text: "Şarkılarınızı kurum içi playlist ve etkinlik kürasyonlarına önerelim." },
  { icon: Mic2, text: "Label ve collective çatısı altında yayın, tanıtım ve network." },
  { icon: SlidersHorizontal, text: "Klip / set çekimi, görsel kimlik ve dijital varlık paketi." },
];

export default async function CollectivePage() {
  const heroSources = resolvePageHeroSources("collective");
  const overrides = await readSiteImageOverrides();
  const poster = resolveSiteImageUrl("collective_hero_poster", overrides) ?? "/og.png";

  return (
    <main className="dark bg-background text-foreground">
      <PageHeroVideo
        sources={heroSources}
        poster={poster}
        posterAlt="Noqta Collective — müzik ve sanatçı topluluğu arka plan görseli"
      >
        <div className="container mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md md:p-8">
            <PageHeader
              eyebrow={
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
                  <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
                  Collective
                </p>
              }
              title={<>Noqta Collective — DJ&apos;ler ve prodüktörler için ortak alan</>}
              description="Sahne ötesi: içerik, kariyer ve iş birliği. Doğru sesi doğru projeyle buluşturuyoruz. Rolüne göre seçenekler aşağıda — tek mesajla başlayabilirsin."
              actions={
                <>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl border-0 bg-gradient-to-r from-noqt-lime to-noqt-lime text-black shadow-lg shadow-noqt-lime/20 hover:from-noqt-lime hover:to-noqt-lime"
                  >
                    <Link
                      href={contactHref(
                        "Collective — İş birliği başvurusu",
                        "Merhaba,\n\nRolüm: DJ / prodüktör / sanatçı (hangisi):\nŞehir:\nSoundcloud / Spotify / IG linkleri:\nKısa hedef (ör. set çekimi, label demo, menajerlik):\n\nNot:\n",
                      )}
                    >
                      İş birliği için yaz
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
                    <Link href="/join">Kulüp üyeliği</Link>
                  </Button>
                </>
              }
            />
          </div>
        </div>
        <PageShell withGlow={false}>
        <div className="grid gap-14 md:gap-20">
        <p className="text-sm text-white/60 max-w-2xl">
          <Link href="/booking" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
            DJ booking
          </Link>{" "}
          veya özel etkinlik müziği için de aynı ekiple hizalanabilirsin.
        </p>

        <section className="grid gap-6 lg:grid-cols-2" aria-labelledby="collective-roles">
          <h2 id="collective-roles" className="sr-only">
            Kimlere hitap ediyoruz
          </h2>
          <ContentCard>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Disc3 className="size-5 text-noqt-lime" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-white">DJ&apos;ler</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Setinizi profesyonelce kayda almak, sosyal ve streaming stratejisini toparlamak veya temsilcilik istemeniz
              fark etmez — süreci sizin adınıza yürütürüz.
            </p>
            <ul className="mt-5 grid gap-3">
              {forDjs.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm text-white/75">
                  <Icon className="mt-0.5 size-4 shrink-0 text-cyan-300/80" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
            <Button asChild variant="secondary" className="mt-6 w-full rounded-xl bg-white/10 text-white hover:bg-white/15">
              <Link href={contactHref("Collective — DJ iş birliği", "Merhaba, DJ olarak collective ile çalışmak istiyorum.\n\nSet örnekleri:\nHedeflerim:\n")}>
                DJ olarak başvur
                <ArrowRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </Button>
          </ContentCard>

          <ContentCard>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <SlidersHorizontal className="size-5 text-cyan-300" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-white">Prodüktör & sanatçı</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Parçalarınızı doğru playlist ve sahnelere taşımak, noqta ekosisteminde görünür olmak veya label / yayın
              hattında ilerlemek için yanınızdayız.
            </p>
            <ul className="mt-5 grid gap-3">
              {forProducers.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm text-white/75">
                  <Icon className="mt-0.5 size-4 shrink-0 text-noqt-lime/80" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
            <Button asChild variant="secondary" className="mt-6 w-full rounded-xl bg-white/10 text-white hover:bg-white/15">
              <Link
                href={contactHref(
                  "Collective — Prodüktör / sanatçı iş birliği",
                  "Merhaba, prodüktör/sanatçı olarak collective ile çalışmak istiyorum.\n\nDemo / yayın linkleri:\nPlaylist önerisi veya label hedefi:\n",
                )}
              >
                Prodüktör / sanatçı olarak başvur
                <ArrowRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </Button>
          </ContentCard>
        </section>
        </div>
      </PageShell>
      </PageHeroVideo>
    </main>
  );
}

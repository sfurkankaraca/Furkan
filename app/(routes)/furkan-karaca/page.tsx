import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, ContentCard, PageBlockTitle } from "@/components/layout/PageShell";
import {
  FURKAN_BIO_LONG_PARAGRAPHS,
  FURKAN_KARACA,
  FURKAN_PORTFOLIO_IMAGES,
  FURKAN_PROFILE_IMAGE_URL,
} from "@/lib/content/furkan-karaca";
import { FURKAN_PHOTO_SLOT_IDS, FURKAN_PORTFOLIO_VIDEO_SLOT_IDS } from "@/lib/site-images/registry";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { PortfolioVideoCard } from "@/components/social/PortfolioVideoCard";

export const metadata: Metadata = {
  title: "Furkan Karaca — Biyografi & portfolyo | noqt",
  description:
    "Müzisyen, yapımcı, ses mühendisi, DJ ve eğitmen Furkan Karaca: noqt kurucusu; sahne, stüdyo ve akademi tarafındaki yolculuk.",
  alternates: { canonical: "/furkan-karaca" },
  openGraph: {
    title: "Furkan Karaca | noqt",
    description: "Biyografi ve seçili sahne / stüdyo görselleri.",
    url: "/furkan-karaca",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: FURKAN_KARACA.name,
  url: "https://noqt.club/furkan-karaca",
  jobTitle: ["Müzisyen", "Yapımcı", "Ses mühendisi", "DJ", "Eğitmen"],
  worksFor: { "@type": "Organization", name: "noqt", url: "https://noqt.club" },
};

export default async function FurkanKaracaPage() {
  const overrides = await readSiteImageOverrides();
  const img = (resolveSiteImageUrl("furkan_bio_photo", overrides) ?? FURKAN_PROFILE_IMAGE_URL).trim();
  const slotPhotos = FURKAN_PHOTO_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides)).filter(
    (x): x is string => Boolean(x),
  );
  const photoItems =
    slotPhotos.length > 0
      ? slotPhotos.map((src, i) => ({ src, alt: `Furkan Karaca portfolyo fotoğrafı ${i + 1}` }))
      : FURKAN_PORTFOLIO_IMAGES;
  const portfolioVideos = FURKAN_PORTFOLIO_VIDEO_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides)).filter(
    (x): x is string => Boolean(x),
  );

  return (
    <PageShell withGlow={false} className="dark bg-background text-foreground">
      <div className="mx-auto max-w-3xl grid gap-12 md:gap-16 pb-16">
        <header className="grid gap-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {img ? (
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/5 sm:h-44 sm:w-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={FURKAN_KARACA.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div
                className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-noqt-lime/25 to-noqt-sky/20 text-2xl font-semibold text-white/85 sm:h-44 sm:w-44"
                aria-hidden
              >
                FK
              </div>
            )}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-noqt-lime/85">noqt kurucusu</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{FURKAN_KARACA.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                Müzisyen, yapımcı, ses mühendisi, DJ, eğitmen, mentor ve A&R odaklı yaratıcı geliştirici.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <Link
                  href="/booking"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-white/30 hover:bg-white/10"
                >
                  Booking
                </Link>
                <Link
                  href="/"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-white/30 hover:bg-white/10"
                >
                  Academy
                </Link>
                <Link
                  href="/biz-kimiz"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-white/30 hover:bg-white/10"
                >
                  Biz kimiz
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section aria-labelledby="furkan-bio-long">
          <PageBlockTitle
            sectionId="furkan-bio-long"
            title="Biyografi"
            description="Müzik yolculuğu, sahne ve noqt’un doğuşuna dair uzun özet."
          />
          <ContentCard className="mt-6 border-white/12 bg-white/[0.035] p-5 md:p-8">
            <div className="grid gap-5 text-sm leading-relaxed text-white/75 md:text-[15px]">
              {FURKAN_BIO_LONG_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </ContentCard>
        </section>

        <section aria-labelledby="furkan-portfolio">
          <PageBlockTitle
            sectionId="furkan-portfolio"
            title="Portfolyo"
            description="Sahne, stüdyo ve seçili işler — görselleri yükledikçe bu ızgara güncellenir."
          />
          {photoItems.length === 0 ? (
            <ContentCard className="mt-6 border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-white/50">
              Bu alan için görselleri admin panelindeki <strong>Site görselleri &gt; Furkan Karaca</strong> bölümünden
              ekleyebilirsin.
            </ContentCard>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {photoItems.map((item, i) => (
                <div
                  key={`${item.src}-${i}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/12 bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="furkan-video-portfolio">
          <PageBlockTitle
            sectionId="furkan-video-portfolio"
            title="Portfolyo videoları"
            description="Video içeriklerini admin panelindeki Site görselleri > Furkan Karaca bölümünden ekleyebilirsin."
          />
          {portfolioVideos.length === 0 ? (
            <ContentCard className="mt-6 border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-white/50">
              Henüz video eklenmedi.
            </ContentCard>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {portfolioVideos.map((src, i) => (
                <PortfolioVideoCard key={`${src}-${i}`} src={src} title={`Furkan Karaca portfolyo video ${i + 1}`} />
              ))}
            </div>
          )}
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </div>
    </PageShell>
  );
}

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, GraduationCap, Music2, Zap } from "lucide-react";
import { PageShell, ContentCard, PageBlockTitle } from "@/components/layout/PageShell";
import { FurkanBioCard } from "@/components/people/FurkanBioCard";
import { ACADEMY_FAQ_ITEMS } from "@/lib/academy-faq";
import { SITE_URL } from "@/lib/site-url";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Academy — DJ ve Prodüksiyon Eğitimleri | NOQT DJ Akademi",
  description:
    "DJliğe Giriş, İleri Seviye DJlik, Müzik Prodüksiyonu ve workshoplar. Kayseri ve Nevşehir'de pratik odaklı eğitim.",
  alternates: { canonical: `${SITE_URL}/academy` },
  keywords: [
    "DJ eğitimi Kayseri",
    "DJ kursu",
    "müzik prodüksiyonu eğitimi",
    "DJ workshop",
    "NOQT DJ Akademi",
  ],
};

const PROGRAMS = [
  {
    icon: GraduationCap,
    label: "DJliğe Giriş",
    category: "DJ Eğitimi",
    accent: "text-fuchsia-600",
    border: "border-fuchsia-200 hover:border-fuchsia-300",
    bg: "from-fuchsia-50 via-background to-purple-50",
    items: [
      "Ekipman tanıma — mixer, controller, kulaklık",
      "Beatmatching ve tempoyla çalışma",
      "Basit geçişler ve temel teknikler",
      "İlk setini hazırlamak",
    ],
    who: "Hiç DJ'lik yapmamış, sıfırdan başlamak isteyenler.",
  },
  {
    icon: GraduationCap,
    label: "İleri Seviye DJlik",
    category: "DJ Eğitimi",
    accent: "text-violet-600",
    border: "border-violet-200 hover:border-violet-300",
    bg: "from-violet-50 via-background to-fuchsia-50",
    items: [
      "İleri geçiş teknikleri ve harmonic mixing",
      "Set yapısı, enerji yönetimi",
      "Loop, cue ve efekt kullanımı",
      "Sahne psikolojisi ve performans",
    ],
    who: "Temel DJ bilgisi olan, bir üst seviyeye çıkmak isteyenler.",
  },
  {
    icon: Music2,
    label: "Müzik Prodüksiyonu",
    category: "Prodüksiyon Eğitimi",
    accent: "text-sky-600",
    border: "border-sky-200 hover:border-sky-300",
    bg: "from-sky-50 via-background to-cyan-50",
    items: [
      "DAW kurulumu ve proje yönetimi",
      "Ritim, melodi ve armoni temelleri",
      "Mixing ve ses işleme",
      "İlk parçanı bitirme",
    ],
    who: "Kendi müziğini üretmek isteyen, prodüksiyona yeni başlayanlar.",
  },
];

const WORKSHOPS = [
  {
    label: "Set Hazırlama Workshop",
    desc: "Tek günde eksiksiz bir DJ seti oluştur; parça seçimi, yapı ve geçiş pratiği.",
    duration: "Tam gün",
  },
  {
    label: "DJlik Deneyimi Workshop",
    desc: "DJ'liği ilk kez dene; ekipman başında uygulamalı giriş, bir günde ne olduğunu anla.",
    duration: "Yarım gün",
  },
  {
    label: "Müzik Prodüksiyonu Workshop",
    desc: "Bir DAW oturumunda temel ritim ve melodi yazımına odaklanan yoğun atölye.",
    duration: "Tam gün",
  },
];

export default async function AcademyPage() {
  const prisma = getPrisma();
  const academyAssets = prisma
    ? await prisma.siteAsset.findMany({ where: { category: "academy" }, orderBy: { createdAt: "asc" } })
    : [];
  const heroImage = academyAssets[0]?.url ?? null;

  return (
    <main className="bg-background">
      {/* Header — anasayfayla aynı split hero düzeni */}
      <section className="relative min-h-[70vh] flex flex-col border-b border-border">
        <div className="absolute inset-0">
          {/* Mobile: full bleed photo */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            {heroImage ? (
              <Image src={heroImage} alt="NOQT Academy" fill className="object-cover object-center" priority sizes="100vw" />
            ) : (
              <div className="absolute inset-0 bg-foreground/90" />
            )}
            <div className="absolute inset-0 bg-black/55" />
          </div>
          {/* Desktop: split — warm white left, photo right */}
          <div className="hidden lg:grid absolute inset-0 grid-cols-2">
            <div className="bg-background" />
            <div className="relative overflow-hidden">
              {heroImage ? (
                <Image src={heroImage} alt="NOQT Academy" fill className="object-cover object-center" priority sizes="50vw" />
              ) : (
                <div className="absolute inset-0 bg-foreground/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent w-2/5 z-10" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 items-center">
          <div className="container mx-auto max-w-7xl px-6 py-28 lg:py-36 lg:w-1/2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 lg:text-muted-foreground mb-8">
              Kayseri · Nevşehir
            </p>
            <img
              src="/noqt-logo-transparent.png"
              alt="NOQT"
              className="h-16 md:h-20 w-auto object-contain invert lg:invert-0 mb-2"
            />
            <h1 className="text-5xl font-bold tracking-tight text-white lg:text-foreground md:text-6xl leading-tight">
              DJ Akademi
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/75 lg:text-muted-foreground max-w-md">
              DJlikten prodüksiyona, tek günlük workshoplardan uzun eğitimlere.
              Sahneye hazırlayan pratik odaklı programlar.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://labs.noqta.club/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white lg:bg-foreground px-7 py-3 text-sm font-semibold text-foreground lg:text-background transition hover:opacity-90"
              >
                Detaylar için kaydol, seni arayalım
                <ArrowRight className="size-4" aria-hidden />
              </a>
              <a
                href="https://wa.me/905417997973?text=Merhaba%2C+NOQT+Academy+hakk%C4%B1nda+bilgi+almak+istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 lg:border-border bg-white/10 lg:bg-muted/50 px-7 py-3 text-sm font-medium text-white lg:text-foreground backdrop-blur-sm transition hover:bg-white/20 lg:hover:bg-muted"
              >
                WhatsApp&apos;tan Sor
              </a>
            </div>
          </div>
        </div>
      </section>

      <PageShell>
        <div className="grid gap-16 md:gap-20">

          {/* Eğitim Programları */}
          <section aria-labelledby="courses-heading">
            <PageBlockTitle
              sectionId="courses-heading"
              title="Eğitimler"
              description="Her seviyeye uygun, sahneye taşınan pratik müfredat."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {PROGRAMS.map((p) => (
                <div
                  key={p.label}
                  className={`group flex flex-col rounded-2xl border bg-gradient-to-br ${p.bg} p-6 transition hover:shadow-md ${p.border}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{p.category}</p>
                  <h3 className={`text-lg font-semibold ${p.accent}`}>{p.label}</h3>
                  <p className="mt-2 text-xs text-muted-foreground italic">{p.who}</p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Workshoplar */}
          <section aria-labelledby="workshops-heading">
            <PageBlockTitle
              sectionId="workshops-heading"
              title="Workshoplar"
              description="Tek günlük yoğun atölyelerle odaklı pratik. Başlangıç seviyesine de uygundur."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {WORKSHOPS.map((w) => (
                <div
                  key={w.label}
                  className="rounded-2xl border border-border bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm"
                >
                  <span className="inline-block rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground mb-3">
                    {w.duration}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{w.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Eğitmen */}
          <section aria-label="Eğitmen">
            <FurkanBioCard className="mx-auto max-w-3xl" variant="academy" />
          </section>

          {/* Nasıl ilerler */}
          <section aria-labelledby="process-heading">
            <PageBlockTitle
              sectionId="process-heading"
              title="Nasıl ilerliyorsun?"
              description="Uzun süreç yok — adımlar net."
            />
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { t: "Başvuru / keşif", h: "İlgi ve hedef" },
                { t: "Seviye & ilgi", h: "Netleştirme" },
                { t: "Program seçimi", h: "Eğitim, workshop veya ikisi" },
                { t: "Pratik & ilerleme", h: "Düzenli tekrar" },
                { t: "Üret & paylaş", h: "Performans / çıktı" },
              ].map((s, i) => (
                <li key={s.t} className="rounded-2xl border border-border bg-card p-4 transition hover:border-violet-300 hover:bg-violet-50/30">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">{s.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.h}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* SSS */}
          <section aria-labelledby="faq-heading">
            <PageBlockTitle
              sectionId="faq-heading"
              title="Sık sorulanlar"
              description="Kısa cevaplar; detay için WhatsApp yeterli."
            />
            <div className="grid gap-2">
              {ACADEMY_FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-border bg-card px-4 py-3 transition open:border-foreground/20 open:bg-muted/40 hover:border-foreground/15"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {item.q}
                      <span className="text-muted-foreground transition group-open:rotate-180">▼</span>
                    </span>
                  </summary>
                  <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Başvuru */}
          <section id="basvuru" className="scroll-mt-24 pb-4" aria-labelledby="apply-heading">
            <PageBlockTitle
              sectionId="apply-heading"
              title="Başvuru"
              description="İlgi alanını paylaş; sana uygun programı birlikte seçelim."
            />
            <ContentCard className="border-border bg-muted/30 p-6 md:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Kısa bir mesaj yeter: DJ mi, prodüksiyon mu, workshop mu — ve mümkünse hedef tarihin.
                Seni doğru programa yönlendirelim.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="https://labs.noqta.club/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
                >
                  Detaylar için kaydol, seni arayalım
                  <ArrowRight className="size-4" aria-hidden />
                </a>
                <a
                  href="https://wa.me/905417997973?text=Merhaba%2C+NOQT+Academy+i%C3%A7in+ba%C5%9Fvuru+yapmak+istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  WhatsApp&apos;tan Ulaş
                </a>
              </div>
            </ContentCard>
          </section>

        </div>
      </PageShell>
    </main>
  );
}

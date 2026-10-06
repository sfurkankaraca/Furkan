export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { GraduationCap, Music2, Zap } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { LabsShowcase } from "@/components/home/LabsShowcase";
import { AcademyInstagramFeed } from "@/components/academy/AcademyInstagramFeed";
import { AcademyPricing } from "@/components/academy/AcademyPricing";
import { FurkanBioCard } from "@/components/people/FurkanBioCard";
import { ACADEMY_FAQ_ITEMS } from "@/lib/academy-faq";
import { SITE_URL } from "@/lib/site-url";
import { getPrisma } from "@/lib/prisma";

// /academy kaldırıldı (→ /); SEO başlığı ve açıklaması ana sayfaya taşındı.
export const metadata: Metadata = {
  title: "NOQT DJ Akademi — Kayseri DJ ve Prodüksiyon Eğitimi",
  description:
    "1'e 1 DJ eğitimi 12.000₺ + KDV'den, her Pazar DJ Workshop 1.000₺ + KDV. Üniversite öğrencilerine %50 indirim, kredi kartına 12 aya varan taksit. Kayseri ve Nevşehir'de pratik odaklı eğitim.",
  alternates: { canonical: SITE_URL },
  keywords: ["DJ eğitimi Kayseri", "DJ kursu", "DJ eğitimi fiyatları", "birebir DJ dersi", "DJ workshop", "müzik prodüksiyonu eğitimi", "NOQT DJ Akademi"],
};

const PROGRAMS = [
  {
    icon: GraduationCap,
    label: "DJ Eğitimi",
    accent: "text-noqt-lime-ink bg-noqt-lime/15 border-noqt-lime/60",
    courses: ["1'e 1 DJ Eğitimi · 12.000₺ + KDV'den", "DJliğe Giriş → İleri Seviye"],
    desc: "Birebir ders ve etüt saatleriyle temelinden sahneye.",
  },
  {
    icon: Music2,
    label: "Müzik Prodüksiyonu",
    accent: "text-noqt-lime-ink bg-noqt-lime/15 border-noqt-lime/60",
    courses: ["Prodüksiyona Giriş"],
    desc: "Kendi sesini bul; DAW, mixing ve mastering ile prodüksiyon öğren.",
  },
  {
    icon: Zap,
    label: "Workshoplar",
    accent: "text-noqt-sky-ink bg-noqt-sky/15 border-noqt-sky/60",
    courses: ["Her Pazar 14.00 – 16.00", "Gruplar halinde · 60 dakika · Her hafta yeni mix challenge", "Tek seferlik 1.000₺ · Aylık 3.000₺ (+ KDV)"],
    desc: "Haftalık DJ Workshop'ta düzenli pratik yap.",
  },
];

export default async function HomePage() {
  const prisma = getPrisma();
  const heroAssets = prisma
    ? await prisma.siteAsset.findMany({
        where: { category: "hero" },
        orderBy: { createdAt: "asc" },
      })
    : [];
  const heroImages = heroAssets.length > 0 ? heroAssets.map((a) => a.url) : ["/1.JPG"];

  return (
    <main>
      <HeroSection heroImages={heroImages} />

      {/* ── PROGRAMLAR ── */}
      <section id="programs" className="scroll-mt-16 bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Eğitim Programları
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ne öğrenmek istiyorsun?
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              DJ&apos;likten prodüksiyona, tek günlük workshoplardan uzun soluklu eğitimlere — hepsini bir çatı altında bulursun.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {PROGRAMS.map((p) => (
              <div
                key={p.label}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:shadow-md hover:border-foreground/20"
              >
                <div className={`inline-flex rounded-xl border p-2.5 mb-5 ${p.accent}`}>
                  <p.icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{p.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.courses.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="size-1.5 rounded-full bg-foreground/30 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </section>

      <LabsShowcase />

      {/* ── EĞİTMEN ── */}
      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto grid max-w-6xl gap-16 px-6">
          <FurkanBioCard className="mx-auto max-w-3xl" variant="academy" />

        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <div className="border-t border-border bg-background py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <AcademyInstagramFeed />
        </div>
      </div>

      {/* ── FİYATLAR (reklam linkleri: /#fiyatlar, eski /academy#fiyatlar da buraya yönlenir) ── */}
      <div className="border-t border-border bg-background py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <AcademyPricing />
        </div>
      </div>

      {/* ── SSS ── */}
      <section className="bg-background pb-20 md:pb-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div aria-labelledby="faq-heading" className="mx-auto w-full max-w-3xl">
            <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Sık sorulanlar
            </h2>
            <div className="mt-6 grid gap-2">
              {ACADEMY_FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-border bg-card px-4 py-3 transition open:border-foreground/20 open:bg-muted/40 hover:border-foreground/15"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {item.q}
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-noqt-lime text-xs text-black transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── noqt.events cross-link ── */}
      <section className="bg-muted/40 border-t border-border py-14">
        <div className="container mx-auto max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Profesyonel DJ Hizmeti
            </p>
            <h2 className="text-xl font-semibold text-foreground">
              Düğün, kurumsal etkinlik veya özel parti mi?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Booking ve DJ hizmeti için noqt.events&apos;i ziyaret et.
            </p>
          </div>
          <a
            href="https://www.noqt.events"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            noqt.events ↗
          </a>
        </div>
      </section>
    </main>
  );
}

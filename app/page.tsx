export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, GraduationCap, Music2, Zap } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { LabsShowcase } from "@/components/home/LabsShowcase";
import { getPrisma } from "@/lib/prisma";

const PROGRAMS = [
  {
    icon: GraduationCap,
    label: "DJ Eğitimi",
    accent: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
    courses: ["1'e 1 DJ Eğitimi · 12.000₺ + KDV'den", "DJliğe Giriş → İleri Seviye"],
    desc: "Birebir ders ve etüt saatleriyle temelinden sahneye.",
  },
  {
    icon: Music2,
    label: "Müzik Prodüksiyonu",
    accent: "text-violet-600 bg-violet-50 border-violet-100",
    courses: ["Prodüksiyona Giriş"],
    desc: "Kendi sesini bul; DAW, mixing ve mastering ile prodüksiyon öğren.",
  },
  {
    icon: Zap,
    label: "Workshoplar",
    accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
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

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t border-border">
            <a
              href="https://labs.noqt.club/register"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Detaylar için kaydol, seni arayalım
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <Link
              href="/academy#fiyatlar"
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Fiyatları gör
            </Link>
            <p className="rounded-full bg-noqt-sky px-3 py-1 text-sm font-semibold text-black">Üniversite öğrencilerine %50 indirim</p>
            <p className="rounded-full bg-noqt-lime px-3 py-1 text-sm font-semibold text-black">Kredi kartına 12 aya varan taksit</p>
          </div>
        </div>
      </section>

      <LabsShowcase />

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

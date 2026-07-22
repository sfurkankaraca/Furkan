"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Gamepad2, CalendarDays, ArrowRight } from "lucide-react";

const PROGRAMS = [
  {
    href: "/academy",
    icon: GraduationCap,
    title: "Academy",
    desc: "DJ ve müzik prodüksiyon eğitimi — birebir rehberlik, pratik odaklı müfredat.",
    accent: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
  },
  {
    href: "/academy/labs",
    icon: GraduationCap,
    title: "Labs",
    desc: "Haftalık ilerleyen dersler; DJ101 ve Prodüksiyon101 müfredatları. Başvur, labs.noqta.club'da takip et.",
    accent: "bg-sky-50 text-sky-600 border-sky-100",
    external: "https://labs.noqta.club",
  },
  {
    href: "/academy/games",
    icon: Gamepad2,
    title: "Games",
    desc: "Eğlenceli formatlarla müzik bilgini ve DJ becerilerini geliştir.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];

export function HomeContent() {
  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-20 md:py-28">
          <div className="grid gap-8 justify-items-center text-center">
            <div className="relative w-[160px] h-[56px] md:w-[260px] md:h-[80px]">
              <Image
                src="/noqt_siyah_asf.png"
                alt="NOQT DJ Academy — Kayseri ve Nevşehir DJ eğitimi"
                fill
                priority
                unoptimized
                className="object-contain object-center"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                NOQT DJ Academy
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Kayseri ve Nevşehir&apos;de DJ ve müzik prodüksiyon eğitimi.
                Pratik odaklı Labs, eğlenceli Games ve birebir mentörlükle sahneye hazırlan.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition hover:opacity-90"
              >
                Programa başvur
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Etkinlikler
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-10">
            Programlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROGRAMS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/20 hover:shadow-sm"
              >
                <div className={`inline-flex rounded-xl border p-2.5 mb-4 ${p.accent}`}>
                  <p.icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition">
                  İncele <ArrowRight className="size-3" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why NOQT */}
      <section className="py-14 bg-muted/40 border-y border-border">
        <div className="container mx-auto max-w-4xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Neden NOQT?</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug">
              Kayseri ve Nevşehir&apos;de<br />profesyonel DJ eğitimi
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Sahne deneyimi olan eğitmenlerle bire bir çalış; teoriden çıkıp doğrudan
              ekipmana geç. Kayseri merkezli, Nevşehir&apos;e ulaşan bir müzik topluluğu.
            </p>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 mt-6 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Eğitim detayları →
            </Link>
          </div>
          <div className="grid gap-3">
            {[
              { title: "Pratik odaklı", desc: "Teori değil, ekipman başında öğrenme." },
              { title: "Bire bir mentörlük", desc: "Sahne deneyimli eğitmenle doğrudan çalış." },
              { title: "Kayseri & Nevşehir", desc: "Merkezi lokasyon, Orta Anadolu'ya yakın." },
              { title: "Topluluk", desc: "Mezunlar ağı, etkinlik fırsatları, sahne." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-background px-4 py-3">
                <span className="text-sm font-medium text-foreground">{f.title}</span>
                <span className="text-sm text-muted-foreground"> — {f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events teaser */}
      <section className="py-14 bg-background">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Topluluk</p>
          <h2 className="text-2xl font-semibold text-foreground">Etkinlikler ve sahne</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Academy mezunları Noqta etkinliklerinde sahne alır. Dinleyici olarak katıl ya da
            sanatçı olarak başvur.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
            >
              <CalendarDays className="size-4" aria-hidden />
              Etkinlikleri keşfet
            </Link>
            <a
              href="https://www.noqt.events/basvuru/sanatci"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Sanatçı başvurusu ↗
            </a>
          </div>
        </div>
      </section>

      {/* noqt.events CTA */}
      <section className="pb-16 bg-background">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-border bg-muted/40 px-6 py-7 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Düğün, organizasyon veya özel etkinlik için profesyonel DJ hizmeti mi arıyorsunuz?
            </p>
            <a
              href="https://www.noqt.events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
            >
              noqt.events&apos;i ziyaret et ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

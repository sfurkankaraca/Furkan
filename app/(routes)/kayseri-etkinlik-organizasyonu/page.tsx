import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { contactHref } from "@/lib/contact-href";

export const metadata = {
  title: "Kayseri Etkinlik Organizasyonu | Noqta Club",
  description:
    "Kayseri’de etkinlik organizasyonu, müzik kürasyonu ve DJ booking hizmeti. Özel etkinlik müzik hizmetiyle DJ performans booking ve Türkiye geneli planlama.",
  alternates: {
    canonical: "/kayseri-etkinlik-organizasyonu",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Noqta Club",
  provider: { "@type": "Organization", name: "noqta", url: "https://noqta.club" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kayseri",
    addressCountry: "TR",
  },
  areaServed: ["Türkiye"],
  serviceType: "DJ Booking / Event Services",
  description:
    "Kayseri etkinlik organizasyonu, DJ booking ve DJ performans booking. Kayseri’den başlayıp Türkiye genelinde özel etkinlik müzik hizmeti.",
};

export default function KayseriEtkinlikOrganizasyonuPage() {
  return (
    <PageShell>
      <div className="grid gap-14 md:gap-20">
        <PageHeader
          eyebrow={
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
              <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
              Kayseri odaklı
            </p>
          }
          title={
            <>
              Kayseri <span className="text-cyan-300">etkinlik organizasyonu</span>
            </>
          }
          description="Kayseri’de etkinlik organizasyonunu; müzik akışı, DJ booking ve sahne koordinasyonu ile uçtan uca kurguluyoruz."
          actions={
            <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white">
              <Link
                href={contactHref(
                  "Kayseri Etkinlik Organizasyonu — Teklif talebi",
                  "Merhaba,\n\nŞehir: Kayseri\nEtkinlik türü: \nTarih / dönem: \nMekan (varsa): \nBeklenen müzik akışı: \n\nKısa not:\n",
                )}
              >
                Teklif iste
              </Link>
            </Button>
          }
        />

        <section className="grid gap-6 md:grid-cols-[1fr_0.95fr]">
          <ContentCard>
            <h2 className="text-xl font-semibold tracking-tight">Etkinlik organizasyonu Kayseri</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">
              Özel etkinlik müzik hizmetiyle program akışını güçlendirir, DJ performans booking sürecini netleştirir ve
              sahne gününde tek muhatap olarak koordinasyonu yönetiriz.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-white/65">
              {[
                "DJ set & canlı performans booking",
                "Etkinlik organizasyonu Kayseri planlama",
                "Türkiye geneli lojistik + teknik uyum",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
                <Link href="/kayseri-dj">Kayseri DJ — etkinlik müziği ve teklif</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
                <Link href="/booking">DJ booking & organizasyon</Link>
              </Button>
            </div>
          </ContentCard>

          <ContentCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Premium, net süreç</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">
              Brifinizle timeline’i çıkarır; teknik ihtiyaçları ve müzik akışını planlarız. Kayseri’den başlayıp Türkiye
              genelinde aynı özenle ilerleriz.
            </p>
          </ContentCard>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </PageShell>
  );
}


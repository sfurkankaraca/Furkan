import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { contactHref } from "@/lib/contact-href";

export const metadata = {
  title: "Kayseri DJ Booking | Noqta Club",
  description:
    "Kayseri merkezli DJ booking ve DJ kiralama. Düğün/nişan/kına, açılış ve özel etkinliklerde DJ performans booking ile müzik kürasyonu. Türkiye geneli.",
  alternates: {
    canonical: "/kayseri-dj-booking",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Noqta Club",
  provider: { "@type": "Organization", name: "noqta", url: "https://noqt.club" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kayseri",
    addressCountry: "TR",
  },
  areaServed: ["Türkiye"],
  serviceType: "DJ Booking / Event Services",
  description:
    "Kayseri DJ booking, DJ kiralama Kayseri ve etkinlik organizasyonu. DJ performans booking ile Türkiye geneline özel etkinlik müzik hizmeti.",
};

export default function KayseriDjBookingPage() {
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
              Kayseri <span className="text-cyan-300">DJ booking</span>
            </>
          }
          description="Düğün/nişan/kına, açılış, marka lansmanı ve özel etkinliklerde Kayseri’de başlayıp Türkiye geneline uzanan DJ booking hizmeti."
          actions={
            <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-noqt-lime to-noqt-lime text-black">
              <Link
                href={contactHref(
                  "Kayseri DJ Booking — Teklif talebi",
                  "Merhaba,\n\nŞehir: Kayseri\nEtkinlik türü: \nTarih / dönem: \nMekan (varsa): \nDJ set / canlı performans ihtiyacı: \n\nKısa not:\n",
                )}
              >
                Teklif iste
              </Link>
            </Button>
          }
        />

        <section className="grid gap-6 md:grid-cols-[1fr_0.95fr]">
          <ContentCard>
            <h2 className="text-xl font-semibold tracking-tight">DJ kiralama Kayseri</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">
              DJ performans booking ve müzik kürasyonu ile etkinlik planınızı kusursuz akışa çeviriyoruz. Kayseri’de
              detayları netleştiriyor, Türkiye genelinde sahne günü koordinasyonunu yönetiyoruz.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-white/65">
              {[
                "Vibe uyumlu DJ set & canlı performans",
                "Etkinlik organizasyonu Kayseri planlaması",
                "Özel etkinlik müzik hizmeti: timeline + teknik uyum",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gradient-to-r from-noqt-lime to-noqt-sky" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
                <Link href="/kayseri-dj">Kayseri DJ hizmeti — detaylı sayfa</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
                <Link href="/booking">Ana booking sayfası</Link>
              </Button>
            </div>
          </ContentCard>

          <ContentCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Kısa süreç</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">
              Brifinizle başlıyoruz: konu + şehir + tarih; ardından DJ roster ve teknik gereksinimler netleşiyor. Kayseri
              ve Türkiye geneli için hızlı geri bildirim sağlıyoruz.
            </p>
          </ContentCard>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </PageShell>
  );
}


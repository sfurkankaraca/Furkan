"use client";

import { motion } from "framer-motion";
import { Images } from "lucide-react";
import { PageBlockTitle, ContentCard } from "@/components/layout/PageShell";
import { BookingOfferFlow } from "@/components/offers/BookingOfferFlow";
import { BookingServiceOverview } from "@/components/booking/BookingServiceOverview";
import { BOOKING_FAQ_ITEMS } from "@/lib/booking-faq";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

const whyItems = [
  {
    title: "Etkinliğe özel müzik kurgusu",
    text: "Line-up ve akış; mekân, davet profili ve tempo ile uyumlu planlanır.",
  },
  {
    title: "Kitle ve enerjiye göre set",
    text: "Gece ilerledikçe tonu doğru yerde yükseltip yumuşatırız; doğal bir yayılma.",
  },
  {
    title: "Türkçe / global dengesi",
    text: "İhtiyaca göre dengeli seleksiyon — belirgin bir dil seçilmez, konsept konuşur.",
  },
  {
    title: "Profesyonel iletişim",
    text: "Zaman çizgisi ve teknik çerçeve net; sürprize yer bırakmadan sakin ilerlersin.",
  },
] as const;

const processSteps = [
  { title: "Talep bırak", hint: "Form veya iletişim" },
  { title: "Kısa değerlendirme", hint: "Tarih & uygunluk" },
  { title: "Konsept & ihtiyaç", hint: "Birlikte netleşelim" },
  { title: "Teklif & planlama", hint: "Akış ve koordinasyon" },
  { title: "Etkinlik günü", hint: "Uygulama" },
] as const;

const stripLabels = ["Kare 1", "Kare 2", "Kare 3", "Kare 4", "Kare 5"] as const;

function MediaStrip({ urls }: { urls: (string | null)[] }) {
  return (
    <div className="-mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-3 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin] snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0 md:snap-none">
        {stripLabels.map((label, i) => {
          const src = urls[i] ?? null;
          return (
            <div
              key={label}
              className="group relative aspect-video w-[min(78vw,17.5rem)] shrink-0 snap-center overflow-hidden rounded-xl border border-white/12 bg-white/[0.03] shadow-inner shadow-black/40 transition duration-300 hover:border-white/22 hover:bg-white/[0.05] md:w-auto"
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={`Sahneden kare — ${label}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-noqt-lime/10 via-transparent to-noqt-sky/10 opacity-80 transition group-hover:opacity-100 ${src ? "pointer-events-none mix-blend-soft-light" : ""}`}
                aria-hidden
              />
              {!src ? (
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <Images className="size-8 text-white/20 transition group-hover:text-white/30" aria-hidden />
                </div>
              ) : null}
              <span className="sr-only">
                {src ? `${label} — görsel` : `${label} — görsel alanı; admin panelinden eklenebilir`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BookingSections({ mediaImageUrls = [] }: { mediaImageUrls?: (string | null)[] }) {
  return (
    <>
      <motion.section className="mb-14 md:mb-16" {...fadeUp}>
        <BookingServiceOverview />
      </motion.section>

      <motion.section aria-labelledby="booking-why" {...fadeUp}>
        <PageBlockTitle
          sectionId="booking-why"
          title="Neden noqta?"
          description="Kısa ve net: müzik tarafını sakin biçimde üstlenir, etkinliğinin akışına odaklanırsın."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <ContentCard
              key={item.title}
              className="p-4 md:p-5 transition duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]"
            >
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60 md:text-sm">{item.text}</p>
            </ContentCard>
          ))}
        </div>
      </motion.section>

      <motion.section className="mt-14 md:mt-16" aria-labelledby="booking-media" {...fadeUp}>
        <PageBlockTitle
          sectionId="booking-media"
          title="Sahneden kareler"
          description="Seçili etkinliklerden kareler. Görselleri yönetim panelindeki “Site görselleri” bölümünden ekleyebilirsin."
        />
        <MediaStrip urls={mediaImageUrls} />
      </motion.section>

      <motion.section className="mt-14 md:mt-16" aria-labelledby="booking-process" {...fadeUp}>
        <PageBlockTitle
          sectionId="booking-process"
          title="Nasıl ilerliyoruz?"
          description="Uzun süreç yok — adımlar net."
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s, idx) => (
            <li
              key={s.title}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-noqt-lime/25 hover:bg-white/[0.05]"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-noqt-lime/90">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-sm font-medium text-white">{s.title}</p>
              <p className="mt-1 text-xs text-white/50">{s.hint}</p>
              {idx < processSteps.length - 1 ? (
                <span
                  className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-white/20 to-transparent lg:block"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section className="mt-14 md:mt-16 scroll-mt-24" id="teklif" aria-labelledby="booking-lead" {...fadeUp}>
        <PageBlockTitle
          sectionId="booking-lead"
          title="Teklif talebi"
          description="Etkinlik detaylarını paylaş — sana uygun akışı birlikte planlayalım. İstersen doğrudan formu doldur, istersen iletişim kanalından devam et."
        />
        <ContentCard className="mb-6 border-white/12 bg-white/[0.035] p-5 md:p-6">
          <p className="text-sm leading-relaxed text-white/70">
            Aşağıdan etkinlik türünü seç; hazır şablonla{" "}
            <strong className="font-medium text-white/85">teklif talebini</strong> iletebilir veya WhatsApp üzerinden hızlıca
            bağlanabilirsin. Yanıt süresi yoğunluğa göre değişir; mümkün olan en kısa sürede dönüş yapıyoruz.
          </p>
        </ContentCard>
        <BookingOfferFlow />
      </motion.section>

      <motion.section className="mt-14 md:mt-16" aria-labelledby="booking-faq" {...fadeUp}>
        <PageBlockTitle
          sectionId="booking-faq"
          title="Sık sorulanlar"
          description="Kısa cevaplar; ayrıntı için iletişime geçmek yeterli."
        />
        <div className="grid gap-2">
          {BOOKING_FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition open:border-white/[0.16] open:bg-white/[0.05] hover:border-white/14"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-white/35 transition group-open:rotate-180">▼</span>
                </span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/65">{item.a}</p>
            </details>
          ))}
        </div>
      </motion.section>
    </>
  );
}

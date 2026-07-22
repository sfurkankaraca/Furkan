"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_BOOKING =
  "https://wa.me/905417997973?text=" +
  encodeURIComponent("Merhaba, DJ booking / etkinlik müziği için bilgi almak istiyorum.");

const bullets = [
  "Konsepte uyumlu müzik akışı",
  "Özel davetlerden marka etkinliklerine esnek kurgu",
  "Türkiye genelinde seçili projeler",
] as const;

export function BookingHero() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-14 md:py-20 lg:py-24">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
          <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
          Booking
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.1]">
          DJ booking ve etkinlik müziği — net akış, özel deneyim
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base md:leading-relaxed">
          Düğün ve kutlamalardan kurumsal geceye; mekân ve sahneye uygun müzik kurgusu ile etkinliğin enerjisini yükseltiyoruz.
          Planı birlikte netleştirip, gününde profesyonel şekilde uyguluyoruz.
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-lg sm:flex-row sm:justify-center">
          <Button
            asChild
            className="h-11 rounded-xl bg-white text-black shadow-sm shadow-black/20 transition hover:bg-white/92 active:scale-[0.99]"
          >
            <Link href="/teklif?kaynak=booking">Teklif Al</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-white/25 bg-white/[0.06] text-white backdrop-blur-sm transition hover:border-white/35 hover:bg-white/10 active:scale-[0.99]"
          >
            <a href={WHATSAPP_BOOKING} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp&apos;tan Ulaş
            </a>
          </Button>
        </div>

        <ul className="mx-auto mt-10 flex max-w-xl flex-col gap-2.5 text-left sm:mx-auto sm:max-w-md">
          {bullets.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2.5 text-sm text-white/75"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-400/90" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-white/45 leading-relaxed">
          Yerel sayfalar:{" "}
          <Link href="/kayseri-dj" className="text-white/60 underline-offset-4 transition hover:text-white/85 hover:underline">
            Kayseri DJ hizmeti
          </Link>
          <span className="text-white/30"> · </span>
          <Link href="/nevsehir-dj" className="text-white/60 underline-offset-4 transition hover:text-white/85 hover:underline">
            Nevşehir &amp; Kapadokya etkinlik DJ
          </Link>
          <span className="text-white/30"> · </span>
          <Link href="/ankara-dj" className="text-white/60 underline-offset-4 transition hover:text-white/85 hover:underline">
            Ankara kurumsal etkinlik DJ
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

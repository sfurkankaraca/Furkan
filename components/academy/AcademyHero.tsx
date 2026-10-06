"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WA =
  "https://wa.me/905417997973?text=" +
  encodeURIComponent("Merhaba, Noqta Academy programları hakkında bilgi almak istiyorum.");

const values = [
  "Labs: modüller, quiz, pratik ödev ve gelişim takibi",
  "Games: DJ refleksini oyunla güçlendir",
  "Stüdyo, sahne, içerik ve kariyer — tek çatı altında",
] as const;

export function AcademyHero() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-14 md:py-20">
      <motion.div
        className="rounded-2xl border border-border bg-card p-6 md:p-8 lg:p-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3.5 text-cyan-500" aria-hidden />
          Academy
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl md:leading-tight lg:text-5xl">
          Noqta Academy — DJ ve prodüksiyon eğitimleri
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          <strong className="font-medium text-foreground">Teoriyi online&apos;da sağlamlaştır</strong>, pratiği stüdyo ve sahneyle
          pekiştir, kariyerini mentorluk ve sektör bağlantılarıyla büyüt. Labs ile modüler öğrenme ve gelişim takibi, Games
          ile oyunlaştırılmış DJ pratiği; etkinliklerde sahne deneyimi, portfolyo videoları ve booking / B2B ile sürdürülebilir
          bir yol haritası.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            asChild
            className="h-11 rounded-xl bg-foreground text-background shadow-sm transition hover:opacity-90 active:scale-[0.99]"
          >
            <Link href="#programs">Programları Keşfet</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-xl bg-noqt-lime text-black shadow-sm transition hover:bg-noqt-lime active:scale-[0.99]"
          >
            <Link href="#basvuru">Başvuru Yap</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-border bg-muted/50 text-foreground transition hover:bg-muted active:scale-[0.99]"
          >
            <a href={WA} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp&apos;tan Sor
            </a>
          </Button>
        </div>

        <ul className="mt-10 grid gap-2.5 sm:grid-cols-3 sm:gap-4">
          {values.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-left text-xs text-muted-foreground md:text-sm"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

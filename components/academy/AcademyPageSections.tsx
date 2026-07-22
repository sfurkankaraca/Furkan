"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookMarked,
  Briefcase,
  Building2,
  CalendarDays,
  Clapperboard,
  Gamepad2,
  GraduationCap,
  Headphones,
  Layers,
  LineChart,
  Mic2,
  Music2,
  Target,
  Users,
} from "lucide-react";
import { PageBlockTitle, ContentCard } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/contact-href";
import { ACADEMY_FAQ_ITEMS } from "@/lib/academy-faq";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

const WA =
  "https://wa.me/905417997973?text=" +
  encodeURIComponent("Merhaba, Noqta Academy için yönlendirme almak istiyorum.");

const whoItems = [
  { icon: Headphones, text: "DJ'liğe başlamak isteyenler" },
  { icon: Music2, text: "Elektronik müzik üretimine giriş yapmak isteyenler" },
  { icon: Mic2, text: "Sahneye çıkmadan önce temelini sağlam kurmak isteyenler" },
  { icon: Layers, text: "Kendi müziğini yapıp performansa taşımak isteyenler" },
  { icon: Target, text: "Daha disiplinli bir öğrenme yapısı arayanlar" },
] as const;

const stripItems = [
  { label: "Ders ortamı" },
  { label: "Workshop" },
  { label: "Öğrenci çıktısı" },
  { label: "Sahne pratiği" },
  { label: "Topluluk" },
] as const;

function MediaStrip({ urls }: { urls: (string | null)[] }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 pt-1 [scrollbar-width:thin] snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 md:snap-none">
      {stripItems.map((item, i) => {
        const src = urls[i] ?? null;
        const { label } = item;
        return (
          <div
            key={label}
            className="relative aspect-[4/3] w-[min(72vw,11rem)] shrink-0 snap-center overflow-hidden rounded-xl border border-border bg-muted/40 transition duration-300 hover:border-foreground/20 md:w-auto"
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5 ${src ? "pointer-events-none mix-blend-soft-light" : ""}`}
              aria-hidden
            />
            <div className="absolute inset-0 flex items-end p-3">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
            <span className="sr-only">
              {src ? `${label} — görsel` : `${label} — admin / Site görselleri üzerinden eklenebilir`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function AcademyPageSections({
  academyMediaUrls = [],
}: {
  academyMediaUrls?: (string | null)[];
}) {
  return (
    <div className="grid gap-14 md:gap-16">
      <motion.section aria-labelledby="academy-who" {...fade}>
        <PageBlockTitle
          sectionId="academy-who"
          title="Bu eğitim kimler için?"
          description="Kendini bir yerlerde tanıdıysan, doğru yerdesin — uzun metin yok, net profiller."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {whoItems.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition duration-300 hover:border-foreground/20 hover:bg-muted/50"
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-fuchsia-600" aria-hidden />
              <p className="text-sm leading-snug text-foreground">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section id="programs" className="scroll-mt-24" aria-labelledby="academy-programs" {...fade}>
        <PageBlockTitle
          sectionId="academy-programs"
          title="Labs ve Games"
          description="Biri bilgiyi ve disiplini kurar, diğeri refleksi ve tekrarı oyunlaştırır — ikisi birlikte daha hızlı ilerletir."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <a
            href="https://labs.noqta.club"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-background to-purple-50 p-6 transition duration-300 hover:border-fuchsia-300 hover:shadow-md md:p-7"
          >
            <GraduationCap className="size-9 text-fuchsia-600" aria-hidden />
            <h3 className="mt-4 text-xl font-semibold text-foreground">Labs</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              labs.noqta.club üzerinde modüller, konu anlatımları, quiz ve pratik ödevlerle teoriyi netleştirir; ilerlemeni
              birlikte takip ederiz.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-fuchsia-500">·</span> Modüler içerik + quiz + ödev — sağlam temel
              </li>
              <li className="flex gap-2">
                <span className="text-fuchsia-500">·</span> Gelişim takibi ve düzenli geri bildirim
              </li>
              <li className="flex gap-2">
                <span className="text-fuchsia-500">·</span> DJ ve prodüksiyonu aynı çizgide ele alma
              </li>
            </ul>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-fuchsia-600">
              labs.noqta.club
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </a>

          <Link
            href="/games"
            className="group relative flex flex-col rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-background to-teal-50 p-6 transition duration-300 hover:border-emerald-300 hover:shadow-md md:p-7"
          >
            <Gamepad2 className="size-9 text-emerald-600" aria-hidden />
            <h3 className="mt-4 text-xl font-semibold text-foreground">Games</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              DJ&apos;lik becerilerini eğlenceli mini oyunlarla çalışırsın; tempo, kulak ve refleks Labs&apos;taki bilgiyle birleşince
              set hazırlığı daha akıcı olur.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-emerald-500">·</span> Oyunlaştırılmış pratik ve anında tekrar
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">·</span> Genre, BPM ve ilerleyen mini challenge&apos;lar
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">·</span> Labs ile çift kanallı öğrenme: bilgi + refleks
              </li>
            </ul>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
              Games sayfasına git
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </div>
      </motion.section>

      <motion.section aria-labelledby="academy-why" {...fade}>
        <PageBlockTitle
          sectionId="academy-why"
          title="Ekosistem: teoriden kariyere"
          description="Ders, pratik, sahne ve sektör bağlantıları aynı hikâyede — parça parça değil, bütün bir yol."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              {
                icon: BookMarked,
                title: "Online Labs",
                body: "Modüller, anlatımlar, quiz ve ödevlerle teoriyi oturtur; ilerlemeni görünür kılarız.",
                accent: "text-fuchsia-600",
              },
              {
                icon: LineChart,
                title: "Gelişim takibi",
                body: "Öğrenci yolculuğunu birlikte izleriz; eksikleri erken yakalayıp doğru pratikle kapatırsın.",
                accent: "text-violet-600",
              },
              {
                icon: Gamepad2,
                title: "Games",
                body: "Oyunlarla DJ refleksi ve kulak çalışması; Labs'taki bilgiyi sahneye taşımadan önce pekiştirir.",
                accent: "text-emerald-600",
              },
              {
                icon: Building2,
                title: "Stüdyo & etüt",
                body: "Pratik odaklı ders ve etütlerle mixer, kulaklık ve gerçek ortamda tekrar.",
                accent: "text-cyan-600",
              },
              {
                icon: CalendarDays,
                title: "Sahne & etkinlik",
                body: "Etkinliklerde sahne deneyimi; performans öncesi heyecanı kontrollü şekilde yaşarsın.",
                accent: "text-amber-600",
              },
              {
                icon: Clapperboard,
                title: "İçerik & portfolyo",
                body: "Portfolyo ve sosyal medya için video çıktıları; kendini pazarlamaya hazır görünürlük.",
                accent: "text-rose-600",
              },
              {
                icon: Briefcase,
                title: "Kariyer & mentorluk",
                body: "Başarılı öğrencilerde menajerlik, booking ve B2B ile sürdürülebilir gelir yolları — yanında mentorluk.",
                accent: "text-sky-600",
              },
              {
                icon: Users,
                title: "Topluluk",
                body: "Beraber büyüyen bir ağ; paylaşım, motivasyon ve sektörle temas öğrenmenin parçası.",
                accent: "text-teal-600",
              },
            ] as const
          ).map(({ icon: Icon, title, body, accent }) => (
            <ContentCard
              key={title}
              className="p-4 transition duration-300 hover:border-foreground/20 hover:bg-muted/50 md:p-5"
            >
              <Icon className={`size-6 shrink-0 ${accent}`} aria-hidden />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </ContentCard>
          ))}
        </div>
      </motion.section>

      <motion.section aria-labelledby="academy-process" {...fade}>
        <PageBlockTitle
          sectionId="academy-process"
          title="Nasıl ilerliyorsun?"
          description="Uzun süreç yok — adımlar net."
        />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: "Başvuru / keşif", h: "İlgi ve hedef" },
            { t: "Seviye & ilgi", h: "Netleştirme" },
            { t: "Yönlendirme", h: "Labs, Games, stüdyo veya atölye" },
            { t: "Pratik & ilerleme", h: "Düzenli tekrar" },
            { t: "Üret & paylaş", h: "Performans / çıktı" },
          ].map((s, i) => (
            <li
              key={s.t}
              className="rounded-2xl border border-border bg-card p-4 transition duration-300 hover:border-violet-300 hover:bg-violet-50/30"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-sm font-medium text-foreground">{s.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.h}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section aria-labelledby="academy-proof" {...fade}>
        <PageBlockTitle
          sectionId="academy-proof"
          title="Sahneden kareler"
          description="Görselleri yönetim panelindeki Site görselleri bölümünden (Academy şeridi) ekleyebilirsin."
        />
        <MediaStrip urls={academyMediaUrls} />
      </motion.section>

      <motion.section aria-labelledby="academy-faq" {...fade}>
        <PageBlockTitle
          sectionId="academy-faq"
          title="Sık sorulanlar"
          description="Kısa cevaplar; detay için başvur veya WhatsApp yeterli."
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
      </motion.section>

      <motion.section
        id="basvuru"
        className="scroll-mt-24"
        aria-labelledby="academy-apply"
        {...fade}
      >
        <PageBlockTitle
          sectionId="academy-apply"
          title="Başvuru"
          description="İlgi alanını paylaş; sana uygun programı birlikte seçelim. Noqta Academy'de nasıl başlayabileceğini netleştirelim."
        />
        <ContentCard className="border-border bg-muted/30 p-6 md:p-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Kısa bir mesaj yeter: DJ mi, prodüksiyon mu, ikisi birden mi — ve mümkünse hedef tarihin. Seni uygun Labs,
            Games veya atölye akışına yönlendirelim.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="rounded-xl bg-foreground text-background hover:opacity-90">
              <Link
                href={contactHref(
                  "Noqta Academy — Başvuru",
                  "Merhaba,\n\nİlgi alanım: (DJ / prodüksiyon / ikisi)\nDeneyim seviyem: \nHedefim veya tarih: \n\nTeşekkürler,\n",
                )}
              >
                Başvuru Yap
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border bg-muted/50 hover:bg-muted"
            >
              <Link href="#programs">Programı İncele</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border bg-muted/50 hover:bg-muted"
            >
              <a href={WA} target="_blank" rel="noopener noreferrer">
                WhatsApp&apos;tan Ulaş
              </a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Atölye başvuruları için:{" "}
            <Link href="/academy/workshops/apply" className="text-foreground/70 underline-offset-2 hover:text-foreground hover:underline">
              workshop başvuru
            </Link>{" "}
            sayfasına da göz atabilirsin.
          </p>
        </ContentCard>
      </motion.section>
    </div>
  );
}

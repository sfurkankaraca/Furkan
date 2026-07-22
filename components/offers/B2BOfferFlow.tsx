"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/layout/PageShell";
import { contactHref } from "@/lib/contact-href";
import { teklifHref } from "@/lib/teklif-href";
import { cn } from "@/lib/utils";

const WHATSAPP_HREF = "https://wa.me/905417997973";

const OPTIONS = [
  {
    id: "marka-ortaklik",
    title: "Marka iş birliği",
    subtitle: "Ortak hikâye, kültürel konumlanma",
    detail:
      "Sponsorluktan öte, markanızın tonuyla uyumlu uzun soluklu veya kampanya bazlı iş birlikleri. Görünürlük ve deneyimi birlikte kurgularız.",
    subject: "B2B — Marka iş birliği",
    message:
      "Merhaba,\n\nMarkamız için Noqta ile marka iş birliği konuşmak istiyoruz.\n\nMarka / kurum: \nHedef (görünürlük / lansman / seri etkinlik): \nŞehir: \nDönem: \nReferans link veya ton: \n\nTeşekkürler,\n",
  },
  {
    id: "etkinlik-lansman",
    title: "Etkinlik & lansman",
    subtitle: "Akış, müzik, misafir yolculuğu",
    detail:
      "Ürün lansmanı, açılış veya davet için sahne müziği, zaman çizelgesi ve deneyim akışını tek çatıda planlarız.",
    subject: "B2B — Etkinlik / lansman kurgusu",
    message:
      "Merhaba,\n\nEtkinlik veya lansman için destek arıyoruz.\n\nEtkinlik tipi: \nTarih & şehir: \nMisafir profili (kısaca): \nMekân (varsa): \nİçerik beklentisi (reel / foto / yok): \n\nTeşekkürler,\n",
  },
  {
    id: "icerik-etkinlik",
    title: "İçerik + etkinlik",
    subtitle: "Reel, backstage, sosyal odaklı gece",
    detail:
      "Etkinliği paylaşılabilir kılmak için çekim, kısa format ve kanal stratejisini baştan masaya koyarız; müzik ve içerik aynı hikâyede ilerler.",
    subject: "B2B — İçerik + etkinlik paketi",
    message:
      "Merhaba,\n\nEtkinlikle birlikte içerik üretimi istiyoruz.\n\nKanallar (IG / TikTok / YouTube): \nTahmini teslimat (adet / süre): \nEtkinlik tarihi & şehir: \nMarka rehberi (varsa): \n\nTeşekkürler,\n",
  },
  {
    id: "mekan-seri",
    title: "Mekân & düzenli format",
    subtitle: "Restoran, otel, lounge serisi",
    detail:
      "Tek gecelik veya haftalık / aylık müzik ve deneyim ritmi; mekân kimliğine uygun seçki ve gerekiyorsa içerik hatları.",
    subject: "B2B — Mekân müziği / seri iş birliği",
    message:
      "Merhaba,\n\nMekânımız için düzenli veya özel DJ / müzik iş birliği düşünüyoruz.\n\nMekân tipi & şehir: \nHedef (haftalık / aylık / tek gece): \nKonsept veya referans ton: \n\nTeşekkürler,\n",
  },
  {
    id: "genel",
    title: "Henüz net değil",
    subtitle: "Önce konuşalım, şekillendirelim",
    detail:
      "Tek paragraf da yeter; doğru formatı ve kapsamı birlikte çıkarırız. Yükü size bırakmayız.",
    subject: "B2B — Genel iş birliği talebi",
    message:
      "Merhaba,\n\nNoqta ile iş birliği yapmak istiyoruz.\n\nMarka / mekân: \nKısaca hayal ettiğimiz şey: \nŞehir: \nZaman tahmini: \n\nTeşekkürler,\n",
  },
] as const;

export function B2BOfferFlow() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const selected = OPTIONS.find((o) => o.id === activeId);

  return (
    <ContentCard className="p-5 md:p-8 transition duration-300 hover:border-white/12">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-white/45 sm:text-left">
        1 — Size en yakın iş birliği tipi
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActiveId(o.id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition duration-300 md:p-5",
              activeId === o.id
                ? "border-fuchsia-400/45 bg-white/[0.08] shadow-sm shadow-fuchsia-500/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05] active:scale-[0.99]",
            )}
          >
            <span className="block font-semibold text-white">{o.title}</span>
            <span className="mt-1 block text-sm text-white/55">{o.subtitle}</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="mt-8 border-t border-white/10 pt-8"
          role="region"
          aria-label="İş birliği sonraki adım"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">2 — Nasıl devam edelim?</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{selected.detail}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              className="rounded-xl bg-white text-black transition hover:bg-white/90 hover:shadow-md hover:shadow-white/10"
            >
              <Link href={contactHref(selected.subject, selected.message)}>
                İş birliği başlat
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
              <Link href={teklifHref({ kaynak: "b2b" })}>
                Teklif al
                <ArrowRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
              <Link href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp’tan ulaş
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl text-white/70 hover:bg-white/5 hover:text-white"
              onClick={() => setActiveId(null)}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Başka seçenek
            </Button>
          </div>
        </div>
      ) : null}
    </ContentCard>
  );
}

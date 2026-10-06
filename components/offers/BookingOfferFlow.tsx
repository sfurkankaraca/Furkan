"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/layout/PageShell";
import { contactHref } from "@/lib/contact-href";
import { teklifHref } from "@/lib/teklif-href";
import { cn } from "@/lib/utils";
import { BOOKING_OFFER_OPTIONS } from "@/lib/booking-offer-options";

const WHATSAPP_HREF = "https://wa.me/905417997973?text=" + encodeURIComponent("Merhaba, DJ booking için yazıyorum.");

const FORM_URL = process.env.NEXT_PUBLIC_BOOKING_GOOGLE_FORM_URL?.trim() || "";

function BookingOfferFlowInner() {
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  const selected = BOOKING_OFFER_OPTIONS.find((o) => o.id === activeId);

  useEffect(() => {
    const sec = searchParams.get("sec");
    if (sec && BOOKING_OFFER_OPTIONS.some((o) => o.id === sec)) {
      setActiveId(sec);
    }
  }, [searchParams]);

  return (
    <ContentCard className="p-5 md:p-8">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-white/45 sm:text-left">
        1 — Etkinlik türünü seç
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKING_OFFER_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActiveId(o.id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition duration-300 md:p-5",
              activeId === o.id
                ? "border-noqt-lime/45 bg-white/[0.08] shadow-md shadow-noqt-lime/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.055] active:scale-[0.99]",
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
          aria-label="Teklif talebi için sonraki adım"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">2 — İletişim kanalı</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{selected.detail}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="rounded-xl bg-white text-black shadow-sm hover:bg-white/90">
              <Link href={teklifHref({ kaynak: "booking", sec: selected.id })}>
                Teklif talebi oluştur
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
            >
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </a>
            </Button>
            {FORM_URL ? (
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
              >
                <a href={FORM_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" aria-hidden />
                  Google Form ile gönder
                </a>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl text-white/70 hover:bg-white/5 hover:text-white"
              onClick={() => setActiveId(null)}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Başka bir tür
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/45">
            İletişim formunda etkinlik detaylarını paylaşman, teklifi hızlandırır.
          </p>
        </div>
      ) : null}
    </ContentCard>
  );
}

function BookingOfferFallback() {
  return (
    <ContentCard className="p-5 md:p-8 animate-pulse">
      <div className="h-4 w-40 rounded bg-white/10" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/[0.06]" />
        ))}
      </div>
    </ContentCard>
  );
}

export function BookingOfferFlow() {
  return (
    <Suspense fallback={<BookingOfferFallback />}>
      <BookingOfferFlowInner />
    </Suspense>
  );
}

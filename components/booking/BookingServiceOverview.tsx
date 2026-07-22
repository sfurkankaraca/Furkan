"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BOOKING_OFFER_OPTIONS } from "@/lib/booking-offer-options";
import { Button } from "@/components/ui/button";
import { PageBlockTitle } from "@/components/layout/PageShell";

export function BookingServiceOverview() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section aria-labelledby="booking-services">
      <PageBlockTitle
        sectionId="booking-services"
        title="Hizmet alanları"
        description="Türü seç; kısa özet görünsün. Teklif için aşağıdaki adıma geç veya doğrudan formdan ilet."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKING_OFFER_OPTIONS.map((o) => {
          const expanded = openId === o.id;
          return (
            <div
              key={o.id}
              className={cn(
                "rounded-2xl border bg-white/[0.03] text-left transition duration-300",
                expanded
                  ? "border-fuchsia-400/40 bg-white/[0.07] shadow-lg shadow-fuchsia-950/20"
                  : "border-white/10 hover:border-white/18 hover:bg-white/[0.05]",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(o.id)}
                className="w-full rounded-2xl p-4 text-left md:p-5"
                aria-expanded={expanded}
              >
                <span className="block font-semibold text-white">{o.title}</span>
                <span className="mt-1 block text-sm text-white/55">{o.subtitle}</span>
                <span className="mt-2 block text-xs text-white/45">{expanded ? "Detayı gizle" : "Kısa özet — tıkla"}</span>
              </button>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="space-y-3 px-4 pb-4 pt-2 md:px-5 md:pb-5">
                      <p className="text-sm leading-relaxed text-white/70">{o.summary}</p>
                      <p className="text-xs leading-relaxed text-white/55">{o.detail}</p>
                      <Button
                        asChild
                        size="sm"
                        className="w-full rounded-xl bg-white text-black hover:bg-white/90 sm:w-auto"
                      >
                        <Link href={`/booking?sec=${encodeURIComponent(o.id)}#teklif`} scroll>
                          Bu alan için teklif
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  ticketing?: { enabled: boolean; priceTry: number };
  /** Kulüp etkinliği — bilet için Noqta Club üyeliği gerekir */
  membersOnly?: boolean;
};

function eventImageAlt(e: EventItem): string {
  const place = [e.city, e.venue].filter(Boolean).join(", ");
  return `${e.title} etkinliği kapak görseli${place ? ` — ${place}` : ""}`;
}

export default function EventCard({ event }: { event: EventItem }) {
  const { isLoggedIn, club } = useAuth();
  const hasDate = Boolean(event.date);
  const date = hasDate ? new Date(event.date) : null;
  const isPast = hasDate && date && !Number.isNaN(date.getTime()) ? date.getTime() < Date.now() : false;
  const dateLabel =
    hasDate && date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : undefined;

  const cardLabel = `${event.title} etkinlik detayı${event.city ? ` — ${event.city}` : ""}${isPast ? " (arşiv)" : ""}`;
  const membersOnly = Boolean(event.membersOnly);
  const hasPaidTickets = Boolean(!isPast && event.ticketing?.enabled && event.ticketing.priceTry > 0);
  const canBuyTicket = hasPaidTickets && (!membersOnly || club?.fullMember);

  return (
    <article className="group w-full min-w-0 max-w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition duration-300 hover:bg-white/[0.09] hover:border-white/18">
      <Link href={`/events/${event.id}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/80" aria-label={cardLabel}>
        <div className="aspect-video relative w-full max-w-full bg-black overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={eventImageAlt(event)}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-white/40">no image</div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            {dateLabel ? (
              <div className="rounded-full bg-black/60 border border-white/20 px-3 py-1 text-xs text-white/90">
                {dateLabel}
              </div>
            ) : null}
            {event.membersOnly ? (
              <span className="rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
                Kulüp
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 min-w-0">
        <div className="min-w-0 flex-1 overflow-hidden">
          <Link href={`/events/${event.id}`} className="hover:underline underline-offset-4">
            <h3 className="line-clamp-2 break-words text-base font-medium text-white sm:text-lg">{event.title}</h3>
          </Link>
          <p className="mt-1 break-words text-sm text-white/60 [overflow-wrap:anywhere]">
            {event.city}
            {event.venue ? ` · ${event.venue}` : ""}
          </p>
        </div>
        {canBuyTicket ? (
          <Button asChild size="sm" className="h-8 px-3 rounded-full text-xs whitespace-nowrap shrink-0">
            <Link href={`/events/${event.id}/bilet`}>Bilet</Link>
          </Button>
        ) : hasPaidTickets && membersOnly ? (
          <Button asChild size="sm" variant="outline" className="h-8 px-3 rounded-full text-xs whitespace-nowrap shrink-0 border-amber-400/40 text-amber-100">
            <Link href={isLoggedIn ? "/account/club" : `/login?next=${encodeURIComponent(`/events/${event.id}/bilet`)}`}>
              Kulüp
            </Link>
          </Button>
        ) : event.ctaUrl && !isPast ? (
          <Button asChild size="sm" className="h-8 px-3 rounded-full text-xs whitespace-nowrap shrink-0">
            <Link href={event.ctaUrl}>Başvur</Link>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

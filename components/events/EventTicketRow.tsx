import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/components/EventCard";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

function eventImageAlt(e: EventItem): string {
  const place = [e.city, e.venue].filter(Boolean).join(", ");
  return `${e.title} etkinliği kapak görseli${place ? ` — ${place}` : ""}`;
}

function formatDateParts(iso: string): { day: string; mon: string; dow: string; time: string } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: d.toLocaleDateString("tr-TR", { day: "2-digit" }),
    mon: d.toLocaleDateString("tr-TR", { month: "short" }).replace(".", ""),
    dow: d.toLocaleDateString("tr-TR", { weekday: "short" }).replace(".", ""),
    time: d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function EventTicketRow({ event, archived }: { event: EventItem; archived?: boolean }) {
  const { isLoggedIn, club } = useAuth();
  const href = `/events/${event.id}`;
  const parts = event.date ? formatDateParts(event.date) : null;
  const hasTicketing = Boolean(event.ticketing?.enabled && event.ticketing && event.ticketing.priceTry > 0);
  const price = event.ticketing?.priceTry;
  const place = [event.venue, event.city].filter(Boolean).join(" · ") || event.city;
  const membersOnly = Boolean(event.membersOnly);
  const canBuyTicket = hasTicketing && (!membersOnly || club?.fullMember);

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-stretch sm:gap-0 sm:p-0",
        archived
          ? "border-border bg-muted/20 opacity-90 hover:border-foreground/15"
          : "border-border bg-card hover:border-noqt-lime hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-row gap-4 sm:w-[min(7.5rem,22%)] sm:flex-col sm:items-center sm:justify-center sm:gap-1 sm:border-r sm:px-3 sm:py-4",
          archived ? "sm:border-border/50" : "sm:border-border",
        )}
      >
        {parts ? (
          <>
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted px-3 py-2 text-center sm:bg-transparent sm:px-0 sm:py-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{parts.dow}</span>
              <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl">{parts.day}</span>
              <span className="text-xs font-medium uppercase tracking-wider text-noqt-lime-ink">{parts.mon}</span>
            </div>
            <p className="text-center text-[11px] tabular-nums text-muted-foreground sm:border-t sm:border-border sm:pt-2 sm:w-full">
              {parts.time}
            </p>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Tarih yakında
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:pl-5 sm:pr-4 sm:py-4">
        <Link href={href} className="group/title min-w-0 flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-noqt-lime/50 focus-visible:ring-offset-2 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="relative mt-0.5 block h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border sm:h-16 sm:w-24">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={eventImageAlt(event)}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-[10px] text-muted-foreground">—</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {archived ? (
                <span className="mb-1 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Arşiv
                </span>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-balance text-base font-semibold text-foreground transition group-hover/title:text-noqt-lime-ink sm:text-lg">
                  {event.title}
                </h3>
                {membersOnly ? (
                  <span className="shrink-0 rounded-md border border-amber-400/45 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                    Kulüp etkinliği
                  </span>
                ) : null}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
                <span className="truncate">{place}</span>
              </p>
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:flex-col sm:items-end sm:justify-center">
          {hasTicketing && price != null && !archived ? (
            <p className="w-full text-right text-xs text-muted-foreground sm:w-auto">
              <span className="text-foreground font-medium">₺{Number(price).toLocaleString("tr-TR")}</span>
              <span className="hidden sm:inline">&apos;den</span>
            </p>
          ) : null}
          <div className="flex w-full gap-2 sm:w-auto sm:flex-col-reverse">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 flex-1 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground sm:h-8 sm:flex-none sm:px-3"
            >
              <Link href={href} className="inline-flex items-center justify-center gap-1">
                Detay
                <ChevronRight className="size-3.5 opacity-60" aria-hidden />
              </Link>
            </Button>
            {!archived && hasTicketing && canBuyTicket ? (
              <Button asChild size="sm" className="h-9 flex-1 rounded-xl bg-foreground text-background hover:opacity-90 sm:h-8 sm:px-4">
                <Link href={`${href}/bilet`}>Bilet al</Link>
              </Button>
            ) : !archived && hasTicketing && membersOnly ? (
              <Button asChild size="sm" variant="outline" className="h-9 flex-1 rounded-xl border-amber-400/40 text-amber-800 hover:bg-amber-500/10 sm:h-8 sm:px-4">
                <Link href={isLoggedIn ? "/account/club" : `/login?next=${encodeURIComponent(`${href}/bilet`)}`}>
                  {isLoggedIn ? "Kulüp üyeliği" : "Giriş · kulüp"}
                </Link>
              </Button>
            ) : !archived && event.ctaUrl ? (
              <Button asChild size="sm" className="h-9 flex-1 rounded-xl bg-foreground text-background hover:opacity-90 sm:h-8 sm:px-4">
                <Link href={event.ctaUrl}>Başvur</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

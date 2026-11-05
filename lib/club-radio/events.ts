import { unstable_cache } from "next/cache";
import type { PublicEvent } from "@/lib/event-types";
import { readEventsJson } from "@/lib/server/events-store";

const TZ = "Europe/Istanbul";
const HOUR = 3600_000;

const getCachedEvents = unstable_cache(async () => readEventsJson(), ["club-radio-events"], { revalidate: 300 });

/** Yaklaşan etkinlikler (artan sıra). Okuma hatasında boş liste döner. */
export async function getUpcomingEvents(limit = 5): Promise<PublicEvent[]> {
  let all: PublicEvent[] = [];
  try {
    all = await getCachedEvents();
  } catch (e) {
    console.error("[club-radio] etkinlikler okunamadı", e);
    return [];
  }
  const now = Date.now();
  return all
    .filter((e) => e && typeof e.id === "string" && typeof e.title === "string" && e.date)
    .map((e) => {
      const start = Date.parse(e.date);
      const end = e.endDate ? Date.parse(e.endDate) : NaN;
      return { e, start, until: Number.isFinite(end) ? end : start + 12 * HOUR };
    })
    .filter((x) => Number.isFinite(x.start) && x.until >= now)
    .sort((a, b) => a.start - b.start)
    .slice(0, limit)
    .map((x) => x.e);
}

const part = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("tr-TR", { timeZone: TZ, ...opts }).format(d);
const upper = (s: string) => s.toLocaleUpperCase("tr-TR");

export function eventDateParts(iso: string) {
  const d = new Date(iso);
  const hasTime = /T\d{2}:\d{2}/.test(iso);
  return {
    day: part(d, { day: "numeric" }),
    monthShort: part(d, { month: "short" }).replace(".", ""),
    weekdayLong: part(d, { weekday: "long" }),
    rowLabel: `${upper(part(d, { month: "short" }).replace(".", ""))} · ${upper(part(d, { weekday: "short" }).replace(".", ""))}`,
    time: hasTime ? part(d, { hour: "2-digit", minute: "2-digit", hour12: false }) : "",
  };
}

export function eventLineupNames(e: PublicEvent): string {
  return (e.lineup ?? [])
    .map((l) => (l && typeof l.name === "string" ? l.name.trim() : ""))
    .filter(Boolean)
    .join(" · ");
}

export function eventHasTicket(e: PublicEvent): boolean {
  return Boolean(e.ticketing?.enabled);
}

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
};

export default function EventCard({ event }: { event: EventItem }) {
  const hasDate = Boolean((event as any).date);
  const date = hasDate ? new Date((event as any).date) : null as any;
  const isPast = hasDate ? date.getTime() < Date.now() : false;
  const dateLabel = hasDate
    ? date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : undefined;

  return (
    <div className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
      <div className="aspect-[16/9] relative bg-black">
        {event.image ? (
          <Image src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/40">no image</div>
        )}
        {dateLabel ? (
          <div className="absolute left-3 top-3 rounded-full bg-black/60 border border-white/20 px-3 py-1 text-xs text-white/90">{dateLabel}</div>
        ) : null}
        {event.ctaUrl && !isPast ? (
          <div className="absolute right-3 top-3">
            <Button asChild size="sm" className="h-7 px-3 rounded-full text-xs">
              <Link href={event.ctaUrl}>Başvur</Link>
            </Button>
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white">{event.title}</h3>
        <p className="text-white/60 text-sm mt-1">{event.city}{event.venue ? ` · ${event.venue}` : ""}</p>
      </div>
    </div>
  );
}

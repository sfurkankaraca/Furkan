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
  const date = new Date(event.date);
  const dateLabel = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return (
    <div className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="aspect-[16/9] relative bg-white/5">
        {event.image ? (
          <Image src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/40">no image</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-black/60 border border-white/20 px-3 py-1 text-xs text-white/90">{dateLabel}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white">{event.title}</h3>
        <p className="text-white/60 text-sm mt-1">{event.city}{event.venue ? ` · ${event.venue}` : ""}</p>
        <div className="mt-3 flex items-center gap-2">
          {event.ctaUrl ? (
            <Button asChild size="sm" className="rounded-xl">
              <Link href={event.ctaUrl} target="_blank" rel="noopener noreferrer">Detay / RSVP</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

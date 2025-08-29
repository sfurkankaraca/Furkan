import Link from "next/link";
import { Button } from "@/components/ui/button";
import DotRing from "@/components/DotRing";
import fs from "node:fs/promises";
import path from "node:path";
import EventCard, { EventItem } from "@/components/EventCard";

async function getEvents(): Promise<EventItem[]> {
  const file = path.join(process.cwd(), "data", "events.json");
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export default async function Home() {
  const now = Date.now();
  const events = (await getEvents())
    .filter((e) => {
      const t = new Date(e.date).getTime();
      return !Number.isNaN(t) && t >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">noqta.</h1>
            <p className="mt-4 text-lg text-white/70 max-w-prose">lost in loops. together, we listen.</p>
            <div className="mt-8 flex gap-3">
              <Button asChild className="rounded-xl">
                <Link href="/events">Events</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/join">Kaybol</Link>
              </Button>
            </div>
          </div>
          <div className="grid place-items-center">
            <DotRing size={260} />
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <p className="text-white/70">quiet energy. deep rhythm. we experiment, we share.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { href: "/events", title: "Events", desc: "What’s next" },
              { href: "/collective", title: "Collective", desc: "Why we gather" },
              { href: "/labs", title: "Labs", desc: "Small experiments" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition block"
              >
                <div className="text-xl font-medium">{c.title}</div>
                <div className="text-white/60 mt-1">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-white">Upcoming Events</h2>
            <Link href="/events" className="text-sm text-white/70 hover:text-white">See all</Link>
          </div>
          {events.length === 0 ? (
            <p className="text-white/60">No events yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

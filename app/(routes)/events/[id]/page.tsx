import { readEvents, type AdminEvent } from "@/lib/events";
import Image from "next/image";

export async function generateStaticParams() {
  const events = await readEvents();
  return events.map((e) => ({ id: e.id }));
}

export default async function EventDetail({ params }: { params: { id: string } }) {
  const events = await readEvents();
  const event = events.find((e) => e.id === params.id) as AdminEvent | undefined;
  if (!event) return <div className="container mx-auto max-w-7xl px-4 py-10">Etkinlik bulunamadı.</div>;
  const date = new Date(event.date);
  const dateLabel = date.toLocaleString();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 grid gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">{event.title}</h1>
        <p className="text-white/60 text-sm mt-1">{dateLabel} · {event.city}{event.venue ? ` · ${event.venue}` : ""}</p>
      </div>

      {event.image ? (
        <div className="aspect-[16/9] relative rounded-2xl overflow-hidden border border-white/10">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        </div>
      ) : null}

      {event.photos && event.photos.length ? (
        <section className="grid gap-3">
          <h2 className="text-xl font-medium">Fotoğraflar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.photos.map((p, i) => (
              <figure key={i} className="aspect-[4/3] relative rounded-xl overflow-hidden border border-white/10">
                <Image src={p.url} alt={p.title || `${event.title} photo ${i + 1}`} fill className="object-cover" />
                {(p.title || p.description) ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-2">
                    {p.title ? <div className="font-medium">{p.title}</div> : null}
                    {p.description ? <div className="text-white/80">{p.description}</div> : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {event.memberPhotos && event.memberPhotos.length ? (
        <section className="grid gap-3">
          <h2 className="text-xl font-medium">Üyelerden Fotoğraflar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.memberPhotos.map((p, i) => (
              <figure key={i} className="aspect-[4/3] relative rounded-xl overflow-hidden border border-white/10">
                <Image src={p.url} alt={p.title || `${event.title} member photo ${i + 1}`} fill className="object-cover" />
                {(p.title || p.description) ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-2">
                    {p.title ? <div className="font-medium">{p.title}</div> : null}
                    {p.description ? <div className="text-white/80">{p.description}</div> : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {event.playlists && event.playlists.length ? (
        <section className="grid gap-3">
          <h2 className="text-xl font-medium">Playlistler</h2>
          <div className="grid gap-6">
            {event.playlists.map((pl, i) => (
              <article key={i} className="grid gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  {pl.avatarUrl ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
                      <Image src={pl.avatarUrl} alt={pl.djName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full border border-white/20 grid place-items-center text-xs text-white/60">DJ</div>
                  )}
                  <div>
                    <div className="font-medium">{pl.djName}</div>
                    {pl.description ? <div className="text-white/70 text-sm">{pl.description}</div> : null}
                  </div>
                </div>
                <div className="w-full">
                  <iframe src={pl.spotifyEmbedUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

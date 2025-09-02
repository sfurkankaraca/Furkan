"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/useI18n";

export default function EventDetail({ params }: { params: { id: string } }) {
  const { isLoggedIn } = useAuth();
  const { locale } = useI18n();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events', { cache: 'no-store' });
        if (response.ok) {
          const events = await response.json();
          const foundEvent = events.find((e: any) => e.id === params.id);
          if (foundEvent) setEvent(foundEvent);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (lightboxIdx === null || !event?.photos?.length) return;
    if (e.key === 'Escape') setLightboxIdx(null);
    if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? 0 : (i + 1) % event.photos.length));
    if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i === null ? 0 : (i - 1 + event.photos.length) % event.photos.length));
  }, [lightboxIdx, event?.photos]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  if (loading) return <div className="container mx-auto max-w-7xl px-4 py-10">Yükleniyor...</div>;
  if (!event) return <div className="container mx-auto max-w-7xl px-4 py-10">Etkinlik bulunamadı.</div>;

  const date = new Date(event.date);
  const now = new Date();
  const isPastEvent = date < now;
  const dateLabel = date.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const photos: any[] = event.photos || [];

  async function submitMemberPhoto(formData: FormData) {
    const file = (formData.get('file') as File) || null;
    const note = String(formData.get('note') || '').trim();
    if (!file) { alert(locale==='en'?'Photo required':'Fotoğraf zorunlu'); return; }
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/blob/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      const updateRes = await fetch('/api/events/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId: event.id, memberPhotosAdd: [{ url, description: note }] }) });
      if (!updateRes.ok) throw new Error('Update failed');
      const updated = await updateRes.json();
      setEvent(updated.updatedEvents.find((e: any) => e.id === event.id));
      setShowMemoryForm(false);
    } catch (err: any) { alert(err?.message || 'Error'); }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 grid gap-6">
      {/* Üst: tek kart, arkaplanda kapak ve overlay bilgi kutusu */}
      {event.image ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <div className="relative h-64 md:h-96">
            <Image src={event.image} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{event.title}</h1>
                  <div className="text-white/80 text-sm mt-1">{dateLabel} · {event.city}{event.venue ? ` · ${event.venue}` : ""}</div>
                </div>
                {!isPastEvent ? (
                  <a href={event.ctaUrl || "/events/apply"} className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
                    <span className="px-4 py-2 rounded-full bg-black text-white text-sm">{locale==='en'?'RSVP':'Etkinliğe Başvur'}</span>
                  </a>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-white/10 text-white/70">{locale==='en'?'Past Event':'Geçmiş Etkinlik'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Alt bölüm: iki sütun kart, solda foto, sağda playlist */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{locale==='en'?'Photos':'Fotoğraflar'}</h2>
            {photos.length > 8 && <span className="text-xs text-white/50">{photos.length} {locale==='en'?'photos':'fotoğraf'}</span>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(photos.slice(0, 9)).map((p, i) => (
              <button key={i} onClick={() => setLightboxIdx(i)} className="aspect-square relative rounded-xl overflow-hidden border border-white/10 group">
                <Image src={p.url} alt={`photo ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-3">
          <h2 className="text-xl font-medium">DJ {locale==='en'?'Playlists':'Playlistleri'}</h2>
          <div className="grid gap-4">
            {event.playlists?.map((pl: any, i: number) => (
              <article key={i} className="grid gap-3 p-3 rounded-xl border border-white/10 bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
                    {pl.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pl.avatarUrl} alt={pl.djName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-[10px] text-white/60">DJ</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{pl.djName}</div>
                    {pl.description ? <div className="text-white/70 text-xs">{pl.description}</div> : null}
                  </div>
                </div>
                <iframe src={pl.spotifyEmbedUrl} width="100%" height="132" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Anı Bırak */}
      {isLoggedIn && (
        <div className="grid place-items-center pt-2">
          {!showMemoryForm ? (
            <button onClick={() => setShowMemoryForm(true)} className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
              <span className="px-4 py-2 rounded-full bg-black text-white text-sm">{locale==='en'?'Leave a memory':'Anı Bırak'}</span>
            </button>
          ) : (
            <form action={submitMemberPhoto as any} className="w-full max-w-md grid gap-2 rounded-xl border border-white/10 p-3">
              <div className="text-sm text-white/80">{locale==='en'?'Upload a photo (required), note (optional)':'Fotoğraf yükle (zorunlu), not (opsiyonel)'}</div>
              <input name="file" type="file" accept="image/*" required className="text-sm" />
              <textarea name="note" rows={2} placeholder={locale==='en'?'Note (optional)':'Not (opsiyonel)'} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white text-sm" />
              <div className="flex gap-2">
                <button className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">{locale==='en'?'Submit':'Gönder'}</button>
                <button type="button" onClick={() => setShowMemoryForm(false)} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm">{locale==='en'?'Cancel':'Vazgeç'}</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-4" onClick={() => setLightboxIdx(null)}>
          <div className="relative max-w-5xl w-full grid place-items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[lightboxIdx].url} alt="photo" className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl border border-white/10" />
            <button onClick={() => setLightboxIdx(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black grid place-items-center text-sm">×</button>
            {photos.length > 1 && (
              <>
                <button onClick={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-black grid place-items-center">‹</button>
                <button onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-black grid place-items-center">›</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

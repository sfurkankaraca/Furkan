"use client";

import { redirect } from "next/navigation";
import PhotoListEditor from "@/components/PhotoListEditor";
import PlaylistListEditor from "@/components/PlaylistListEditor";
import UploadWidget from "@/components/UploadWidget";
import { updateEvent, deleteEvent } from "../../actions";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

function parseNestedList<T extends Record<string, unknown>>(formData: FormData, prefix: string): T[] {
  const map = new Map<number, T>();
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(prefix + "[")) continue;
    const idxStart = prefix.length + 1;
    const idxEnd = key.indexOf("]", idxStart);
    if (idxEnd === -1) continue;
    const idx = Number(key.slice(idxStart, idxEnd));
    const fieldStart = key.indexOf("[", idxEnd + 1);
    const fieldEnd = key.indexOf("]", fieldStart + 1);
    if (fieldStart === -1 || fieldEnd === -1) continue;
    const field = key.slice(fieldStart + 1, fieldEnd);
    const existing = (map.get(idx) || {}) as T;
    (existing as any)[field] = String(value);
    map.set(idx, existing);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export default function AdminEditEvent({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event from API
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const events = await response.json();
          const foundEvent = events.find((e: any) => e.id === params.id);
          if (foundEvent) {
            setEvent(foundEvent);
            setCurrentImage(foundEvent.image || "");
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Listen for image updates
    const handleImageUpdate = (e: CustomEvent) => {
      if (e.detail.eventId === params.id) {
        setCurrentImage(e.detail.newImage);
        console.log("Image updated in real-time:", e.detail.newImage);
      }
    };

    window.addEventListener('eventImageUpdated', handleImageUpdate as EventListener);

    return () => {
      window.removeEventListener('eventImageUpdated', handleImageUpdate as EventListener);
    };
  }, [params.id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!event) return <div>Etkinlik bulunamadı.</div>;

  async function action(formData: FormData) {
    formData.set("eventId", event.id);
    return updateEvent(formData);
  }

  return (
    <form action={action} className="grid gap-4 max-w-xl">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm text-white/80">Başlık</label>
        <input id="title" name="title" defaultValue={event.title} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="text-sm text-white/80">Tarih</label>
        <input id="date" name="date" type="datetime-local" defaultValue={event.date.slice(0,16)} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="city" className="text-sm text-white/80">Şehir</label>
        <input id="city" name="city" defaultValue={event.city} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="venue" className="text-sm text-white/80">Mekan</label>
        <input id="venue" name="venue" defaultValue={event.venue} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="ctaUrl" className="text-sm text-white/80">CTA URL</label>
        <input id="ctaUrl" name="ctaUrl" defaultValue={event.ctaUrl} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <span className="text-sm text-white/80">Kapak Görseli</span>
        {/* URL alanını göstermiyoruz; UploadWidget seçilen dosyayı Vercel Blob'a yükler ve bu gizli input'a URL'i yazar */}
        <input id="image" name="image" type="hidden" value={currentImage} />
        <UploadWidget 
          targetInputId="image" 
          onUploadComplete={(url) => setCurrentImage(url)}
          eventId={event?.id || params.id}
        />
        
        {/* Mevcut fotoğrafı göster */}
        {currentImage && (
          <div className="mt-2">
            <span className="text-xs text-white/60 block mb-2">Kapak görseli:</span>
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/20">
              <img 
                src={currentImage} 
                alt="Kapak görseli" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/80">Fotoğraflar</div>
        <PhotoListEditor name="photos" initial={event.photos} max={20} />
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/80">DJ Playlistleri</div>
        <PlaylistListEditor name="playlists" initial={event.playlists} max={20} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Kaydet</button>
        <form action={async (formData: FormData) => {
          formData.set("eventId", event.id);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          deleteEvent(formData);
        }}>
          <input type="hidden" name="eventId" value={event.id} />
          <button type="submit" className="rounded-xl bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600">Sil</button>
        </form>
      </div>
    </form>
  );
}

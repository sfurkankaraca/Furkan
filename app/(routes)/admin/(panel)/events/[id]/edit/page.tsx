"use client";

import LineupListEditor from "@/components/LineupListEditor";
import PhotoListEditor from "@/components/PhotoListEditor";
import PlaylistListEditor from "@/components/PlaylistListEditor";
import UploadWidget from "@/components/UploadWidget";
import { updateEvent, deleteEvent } from "../../actions";
import { useState, useEffect } from "react";
import { ContentCard } from "@/components/layout/PageShell";

export const dynamic = "force-dynamic";

export default function AdminEditEvent({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event from API
    const fetchEvent = async () => {
      try {
        const response = await fetch("/api/admin/events", { credentials: "include", cache: "no-store" });
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
    <ContentCard className="bg-white p-6 md:p-8 max-w-3xl mx-auto">
      <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm text-foreground/80">Başlık</label>
        <input id="title" name="title" defaultValue={event.title} className="rounded-xl bg-background border border-border px-3 py-2 text-white placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="text-sm text-foreground/80">Tarih</label>
        <input id="date" name="date" type="datetime-local" defaultValue={event.date.slice(0,16)} className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="city" className="text-sm text-foreground/80">Şehir</label>
        <input id="city" name="city" defaultValue={event.city} className="rounded-xl bg-background border border-border px-3 py-2 text-white placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="venue" className="text-sm text-foreground/80">Mekan</label>
        <input id="venue" name="venue" defaultValue={event.venue} className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <fieldset className="grid gap-3 rounded-xl border border-fuchsia-500/25 p-4">
        <legend className="text-sm text-fuchsia-700/90 px-1">Etkinlik sayfası (detay / BUGECE tarzı)</legend>
        <div className="grid gap-2">
          <label htmlFor="subtitle" className="text-sm text-foreground/70">Alt başlık</label>
          <input id="subtitle" name="subtitle" defaultValue={event.subtitle ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="endDate" className="text-sm text-foreground/70">Bitiş tarihi (çok günlük ise)</label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={event.endDate ? event.endDate.slice(0, 16) : ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm text-foreground/70">Giriş metni / uzun açıklama</label>
          <textarea id="description" name="description" rows={8} defaultValue={event.description ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="genres" className="text-sm text-foreground/70">Türler (virgül veya satır)</label>
          <textarea id="genres" name="genres" rows={3} defaultValue={(event.genres || []).join("\n")} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
        </div>
        <div className="grid gap-2">
          <div className="text-sm text-foreground/70">Line-up</div>
          <LineupListEditor name="lineup" initial={event.lineup} />
        </div>
        <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
          <div className="grid gap-2 sm:col-span-3">
            <label htmlFor="organizerName" className="text-sm text-foreground/70">Organizatör adı</label>
            <input id="organizerName" name="organizerName" defaultValue={event.organizer?.name ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="organizerImage" className="text-sm text-foreground/70">Organizatör görsel URL</label>
            <input id="organizerImage" name="organizerImage" defaultValue={event.organizer?.imageUrl ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid gap-2 sm:col-span-3">
            <label htmlFor="organizerUrl" className="text-sm text-foreground/70">Organizatör link</label>
            <input id="organizerUrl" name="organizerUrl" defaultValue={event.organizer?.href ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="venueAddress" className="text-sm text-foreground/70">Mekan adresi (tam)</label>
          <textarea id="venueAddress" name="venueAddress" rows={2} defaultValue={event.venueAddress ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="venueMapQuery" className="text-sm text-foreground/70">Harita arama</label>
          <input id="venueMapQuery" name="venueMapQuery" defaultValue={event.venueMapQuery ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="rules" className="text-sm text-foreground/70">Kurallar</label>
          <textarea id="rules" name="rules" rows={10} defaultValue={event.rules ?? ""} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm font-mono text-xs" />
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="ctaUrl" className="text-sm text-foreground/80">CTA URL</label>
        <input id="ctaUrl" name="ctaUrl" defaultValue={event.ctaUrl} className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <span className="text-sm text-foreground/80">Kapak Görseli</span>
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
            <span className="text-xs text-muted-foreground block mb-2">Kapak görseli:</span>
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border">
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
        <div className="text-sm text-foreground/80">Fotoğraflar</div>
        <PhotoListEditor name="photos" initial={event.photos} max={100} />
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-foreground/80">DJ Playlistleri</div>
        <PlaylistListEditor name="playlists" initial={event.playlists} max={20} />
      </div>

      <fieldset className="grid gap-3 rounded-xl border border-fuchsia-500/20 p-4">
        <legend className="text-sm text-fuchsia-700/90 px-1">Noqta Club</legend>
        <label className="flex items-start gap-2 text-sm text-white/85">
          <input
            type="checkbox"
            name="membersOnly"
            defaultChecked={!!event.membersOnly}
            className="mt-1 rounded border-white/30"
          />
          <span>Sadece aktif kulüp aboneleri (genel listede gizli)</span>
        </label>
      </fieldset>

      <fieldset className="grid gap-3 rounded-xl border border-border p-4">
        <legend className="text-sm text-foreground/80 px-1">Bilet satışı (İyzico)</legend>
        <label className="flex items-center gap-2 text-sm text-white/90">
          <input type="checkbox" name="ticketingEnabled" defaultChecked={!!event.ticketing?.enabled} className="rounded border-white/30" />
          Çevrimiçi bilet sat
        </label>
        <div className="grid gap-2">
          <label htmlFor="ticketingPrice" className="text-sm text-foreground/70">Birim fiyat (TRY)</label>
          <input
            id="ticketingPrice"
            name="ticketingPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={event.ticketing?.priceTry ?? ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="ticketingMaxPerOrder" className="text-sm text-foreground/70">Sipariş başına max adet</label>
          <input
            id="ticketingMaxPerOrder"
            name="ticketingMaxPerOrder"
            type="number"
            min="1"
            defaultValue={event.ticketing?.maxPerOrder ?? ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="ticketingTotalCap" className="text-sm text-foreground/70">Toplam kontenjan</label>
          <input
            id="ticketingTotalCap"
            name="ticketingTotalCap"
            type="number"
            min="1"
            defaultValue={event.ticketing?.totalCap ?? ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="ticketingNote" className="text-sm text-foreground/70">Bilet notu</label>
          <input
            id="ticketingNote"
            name="ticketingNote"
            defaultValue={event.ticketing?.note ?? ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white"
          />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-white/90">Kaydet</button>
        <form
          method="post"
          onSubmit={async (ev) => {
            if (!confirm("Bu etkinliği silmek istediğine emin misin?")) {
              ev.preventDefault();
            } else {
              const formData = new FormData(ev.currentTarget);
              const result = await deleteEvent(formData);
              if (!result.ok) {
                alert("Hata: " + result.error);
                ev.preventDefault();
              }
            }
          }}
        >
          <input type="hidden" name="eventId" value={event.id} />
          <button type="submit" className="rounded-xl bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600">Sil</button>
        </form>
      </div>
      </form>
    </ContentCard>
  );
}

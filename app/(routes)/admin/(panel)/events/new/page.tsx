import LineupListEditor from "@/components/LineupListEditor";
import PhotoListEditor from "@/components/PhotoListEditor";
import PlaylistListEditor from "@/components/PlaylistListEditor";
import UploadWidget from "@/components/UploadWidget";
import { createEvent } from "../actions";
import { ContentCard } from "@/components/layout/PageShell";

export const metadata = { title: "Admin — Yeni Etkinlik | noqta" };
export const dynamic = "force-dynamic";

export default function AdminNewEventPage() {

  return (
    <ContentCard className="bg-white p-6 md:p-8 max-w-3xl mx-auto">
      <form action={createEvent} className="grid gap-4" encType="multipart/form-data">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm text-foreground/80">Başlık *</label>
          <input id="title" name="title" required className="rounded-xl bg-background border border-border px-3 py-2 text-white placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-white/30" placeholder="Etkinlik adı" />
        </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="text-sm text-foreground/80">Tarih *</label>
        <input id="date" name="date" type="datetime-local" required className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="city" className="text-sm text-foreground/80">Şehir *</label>
        <input id="city" name="city" required className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="Şehir" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="venue" className="text-sm text-foreground/80">Mekan</label>
        <input id="venue" name="venue" className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="Mekan" />
      </div>

      <fieldset className="grid gap-3 rounded-xl border border-fuchsia-500/25 p-4">
        <legend className="text-sm text-fuchsia-700/90 px-1">Etkinlik sayfası (detay / BUGECE tarzı)</legend>
        <div className="grid gap-2">
          <label htmlFor="subtitle" className="text-sm text-foreground/70">Alt başlık</label>
          <input id="subtitle" name="subtitle" className="rounded-xl bg-background border border-border px-3 py-2 text-white" placeholder="Kısa özet satırı" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="endDate" className="text-sm text-foreground/70">Bitiş tarihi (çok günlük ise)</label>
          <input id="endDate" name="endDate" type="datetime-local" className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm text-foreground/70">Giriş metni / uzun açıklama</label>
          <textarea id="description" name="description" rows={8} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" placeholder="Paragraflar; satır sonları korunur." />
        </div>
        <div className="grid gap-2">
          <label htmlFor="genres" className="text-sm text-foreground/70">Türler (virgül veya satır)</label>
          <textarea id="genres" name="genres" rows={2} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" placeholder={"Techno\nHouse"} />
        </div>
        <div className="grid gap-2">
          <div className="text-sm text-foreground/70">Line-up</div>
          <LineupListEditor name="lineup" />
        </div>
        <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
          <div className="grid gap-2 sm:col-span-3">
            <label htmlFor="organizerName" className="text-sm text-foreground/70">Organizatör adı</label>
            <input id="organizerName" name="organizerName" className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="organizerImage" className="text-sm text-foreground/70">Organizatör görsel URL</label>
            <input id="organizerImage" name="organizerImage" className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid gap-2 sm:col-span-3">
            <label htmlFor="organizerUrl" className="text-sm text-foreground/70">Organizatör link</label>
            <input id="organizerUrl" name="organizerUrl" className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="venueAddress" className="text-sm text-foreground/70">Mekan adresi (tam)</label>
          <textarea id="venueAddress" name="venueAddress" rows={2} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="venueMapQuery" className="text-sm text-foreground/70">Harita arama (boşsa adres/mekan kullanılır)</label>
          <input id="venueMapQuery" name="venueMapQuery" className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm" placeholder="Zorlu PSM İstanbul" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="rules" className="text-sm text-foreground/70">Kurallar (her satır bir madde; tire ile başlayabilir)</label>
          <textarea id="rules" name="rules" rows={10} className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm font-mono text-xs" placeholder={"- Kapı açılış 17:00\n- 18 yaş altı..."} />
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="ctaUrl" className="text-sm text-foreground/80">CTA URL</label>
        <input id="ctaUrl" name="ctaUrl" className="rounded-xl bg-background border border-border px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="https://... (boş bırakılırsa /events/apply)" />
      </div>

      <div className="grid gap-2">
        <span className="text-sm text-foreground/80">Kapak Görseli</span>
        {/* URL alanını gizli tut, sadece yükle butonu göster */}
        <input id="image" name="image" type="hidden" />
        <UploadWidget targetInputId="image" />
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-foreground/80">Fotoğraflar</div>
        <PhotoListEditor name="photos" max={100} />
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-foreground/80">DJ Playlistleri</div>
        <PlaylistListEditor name="playlists" max={20} />
      </div>

      <fieldset className="grid gap-3 rounded-xl border border-fuchsia-500/20 p-4">
        <legend className="text-sm text-fuchsia-700/90 px-1">Noqta Club</legend>
        <label className="flex items-start gap-2 text-sm text-white/85">
          <input type="checkbox" name="membersOnly" className="mt-1 rounded border-white/30" />
          <span>
            Sadece onaylı başvuru + aktif kulüp aboneliği olanlar görsün (genel /events listesinde çıkmaz; üye panelinde listelenir).
          </span>
        </label>
      </fieldset>

      <fieldset className="grid gap-3 rounded-xl border border-border p-4">
        <legend className="text-sm text-foreground/80 px-1">Bilet satışı (İyzico)</legend>
        <label className="flex items-center gap-2 text-sm text-white/90">
          <input type="checkbox" name="ticketingEnabled" className="rounded border-white/30" />
          Çevrimiçi bilet sat
        </label>
        <div className="grid gap-2">
          <label htmlFor="ticketingPrice" className="text-sm text-foreground/70">Birim fiyat (TRY)</label>
          <input id="ticketingPrice" name="ticketingPrice" type="number" min="0" step="0.01" className="rounded-xl bg-background border border-border px-3 py-2 text-white" placeholder="örn. 350" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="ticketingMaxPerOrder" className="text-sm text-foreground/70">Sipariş başına max adet (boş = 8)</label>
          <input id="ticketingMaxPerOrder" name="ticketingMaxPerOrder" type="number" min="1" className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="ticketingTotalCap" className="text-sm text-foreground/70">Toplam kontenjan (opsiyonel)</label>
          <input id="ticketingTotalCap" name="ticketingTotalCap" type="number" min="1" className="rounded-xl bg-background border border-border px-3 py-2 text-white" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="ticketingNote" className="text-sm text-foreground/70">Bilet notu (opsiyonel)</label>
          <input id="ticketingNote" name="ticketingNote" className="rounded-xl bg-background border border-border px-3 py-2 text-white" placeholder="Dahil olanlar, giriş saati..." />
        </div>
      </fieldset>

        <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-white/90">Kaydet</button>
      </form>
    </ContentCard>
  );
}

"use client";

import UploadWidget from "@/components/UploadWidget";
import { PLAYLIST_CATEGORY_SUGGESTIONS } from "@/lib/playlist-categories";
import type { PlaylistRow } from "@/lib/playlists";

type Props = {
  action: (formData: FormData) => void;
  playlist?: PlaylistRow | null;
};

export default function AdminPlaylistForm({ action, playlist }: Props) {
  const datalistId = "playlist-categories";
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      {playlist ? <input type="hidden" name="id" value={playlist.id} /> : null}

      <div className="grid gap-2">
        <label htmlFor="pl-title" className="text-sm text-white/80">
          Başlık *
        </label>
        <input
          id="pl-title"
          name="title"
          required
          defaultValue={playlist?.title}
          className="rounded-xl border border-white/20 bg-black px-3 py-2 text-white outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/30"
          placeholder="Playlist adı"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="pl-spotify" className="text-sm text-white/80">
          Spotify URL *
        </label>
        <input
          id="pl-spotify"
          name="spotifyUrl"
          type="url"
          required
          defaultValue={playlist?.spotifyUrl}
          className="rounded-xl border border-white/20 bg-black px-3 py-2 text-white outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/30"
          placeholder="https://open.spotify.com/playlist/..."
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="pl-category" className="text-sm text-white/80">
          Tür / kategori *
        </label>
        <input
          id="pl-category"
          name="category"
          required
          list={datalistId}
          defaultValue={playlist?.category}
          className="rounded-xl border border-white/20 bg-black px-3 py-2 text-white outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/30"
          placeholder="örn. Tech House"
        />
        <datalist id={datalistId}>
          {PLAYLIST_CATEGORY_SUGGESTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="grid gap-2">
        <label htmlFor="pl-cover" className="text-sm text-white/80">
          Kapak görseli (URL) *
        </label>
        <input
          id="pl-cover"
          name="coverImage"
          required
          defaultValue={playlist?.coverImage}
          className="rounded-xl border border-white/20 bg-black px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/30"
          placeholder="https://... veya alttan yükle"
        />
        <UploadWidget targetInputId="pl-cover" />
        <p className="text-xs text-zinc-500">Dosya yüklerseniz URL alanı otomatik dolar.</p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-white/90">
          <input type="checkbox" name="featured" defaultChecked={playlist?.featured} className="rounded border-white/30" />
          Öne çıkan
        </label>
        <div className="grid gap-1">
          <label htmlFor="pl-sort" className="text-xs text-white/60">
            Sıra (küçük önce)
          </label>
          <input
            id="pl-sort"
            name="sortOrder"
            type="number"
            defaultValue={playlist?.sortOrder ?? 0}
            className="w-28 rounded-xl border border-white/20 bg-black px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <button type="submit" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white/90">
          {playlist ? "Güncelle" : "Oluştur"}
        </button>
      </div>
    </form>
  );
}

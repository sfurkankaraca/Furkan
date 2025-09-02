"use client";

import { useRef, useState } from "react";

export type PlaylistItem = { 
  djName: string; 
  description?: string; 
  avatarUrl?: string; 
  spotifyEmbedUrl: string 
};

function toSpotifyEmbedUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  // If iframe code pasted, extract src
  if (trimmed.startsWith("<iframe")) {
    const match = trimmed.match(/src=\"([^\"]+)\"/i);
    if (match && match[1]) return match[1];
  }
  // Convert regular open.spotify.com URLs to embed
  return trimmed.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export default function PlaylistListEditor({ 
  name, 
  initial, 
  max = 20 
}: { 
  name: string; 
  initial?: PlaylistItem[]; 
  max?: number 
}) {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(initial || []);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function addPlaylist() {
    if (playlists.length >= max) {
      alert(`Maksimum ${max} playlist`);
      return;
    }
    setPlaylists([...playlists, {
      djName: "",
      description: "",
      avatarUrl: "",
      spotifyEmbedUrl: ""
    }]);
  }

  function removePlaylist(index: number) {
    setPlaylists(playlists.filter((_, i) => i !== index));
  }

  function updatePlaylist(index: number, field: keyof PlaylistItem, value: string) {
    const updated = [...playlists];
    updated[index] = { ...updated[index], [field]: value };
    setPlaylists(updated);
  }

  async function onAvatarChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/blob/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Upload failed ${res.status}`);
      const { url } = await res.json();
      updatePlaylist(index, 'avatarUrl', url);
      e.target.value = '';
    } catch (err: any) {
      alert(err?.message || 'Yükleme hatası');
    }
  }

  return (
    <div className="grid gap-3">
      {/* Hidden inputs for form submission */}
      {playlists.map((playlist, idx) => (
        <div key={`hidden-${idx}`}>
          <input type="hidden" name={`${name}[${idx}][djName]`} value={playlist.djName} />
          <input type="hidden" name={`${name}[${idx}][description]`} value={playlist.description || ""} />
          <input type="hidden" name={`${name}[${idx}][avatarUrl]`} value={playlist.avatarUrl || ""} />
          <input type="hidden" name={`${name}[${idx}][spotifyEmbedUrl]`} value={playlist.spotifyEmbedUrl} />
        </div>
      ))}
      
      {/* Playlist items */}
      {playlists.map((playlist, idx) => (
        <div key={idx} className="grid gap-2 border border-white/10 rounded-xl p-3 relative">
          <button
            type="button"
            onClick={() => removePlaylist(idx)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
            title="Playlist'i kaldır"
          >
            ×
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/20 bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {playlist.avatarUrl ? <img src={playlist.avatarUrl} alt="avatar" className="h-full w-full object-cover" /> : (
                <div className="h-full w-full grid place-items-center text-xs text-white/50">DJ</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input 
                ref={(el) => fileRefs.current[idx] = el}
                type="file" accept="image/*" className="hidden"
                onChange={(e) => onAvatarChange(idx, e)}
              />
              <button
                type="button"
                onClick={() => fileRefs.current[idx]?.click()}
                className="rounded-xl bg-white text-black px-3 py-1.5 text-sm hover:bg-white/90"
              >
                Avatar Yükle
              </button>
            </div>
          </div>

          <input 
            name={`${name}[${idx}][djName]`} 
            value={playlist.djName}
            onChange={(e) => updatePlaylist(idx, 'djName', e.target.value)}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white pr-10" 
            placeholder="DJ adı (başlık)" 
          />
          <textarea 
            name={`${name}[${idx}][description]`} 
            value={playlist.description || ""}
            onChange={(e) => updatePlaylist(idx, 'description', e.target.value)}
            rows={2} 
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" 
            placeholder="Açıklama" 
          />
          <input 
            name={`${name}[${idx}][spotifyEmbedUrl]`} 
            value={playlist.spotifyEmbedUrl}
            onChange={(e) => updatePlaylist(idx, 'spotifyEmbedUrl', toSpotifyEmbedUrl(e.target.value))}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" 
            placeholder="Spotify iframe kodu veya URL (otomatik embed)" 
          />
        </div>
      ))}
      
      {/* Add button */}
      {playlists.length < max && (
        <button 
          type="button" 
          className="rounded-xl bg-white text-black px-3 py-1.5 text-sm hover:bg-white/90" 
          onClick={addPlaylist}
        >
          Playlist ekle
        </button>
      )}
      
      {playlists.length === 0 && (
        <p className="text-sm text-white/50 text-center py-4">
          Henüz playlist yok. Eklemek için butona tıkla.
        </p>
      )}
    </div>
  );
}

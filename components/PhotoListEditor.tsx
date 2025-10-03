"use client";

import { useState } from "react";
import Image from "next/image";

export type PhotoItem = { url: string };

export default function PhotoListEditor({
  name,
  initial,
  max = 20,
}: {
  name: string;
  initial?: PhotoItem[];
  max?: number;
}) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initial || []);

  function addPhoto(url: string) {
    setPhotos(prev => {
      const next = [...prev, { url }];
      if (next.length > max) return next.slice(0, max);
      return next;
    });
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.target;
    const files = Array.from(inputEl.files || []);
    if (files.length === 0) return;
    
    for (const file of files) {
      try {
        let url = "";
        try {
          const gen = await fetch('/api/upload-url', { cache: 'no-store' });
          if (!gen.ok) throw new Error(`Upload URL alınamadı (${gen.status})`);
          const { url: uploadUrl } = await gen.json();
          const up = await fetch(uploadUrl, { method: 'POST', body: file });
          if (!up.ok) throw new Error(`Upload başarısız (${up.status})`);
          const json = await up.json();
          url = json.url;
        } catch (directErr) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/blob/upload', { method: 'POST', body: formData });
          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.error || `Upload hata (${res.status})`);
          }
          const j = await res.json();
          url = j.url;
        }
        if (url) addPhoto(url);
      } catch (err: any) {
        alert(err?.message || "Yükleme hatası");
        break;
      }
    }
    // Güvenli şekilde input'u temizle
    if (inputEl) {
      inputEl.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      {/* Hidden inputs for form submission */}
      {photos.map((photo, idx) => (
        <input key={idx} type="hidden" name={`${name}[${idx}][url]`} value={photo.url} />
      ))}
      
      {/* Photo grid display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, idx) => (
          <div key={idx} className="relative group">
            <div className="aspect-square relative rounded-lg overflow-hidden border border-white/20">
              <Image 
                src={photo.url} 
                alt={`Photo ${idx + 1}`} 
                fill 
                className="object-cover"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                title="Fotoğrafı kaldır"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Upload section */}
      {photos.length < max && (
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={onFilesSelected} 
            className="text-sm" 
          />
          <span className="text-xs text-white/50">
            Topluca seçebilirsin (max {max}). {photos.length}/{max} fotoğraf.
          </span>
        </div>
      )}
      
      {photos.length === 0 && (
        <p className="text-sm text-white/50 text-center py-4">
          Henüz fotoğraf yok. Yüklemek için dosya seç.
        </p>
      )}
    </div>
  );
}

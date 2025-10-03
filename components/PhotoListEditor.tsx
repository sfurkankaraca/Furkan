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
    
    for (const f of files) {
      try {
        const compressed = await compressImage(f, 1920, 0.75);
        const file = compressed || f;
        let url = "";
        try {
          const gen = await fetch('/api/upload-url', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type }),
            cache: 'no-store' 
          });
          if (!gen.ok) throw new Error(`Upload URL alınamadı (${gen.status})`);
          const { url: uploadUrl } = await gen.json();
          const up = await fetch(uploadUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file 
          });
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

async function compressImage(file: File, maxWidth: number, quality: number): Promise<File | null> {
  try {
    const isImage = /^image\//.test(file.type);
    if (!isImage) return null;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const targetW = Math.round(bitmap.width * scale);
    const targetH = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality));
    if (!blob) return null;
    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
  } catch {
    return null;
  }
}

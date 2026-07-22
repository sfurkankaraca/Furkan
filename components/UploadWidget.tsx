"use client";

import { useRef, useState } from "react";
import { upload as blobUpload } from "@vercel/blob/client";

type Props = {
  targetTextareaId?: string;
  targetInputId?: string;
  accept?: string;
  onUploadComplete?: (url: string) => void;
  eventId?: string; // Event ID for updating store
  /** Örn. /api/me/upload-avatar — girişli kullanıcı profil fotoğrafı */
  uploadApiPath?: string;
  withCredentials?: boolean;
  buttonLabel?: string;
  /** false: sağdaki açıklama satırını gösterme */
  showHint?: boolean;
};

export default function UploadWidget({
  targetTextareaId,
  targetInputId,
  accept = "image/*",
  onUploadComplete,
  eventId,
  uploadApiPath = "/api/blob/upload",
  withCredentials = false,
  buttonLabel = "Yükle",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || busy) return;

    setBusy(true);
    try {
      // Client-side compress (JPEG, kalite ~0.75, max genişlik 1920)
      const compressed = await compressImage(file, 1920, 0.75);
      const uploadFile = compressed || file;

      let url = "";
      const isVideo = /^video\//.test(uploadFile.type || file.type || "");
      try {
        const safeName = (uploadFile.name || "file")
          .replace(/[^\w.\-]+/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 120);
        const objectPath = `uploads/${Date.now()}-${safeName}`;
        // Vercel Blob client upload (büyük video dosyaları için önerilen yol)
        const uploaded = await blobUpload(objectPath, uploadFile, {
          access: "public",
          contentType: uploadFile.type || "application/octet-stream",
          handleUploadUrl: "/api/upload-url",
          multipart: isVideo,
        });
        url = uploaded.url;
      } catch (directErr) {
        // Video dosyalarında server fallback (multipart) boyut limitine takılabilir.
        // Bu yüzden direct upload başarısızsa hatayı aynen kullanıcıya göster.
        if (isVideo) {
          throw directErr;
        }
        // Fallback: küçük dosyalar için API üzerinden yükle (Server limitlerine tabi)
        const formData = new FormData();
        formData.append("file", uploadFile);
        const res = await fetch(uploadApiPath, {
          method: "POST",
          body: formData,
          ...(withCredentials ? { credentials: "include" as RequestCredentials } : {}),
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Upload hata (${res.status})`);
        }
        const j = await res.json();
        url = j.url;
      }
      console.log(">> Upload başarılı, URL:", url);

      if (targetTextareaId) {
        const ta = document.getElementById(targetTextareaId) as HTMLTextAreaElement | null;
        if (ta) ta.value = (ta.value ? ta.value + "\n" : "") + url;
      }
      if (targetInputId) {
        const input = document.getElementById(targetInputId) as HTMLInputElement | null;
        if (input) input.value = url;
      }
      
      // Callback ile parent component'e bildir
      if (onUploadComplete) {
        onUploadComplete(url);
      }
      
      // Store'u güncelle (eğer eventId varsa)
      if (eventId) {
        console.log("Updating event image for:", eventId, "with URL:", url);
        
        // API ile event'i güncelle
        fetch('/api/events/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: eventId,
            newImage: url
          }),
        })
        .then(response => {
          console.log("API response status:", response.status);
          return response.json();
        })
                        .then(data => {
                  console.log("API response data:", data);
                  if (data.success) {
                    console.log("Event image updated successfully");
                    // Güncel veriyi kullan
                    if (data.updatedEvents && eventId) {
                      // Local storage'a kaydet
                      localStorage.setItem('noqta-events', JSON.stringify(data.updatedEvents));
                      console.log("Events saved to localStorage");
                      
                      // Blob URL'ini de kaydet (kalıcı depolama için)
                      if (data.eventsBlobUrl) {
                        localStorage.setItem('noqta-events-blob-url', data.eventsBlobUrl);
                        console.log("Events blob URL saved:", data.eventsBlobUrl);
                      }
                      
                      // Global event ile diğer component'lere bildir
                      window.dispatchEvent(new CustomEvent('eventImageUpdated', {
                        detail: { 
                          eventId, 
                          newImage: url, 
                          updatedEvents: data.updatedEvents,
                          eventsBlobUrl: data.eventsBlobUrl 
                        }
                      }));
                    }
                  } else {
                    console.error("Failed to update event image:", data.error);
                  }
                })
        .catch(error => {
          console.error("Error updating event image:", error);
        });
      } else {
        console.log("No eventId provided, skipping update");
      }
    } catch (err: any) {
      console.error(">> Client upload hatası:", err);
      alert(err?.message || "Yükleme hatası");
    } finally {
      // Güvenli şekilde input'u temizle
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <button
        type="button"
        className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? "Yükleniyor…" : buttonLabel}
      </button>
      <span className="text-xs text-white/50">
        Seçtiğin görsel yüklenir ve alanına eklenir.
      </span>
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



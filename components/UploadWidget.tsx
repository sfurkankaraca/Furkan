"use client";

import { useRef, useState } from "react";

type Props = {
  targetTextareaId?: string;
  targetInputId?: string;
  accept?: string;
  onUploadComplete?: (url: string) => void;
  eventId?: string; // Event ID for updating store
};

export default function UploadWidget({
  targetTextareaId,
  targetInputId,
  accept = "image/*",
  onUploadComplete,
  eventId,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || busy) return;

    setBusy(true);
    try {
      // Generate direct upload URL (pre-signed) then POST the file there
      const gen = await fetch('/api/upload-url', { cache: 'no-store' });
      if (!gen.ok) throw new Error(`Upload URL alınamadı (${gen.status})`);
      const { url: uploadUrl } = await gen.json();
      const up = await fetch(uploadUrl, { method: 'POST', body: file });
      if (!up.ok) throw new Error(`Upload başarısız (${up.status})`);
      const { url } = await up.json();
      console.log(">> Client direct upload başarılı, URL:", url);

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
        {busy ? "Yükleniyor…" : "Yükle"}
      </button>
      <span className="text-xs text-white/50">
        Seçtiğin görsel yüklenir ve alanına eklenir.
      </span>
    </div>
  );
}



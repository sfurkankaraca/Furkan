"use client";

import type React from "react";
import { useRef } from "react";

type Props = {
  targetTextareaId?: string;
  targetInputId?: string;
  accept?: string;
};

export default function UploadWidget({ targetTextareaId, targetInputId, accept = "image/*" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;

    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const payload = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
      const { url, ok, error } = payload as { url?: string; ok?: boolean; error?: string };
      if (!res.ok || !ok || !url) {
        alert(error || `Upload URL alınamadı (HTTP ${res.status})`);
        inputEl.value = "";
        return;
      }

      const up = await fetch(url, { method: "POST", body: file });
      const json = await up.json().catch(() => ({} as any));
      const blobUrl: string | undefined = (json as any)?.url;
      if (!blobUrl) {
        alert("Yükleme başarısız");
        inputEl.value = "";
        return;
      }

      if (targetTextareaId) {
        const ta = document.getElementById(targetTextareaId) as HTMLTextAreaElement | null;
        if (ta) ta.value = (ta.value ? ta.value + "\n" : "") + blobUrl;
      }
      if (targetInputId) {
        const input = document.getElementById(targetInputId) as HTMLInputElement | null;
        if (input) input.value = blobUrl;
      }
    } catch (err: any) {
      alert(err?.message || "Yükleme hatası");
    } finally {
      inputEl.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept={accept} onChange={onChange} className="hidden" />
      <button
        type="button"
        className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90"
        onClick={() => inputRef.current?.click()}
      >
        Yükle
      </button>
      <span className="text-xs text-white/50">Seçtiğin görsel yüklenir ve alanına eklenir.</span>
    </div>
  );
}

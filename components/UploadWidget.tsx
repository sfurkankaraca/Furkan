"use client";

import type React from "react";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

type Props = {
  targetTextareaId?: string;
  targetInputId?: string;
  accept?: string;
};

export default function UploadWidget({ targetTextareaId, targetInputId, accept = "image/*" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await upload(file.name, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/blob/upload",
      });
      if (!url) throw new Error("Yükleme başarısız");
      if (targetTextareaId) {
        const ta = document.getElementById(targetTextareaId) as HTMLTextAreaElement | null;
        if (ta) ta.value = (ta.value ? ta.value + "\n" : "") + url;
      }
      if (targetInputId) {
        const input = document.getElementById(targetInputId) as HTMLInputElement | null;
        if (input) input.value = url;
      }
    } catch (err: any) {
      alert(err?.message || "Yükleme hatası");
    } finally {
      inputEl.value = "";
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept={accept} onChange={onChange} className="hidden" />
      <button
        type="button"
        className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? "Yükleniyor…" : "Yükle"}
      </button>
      <span className="text-xs text-white/50">Seçtiğin görsel yüklenir ve alanına eklenir.</span>
    </div>
  );
}

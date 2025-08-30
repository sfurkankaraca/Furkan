"use client";
import { useId } from "react";

type Props = {
  targetTextareaId?: string;
  targetInputId?: string;
};

export default function UploadWidget({ targetTextareaId, targetInputId }: Props) {
  const uid = useId().replace(/[:]/g, "");
  const inputId = `upload-${uid}`;

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await fetch("/api/upload-url", { method: "POST" });
    const { url, ok } = await res.json();
    if (!ok || !url) {
      alert("Upload URL alınamadı");
      return;
    }
    const up = await fetch(url, { method: "POST", body: file });
    const json = await up.json();
    const blobUrl: string | undefined = json?.url;
    if (!blobUrl) {
      alert("Yükleme başarısız");
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
    e.currentTarget.value = "";
  }
  return (
    <div className="flex items-center gap-3">
      <input id={inputId} type="file" accept="image/*" onChange={onChange} className="hidden" />
      <label htmlFor={inputId} className="cursor-pointer rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Yükle</label>
      <span className="text-xs text-white/60">Seçtiğin görsel yüklenir ve forma eklenir.</span>
    </div>
  );
}

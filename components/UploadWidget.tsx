"use client";

type Props = {
  targetTextareaId?: string;
  targetInputId?: string;
};

export default function UploadWidget({ targetTextareaId, targetInputId }: Props) {
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
    <div className="flex items-center gap-2">
      <input type="file" accept="image/*" onChange={onChange} className="text-sm" />
      <span className="text-xs text-white/50">Seçtiğin görsel yüklenir ve alanına eklenir.</span>
    </div>
  );
}

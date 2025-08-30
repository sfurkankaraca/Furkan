"use client";

import UploadWidget from "./UploadWidget";

export type PhotoItem = { url: string; title?: string; description?: string };

export default function PhotoListEditor({
  name,
  initial,
  max = 20,
}: {
  name: string;
  initial?: PhotoItem[];
  max?: number;
}) {
  function appendUrl(url: string) {
    const container = document.getElementById(`${name}-items`);
    if (!container) return;
    const count = container.querySelectorAll("[data-photo-item]").length;
    if (count >= max) return alert(`Maksimum ${max} fotoğraf`);
    const idx = count;
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-photo-item", "1");
    wrapper.className = "grid gap-2 border border-white/10 rounded-xl p-3";
    wrapper.innerHTML = `
      <input name="${name}[${idx}][url]" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Görsel URL" value="${url}" />
      <input name="${name}[${idx}][title]" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Başlık (isteğe bağlı)" />
      <textarea name="${name}[${idx}][description]" rows="2" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Açıklama (isteğe bağlı)"></textarea>
    `;
    container.appendChild(wrapper);
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget;
    const files = Array.from(inputEl.files || []);
    if (files.length === 0) return;
    for (const file of files.slice(0, max)) {
      try {
        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const payload = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
        const { url, ok, error } = payload as { url?: string; ok?: boolean; error?: string };
        if (!res.ok || !ok || !url) { alert(error || `Upload URL alınamadı (HTTP ${res.status})`); break; }
        const up = await fetch(url, { method: "POST", body: file });
        const json = await up.json().catch(() => ({} as any));
        const blobUrl: string | undefined = (json as any)?.url;
        if (blobUrl) appendUrl(blobUrl);
      } catch (err: any) {
        alert(err?.message || "Yükleme hatası");
        break;
      }
    }
    inputEl.value = "";
  }

  return (
    <div className="grid gap-3">
      <div id={`${name}-items`} className="grid gap-3">
        {(initial || []).slice(0, max).map((p, idx) => (
          <div key={idx} data-photo-item className="grid gap-2 border border-white/10 rounded-xl p-3">
            <input name={`${name}[${idx}][url]`} defaultValue={p.url} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Görsel URL" />
            <input name={`${name}[${idx}][title]`} defaultValue={p.title} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Başlık (isteğe bağlı)" />
            <textarea name={`${name}[${idx}][description]`} defaultValue={p.description} rows={2} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Açıklama (isteğe bağlı)" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" multiple onChange={onFilesSelected} className="text-sm" />
        <span className="text-xs text-white/50">Topluca seçebilirsin (max {max}).</span>
      </div>
    </div>
  );
}

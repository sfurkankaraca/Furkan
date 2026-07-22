"use client";

import { useRef, useState } from "react";
import type { LineupItem } from "@/lib/event-types";

export default function LineupListEditor({
  name,
  initial,
  max = 80,
}: {
  name: string;
  initial?: LineupItem[];
  max?: number;
}) {
  const [items, setItems] = useState<LineupItem[]>(initial?.length ? initial : []);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function addRow() {
    if (items.length >= max) {
      alert(`Maksimum ${max} isim`);
      return;
    }
    setItems([...items, { name: "", imageUrl: "", href: "", slot: "" }]);
  }

  function removeRow(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateRow(index: number, field: keyof LineupItem, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  }

  async function onImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/blob/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload failed ${res.status}`);
      const { url } = await res.json();
      updateRow(index, "imageUrl", url);
      e.target.value = "";
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Yükleme hatası");
    }
  }

  return (
    <div className="grid gap-3">
      {items.map((row, idx) => (
        <div key={idx} className="grid gap-2 border border-white/10 rounded-xl p-3 relative">
          <button
            type="button"
            onClick={() => removeRow(idx)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
            title="Kaldır"
          >
            ×
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/20 bg-white/5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {row.imageUrl ? (
                <img src={row.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-white/50">—</div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={(el) => {
                  fileRefs.current[idx] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(idx, e)}
              />
              <button
                type="button"
                onClick={() => fileRefs.current[idx]?.click()}
                className="rounded-xl bg-white/10 text-white px-3 py-1.5 text-sm hover:bg-white/15"
              >
                Görsel
              </button>
            </div>
          </div>

          <input
            name={`${name}[${idx}][name]`}
            value={row.name}
            onChange={(e) => updateRow(idx, "name", e.target.value)}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
            placeholder="Sanatçı / isim *"
          />
          <input
            name={`${name}[${idx}][slot]`}
            value={row.slot || ""}
            onChange={(e) => updateRow(idx, "slot", e.target.value)}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
            placeholder="Slot (opsiyonel), örn. Açılış"
          />
          <input
            name={`${name}[${idx}][imageUrl]`}
            value={row.imageUrl || ""}
            onChange={(e) => updateRow(idx, "imageUrl", e.target.value)}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white text-sm"
            placeholder="Görsel URL (harici)"
          />
          <input
            name={`${name}[${idx}][href]`}
            value={row.href || ""}
            onChange={(e) => updateRow(idx, "href", e.target.value)}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white text-sm"
            placeholder="Profil linki (opsiyonel)"
          />
        </div>
      ))}

      {items.length < max && (
        <button type="button" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm hover:bg-white/90 w-fit" onClick={addRow}>
          Line-up satırı ekle
        </button>
      )}

      {items.length === 0 && <p className="text-sm text-white/50">Henüz yok. Çok günlük festival sayfaları için BUGECE tarzı listeyi buradan kur.</p>}
    </div>
  );
}

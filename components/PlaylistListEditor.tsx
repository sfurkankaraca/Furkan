"use client";

export type PlaylistItem = { djName: string; description?: string; avatarUrl?: string; spotifyEmbedUrl: string };

export default function PlaylistListEditor({ name, initial, max = 20 }: { name: string; initial?: PlaylistItem[]; max?: number }) {
  return (
    <div id={`${name}-wrap`} className="grid gap-3">
      {(initial || []).slice(0, max).map((p, idx) => (
        <div key={idx} className="grid gap-2 border border-white/10 rounded-xl p-3">
          <input name={`${name}[${idx}][djName]`} defaultValue={p.djName} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="DJ adı (başlık)" />
          <textarea name={`${name}[${idx}][description]`} defaultValue={p.description} rows={2} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Açıklama" />
          <input name={`${name}[${idx}][avatarUrl]`} defaultValue={p.avatarUrl} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="DJ avatar URL (daire içinde)" />
          <input name={`${name}[${idx}][spotifyEmbedUrl]`} defaultValue={p.spotifyEmbedUrl} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Spotify embed URL" />
        </div>
      ))}
      <button type="button" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm" onClick={() => addItem(name, max)}>Playlist ekle</button>
    </div>
  );
}

function addItem(name: string, max: number) {
  const wrap = document.getElementById(`${name}-wrap`);
  if (!wrap) return;
  const count = wrap.querySelectorAll("[data-item]").length;
  if (count >= max) return alert(`Maksimum ${max} playlist`);
  const idx = count;
  const div = document.createElement("div");
  div.setAttribute("data-item", "1");
  div.className = "grid gap-2 border border-white/10 rounded-xl p-3";
  div.innerHTML = `
    <input name="${name}[${idx}][djName]" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="DJ adı (başlık)" />
    <textarea name="${name}[${idx}][description]" rows="2" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Açıklama"></textarea>
    <input name="${name}[${idx}][avatarUrl]" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="DJ avatar URL (daire içinde)" />
    <input name="${name}[${idx}][spotifyEmbedUrl]" class="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Spotify embed URL" />
  `;
  wrap.appendChild(div);
}

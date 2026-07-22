"use client";

import { useEffect, useState } from "react";
import UploadWidget from "@/components/UploadWidget";

type ClubPackage = {
  id: string;
  name: string;
  priceTry: number;
  periodLabel: string;
  description: string;
  features: string[];
  mappedRole: "participant" | "student" | "dj";
  coverUrl?: string;
};

const EMPTY_ROW: ClubPackage = {
  id: "",
  name: "",
  priceTry: 0,
  periodLabel: "/ ay",
  description: "",
  features: [],
  mappedRole: "participant",
  coverUrl: "",
};

export default function AdminClubPackagesPage() {
  const [rows, setRows] = useState<ClubPackage[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/club-packages", { cache: "no-store", credentials: "include" });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErr(j?.error || "Paketler yüklenemedi");
          return;
        }
        setRows(Array.isArray(j?.packages) ? j.packages : []);
      } catch {
        setErr("Bağlantı hatası");
      }
    })();
  }, []);

  function updateRow(index: number, patch: Partial<ClubPackage>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW, id: `paket-${prev.length + 1}` }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setBusy(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/admin/club-packages", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages: rows }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j?.error || "Kaydedilemedi");
        setBusy(false);
        return;
      }
      setRows(Array.isArray(j?.packages) ? j.packages : rows);
      setMsg("Paketler kaydedildi.");
    } catch {
      setErr("Bağlantı hatası");
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Kulüp Üyelik Paketleri</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fiyat, ayrıcalıklar ve kapak fotoğrafını buradan yönetebilirsin.</p>
      </div>

      <div className="grid gap-4">
        {rows.map((row, i) => (
          <section key={`${row.id}-${i}`} className="rounded-xl border border-border bg-white/[0.03] p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-foreground/70">Paket ID</span>
                <input
                  value={row.id}
                  onChange={(e) => updateRow(i, { id: e.target.value })}
                  className="rounded-lg border border-border bg-background/30 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-foreground/70">Paket adı</span>
                <input
                  value={row.name}
                  onChange={(e) => updateRow(i, { name: e.target.value })}
                  className="rounded-lg border border-border bg-background/30 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-foreground/70">Fiyat (TRY)</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.priceTry}
                  onChange={(e) => updateRow(i, { priceTry: Number(e.target.value) || 0 })}
                  className="rounded-lg border border-border bg-background/30 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-foreground/70">Periyot etiketi</span>
                <input
                  value={row.periodLabel}
                  onChange={(e) => updateRow(i, { periodLabel: e.target.value })}
                  className="rounded-lg border border-border bg-background/30 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-foreground/70">Rol</span>
                <select
                  value={row.mappedRole}
                  onChange={(e) => updateRow(i, { mappedRole: e.target.value as ClubPackage["mappedRole"] })}
                  className="rounded-lg border border-border bg-background/30 px-3 py-2"
                >
                  <option value="participant">Katılımcı</option>
                  <option value="student">Öğrenci</option>
                  <option value="dj">DJ</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-foreground/70">Kapak foto URL</span>
                <input
                  id={`pkg-cover-${i}`}
                  value={row.coverUrl || ""}
                  onChange={(e) => updateRow(i, { coverUrl: e.target.value })}
                  className="rounded-lg border border-border bg-background/30 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-3">
              <UploadWidget
                targetInputId={`pkg-cover-${i}`}
                onUploadComplete={(url) => updateRow(i, { coverUrl: url })}
                buttonLabel="Kapak yükle"
              />
            </div>

            <label className="mt-3 grid gap-1 text-sm">
              <span className="text-foreground/70">Kısa açıklama</span>
              <textarea
                value={row.description}
                onChange={(e) => updateRow(i, { description: e.target.value })}
                rows={2}
                className="rounded-lg border border-border bg-background/30 px-3 py-2"
              />
            </label>

            <label className="mt-3 grid gap-1 text-sm">
              <span className="text-foreground/70">Ayrıcalıklar (satır satır)</span>
              <textarea
                value={(row.features || []).join("\n")}
                onChange={(e) =>
                  updateRow(i, {
                    features: e.target.value
                      .split("\n")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  })
                }
                rows={5}
                className="rounded-lg border border-border bg-background/30 px-3 py-2"
              />
            </label>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="rounded-lg border border-red-400/35 bg-red-500/10 px-3 py-1.5 text-sm text-red-600"
              >
                Paketi sil
              </button>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={addRow} className="rounded-lg border border-border px-4 py-2 text-sm">
          Yeni paket
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {busy ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {msg ? <p className="mt-3 text-sm text-emerald-300">{msg}</p> : null}
      {err ? <p className="mt-3 text-sm text-red-300">{err}</p> : null}
    </main>
  );
}


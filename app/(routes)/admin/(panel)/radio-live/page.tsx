"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Row = { streamUrl: string; title: string; isLive: boolean };

export default function AdminRadioLivePage() {
  const [row, setRow] = useState<Row>({ streamUrl: "", title: "Noqta canlı", isLive: false });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/radio-live", { cache: "no-store", credentials: "include" });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErr(j?.error || "Yüklenemedi");
          return;
        }
        setRow({
          streamUrl: typeof j.streamUrl === "string" ? j.streamUrl : "",
          title: typeof j.title === "string" ? j.title : "Noqta canlı",
          isLive: !!j.isLive,
        });
      } catch {
        setErr("Bağlantı hatası");
      }
    })();
  }, []);

  async function save(patch: Partial<Row>) {
    const next = { ...row, ...patch };
    setBusy(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/admin/radio-live", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j?.error || "Kaydedilemedi");
        setBusy(false);
        return;
      }
      setRow({
        streamUrl: typeof j.streamUrl === "string" ? j.streamUrl : next.streamUrl,
        title: typeof j.title === "string" ? j.title : next.title,
        isLive: !!j.isLive,
      });
      setMsg(patch.isLive === true ? "Yayın açık — site /radio üzerinden dinlenebilir." : "Kaydedildi.");
    } catch {
      setErr("Bağlantı hatası");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-3xl grid gap-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">Canlı radyo yayını</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          OBS veya encoder&apos;dan aldığınız <strong className="text-foreground/70">dinleme</strong> adresini (genelde MP3 veya
          HLS çıktısı) yapıştırın. Kaydettikten sonra «Yayını başlat» ile /radio sayfasında oynatıcı görünür. Sohbet:{" "}
          <a href="/radio/chat" className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">
            /radio/chat
          </a>
        </p>
      </div>

      <section className="rounded-xl border border-border bg-white/[0.03] p-5 grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span className="text-foreground/70">Akış URL (OBS / sunucu)</span>
          <input
            value={row.streamUrl}
            onChange={(e) => setRow((r) => ({ ...r, streamUrl: e.target.value }))}
            placeholder="https://…/stream.mp3"
            className="rounded-lg border border-border bg-background/40 px-3 py-2 font-mono text-xs md:text-sm"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-foreground/70">Yayın başlığı (radyo kartında)</span>
          <input
            value={row.title}
            onChange={(e) => setRow((r) => ({ ...r, title: e.target.value }))}
            className="rounded-lg border border-border bg-background/40 px-3 py-2"
          />
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            disabled={busy || !row.streamUrl.trim()}
            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={() => save({ isLive: true })}
          >
            Yayını başlat
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            className="rounded-xl border-border bg-transparent"
            onClick={() => save({ isLive: false })}
          >
            Yayını durdur
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            className="rounded-xl"
            onClick={() => save({})}
          >
            URL / başlığı kaydet
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Durum:{" "}
          <span className={row.isLive ? "text-emerald-600 font-medium" : "text-muted-foreground"}>
            {row.isLive ? "Yayında" : "Kapalı"}
          </span>
        </p>

        {msg ? <p className="text-sm text-emerald-600/90">{msg}</p> : null}
        {err ? <p className="text-sm text-red-400/90">{err}</p> : null}
      </section>
    </div>
  );
}

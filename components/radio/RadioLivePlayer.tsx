"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Radio, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  streamUrl: string;
  title?: string;
  className?: string;
};

/**
 * Canlı yayın: Icecast/Shoutcast HTTP (mp3/aac) veya doğrudan ses URL’i için `<audio>`.
 * HLS (.m3u8) için Safari’de çoğu zaman çalışır; Chrome’da sorun olursa yayını MP3 mount ile verin.
 */
export function RadioLivePlayer({ streamUrl, title = "Canlı yayın", className }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onErr = () => setError("Akış yüklenemedi. URL veya CORS ayarını kontrol edin.");
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onErr);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onErr);
    };
  }, [streamUrl]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    setError(null);
    if (el.paused) void el.play().catch(() => setError("Oynatma başlatılamadı."));
    else el.pause();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-500/25 bg-emerald-950/25 p-4 md:p-5 grid gap-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
            <Radio className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/90">On air</p>
            <p className="text-sm font-medium text-white">{title}</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={toggle}
          className="rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-medium"
        >
          <Headphones className="size-4 mr-2 inline-block align-middle" aria-hidden />
          {playing ? "Duraklat" : "Dinle"}
        </Button>
      </div>

      <audio ref={ref} src={streamUrl} preload="none" className="hidden" />

      {error ? (
        <p className="flex items-start gap-2 text-xs text-amber-200/95">
          <AlertCircle className="size-4 shrink-0 mt-0.5" aria-hidden />
          {error}
        </p>
      ) : (
        <p className="text-xs text-white/50 leading-relaxed">
          Açık hava ve internet yayınında birkaç saniye — onlarca saniye gecikme normaldir. En iyi sonuç için sunucu
          tarafında <strong className="text-white/70">Icecast / Shoutcast (MP3)</strong> veya CDN üzerinden{" "}
          <strong className="text-white/70">HLS</strong> kullanın; URL’yi{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 text-[10px]">NEXT_PUBLIC_RADIO_LIVE_STREAM_URL</code> ile
          verin.
        </p>
      )}
    </div>
  );
}

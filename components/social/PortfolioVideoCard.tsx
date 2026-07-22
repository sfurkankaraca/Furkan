"use client";

import { useEffect, useRef } from "react";
import { parseInstagramEmbedUrl } from "@/lib/social/instagram";

function videoSrcWithPreviewHint(url: string): string {
  if (!url || url.includes("#")) return url;
  if (/\.m3u8(\?|$)/i.test(url)) return url;
  if (/^https?:\/\//i.test(url)) return `${url}#t=0.05`;
  return url;
}

export function PortfolioVideoCard({
  src,
  title,
  poster,
}: {
  src: string;
  title?: string;
  /** Varsa bu görsel ilk kare yerine gösterilir (admin’den sabit kapak). */
  poster?: string;
}) {
  const embedUrl = parseInstagramEmbedUrl(src);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (embedUrl || poster) return;
    const v = videoRef.current;
    if (!v) return;

    const seekPreviewFrame = () => {
      try {
        const d = v.duration;
        const t =
          Number.isFinite(d) && d > 0
            ? Math.min(0.12, Math.max(0.03, d * 0.02))
            : 0.05;
        if (v.currentTime < 0.001 || v.currentTime === 0) {
          v.currentTime = t;
        }
      } catch {
        /* noop */
      }
    };

    v.addEventListener("loadedmetadata", seekPreviewFrame, { once: true });
    if (v.readyState >= HTMLMediaElement.HAVE_METADATA) {
      seekPreviewFrame();
    }
    return () => v.removeEventListener("loadedmetadata", seekPreviewFrame as EventListener);
  }, [src, embedUrl, poster]);

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-white/12 bg-black/20">
        <div className="mx-auto w-full max-w-[420px]">
          <iframe
            src={embedUrl}
            title={title || "Instagram Reel"}
            className="aspect-[9/16] w-full bg-zinc-950"
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-black/20">
      <div className="mx-auto w-full max-w-[420px]">
        <video
          ref={videoRef}
          src={videoSrcWithPreviewHint(src)}
          poster={poster}
          controls
          className="aspect-[9/16] w-full bg-zinc-950 object-cover"
          preload="auto"
          playsInline
        />
      </div>
    </div>
  );
}

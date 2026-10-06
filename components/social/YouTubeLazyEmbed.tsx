"use client";

import { useState } from "react";
import { CirclePlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseYoutubeUrl, youtubeNocookieEmbedSrc, youtubeThumbnailUrl } from "@/lib/youtube/embed";

type Props = {
  url: string;
  title?: string;
  className?: string;
};

export function YouTubeLazyEmbed({ url, title = "YouTube video", className }: Props) {
  const [active, setActive] = useState(false);
  const ref = parseYoutubeUrl(url);
  if (!ref) return null;
  const src = youtubeNocookieEmbedSrc(ref);
  const thumb = youtubeThumbnailUrl(ref);

  if (active) {
    return (
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-black/40 shadow-lg",
          className,
        )}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`${src}&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-zinc-950 text-left shadow-lg outline-none transition hover:border-white/25 focus-visible:ring-2 focus-visible:ring-noqt-lime/50",
        className,
      )}
      aria-label={`${title} oynat`}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-noqt-lime/10 via-zinc-900 to-black"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center">
        <CirclePlay
          className="h-16 w-16 text-white drop-shadow-lg transition group-hover:scale-105 md:h-20 md:w-20"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
    </button>
  );
}

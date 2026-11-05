"use client";

import Image from "next/image";
import { useState } from "react";
import { parseYoutubeUrl, youtubeNocookieEmbedSrc } from "@/lib/youtube/embed";
import { youtubeWatchUrl, type SetVideo } from "@/lib/club-radio/content";

/** Küçük resme tıklanınca YouTube (nocookie) gömülü oynatıcıya dönüşen kart. */
export function VideoCard({ video, size = "lg" }: { video: SetVideo; size?: "lg" | "sm" }) {
  const [playing, setPlaying] = useState(false);
  const ref = parseYoutubeUrl(youtubeWatchUrl(video.id));
  const src = ref ? `${youtubeNocookieEmbedSrc(ref)}&autoplay=1` : null;
  const btn = size === "lg" ? 76 : 68;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#161616]">
        {playing && src ? (
          <iframe
            src={src}
            title={`${video.title} — YouTube`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Oynat: ${video.title}`}
            className="group absolute inset-0 block size-full cursor-pointer border-0 bg-transparent p-0"
          >
            <Image
              src={video.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#DDF76A] text-[#0A0A0A] transition-transform group-hover:scale-105"
              style={{ width: btn, height: btn }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4v16l13-8z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {size === "lg" ? (
          <>
            <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#DDF76A]">{video.kind}</span>
            <span className="text-[21px] font-bold">{video.artists}</span>
            <span className="text-[14px] text-[#A6A9A0]">{video.title} · YouTube</span>
          </>
        ) : (
          <span className="text-[19px] font-bold">{video.title.replace(" at noqtastudio", "").replace(" at Alley's Nail Studio", "")} · {video.artists.replaceAll(" · ", ", ")}</span>
        )}
      </div>
    </div>
  );
}

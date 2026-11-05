"use client";

import { useState } from "react";
import { parseYoutubeUrl, youtubeNocookieEmbedSrc } from "@/lib/youtube/embed";
import { SOUNDCLOUD_URL, youtubeWatchUrl, type SetVideo } from "@/lib/club-radio/content";

// Dalga biçimi süs amaçlıdır; gerçek ses çalmaz. Sunucu/istemci aynı sonucu versin diye deterministik.
const BARS = Array.from({ length: 64 }, (_, i) => {
  const h = 18 + Math.round(Math.abs(Math.sin(i * 0.55) * 52 + Math.sin(i * 1.7) * 26));
  return Math.min(h, 100);
});

export function HeroPlayer({ video }: { video: SetVideo }) {
  const [playing, setPlaying] = useState(false);
  const ref = parseYoutubeUrl(youtubeWatchUrl(video.id));
  const src = ref ? `${youtubeNocookieEmbedSrc(ref)}&autoplay=1` : null;

  return (
    <div className="flex flex-col gap-3.5 rounded-[14px] bg-[#0A0A0A] p-[18px] text-[#F4F4EE]">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          aria-label={playing ? "Videoyu kapat" : "Son seti çal"}
          aria-pressed={playing}
          onClick={() => setPlaying((v) => !v)}
          disabled={!src}
          className="flex size-[52px] flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-[#DDF76A] text-[#0A0A0A]"
        >
          {playing ? (
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6z" />
              <path d="M14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4v16l13-8z" />
            </svg>
          )}
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#DDF76A]">Son set · noqt stüdyo</span>
          <span className="truncate text-[17px] font-semibold">
            House Mix · {video.artists.replaceAll(" · ", ", ")}
          </span>
        </div>
      </div>

      {playing && src ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            src={src}
            title={`${video.title} — YouTube`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="size-full border-0"
          />
        </div>
      ) : (
        <div aria-hidden="true" className="flex h-11 items-center gap-[3px] overflow-hidden">
          {BARS.map((h, i) => (
            <span key={i} className="min-w-[2px] flex-[1_1_0] rounded-[2px]" style={{ height: `${h}%`, background: i < 22 ? "#DDF76A" : "#3A3A3A" }} />
          ))}
        </div>
      )}

      <span className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-[#A6A9A0]">
        <a href={youtubeWatchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          YouTube&apos;da izle ↗
        </a>
        {SOUNDCLOUD_URL ? (
          <a href={SOUNDCLOUD_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            SoundCloud&apos;da dinle ↗
          </a>
        ) : null}
      </span>
    </div>
  );
}

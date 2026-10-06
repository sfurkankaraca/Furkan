"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

type Post = { type: "reel" | "p"; code: string; url: string; caption: string | null };

export function InstagramReelGrid({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState<Post | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {posts.map((post) => (
          <button
            key={post.code}
            type="button"
            onClick={() => setOpen(post)}
            className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-foreground/90 text-left outline-none ring-noqt-lime ring-offset-2 ring-offset-background focus-visible:ring-2"
            aria-label={post.caption ? `Videoyu izle: ${post.caption}` : "Videoyu izle"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- kendi proxy route'umuzdan gelen dinamik görsel */}
            <img
              src={`/api/ig-thumb/${post.code}`}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            {post.type === "reel" ? (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-noqt-sky px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black">
                Reel
              </span>
            ) : null}
            <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-noqt-lime text-black shadow-lg transition group-hover:scale-110">
              <Play className="ml-0.5 size-5 fill-current" aria-hidden />
            </span>
            {post.caption ? (
              <p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-xs font-medium leading-snug text-white">
                {post.caption}
              </p>
            ) : null}
          </button>
        ))}
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Instagram videosu"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div className="relative w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-noqt-lime text-black"
              aria-label="Kapat"
            >
              <X className="size-5" aria-hidden />
            </button>
            <div className="overflow-hidden rounded-2xl bg-white">
              <iframe
                src={`https://www.instagram.com/${open.type}/${open.code}/embed`}
                title="Instagram videosu"
                allow="autoplay; encrypted-media; picture-in-picture"
                className="block h-[min(80vh,640px)] w-full border-0"
              />
            </div>
            <a
              href={open.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Instagram&apos;da aç ↗
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

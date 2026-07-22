"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Preload / <source> için güvenli href (RSC / prod hatalarını önlemek). */
function safeVideoHref(href: string): string | null {
  const t = href.trim();
  if (!t) return null;
  if (t.startsWith("/")) return t;
  try {
    const u = new URL(t);
    if (u.protocol === "https:" || u.protocol === "http:") return u.href;
  } catch {
    return null;
  }
  return null;
}

type VideoLoadStrategy = "eager" | "idle";

/**
 * Tam genişlik kahraman videosu.
 * - `eager` (varsayılan): preload + yüksek öncelik; video DOM’u layout aşamasında açılır (ilk boyamadan önce).
 * - `idle`: ana iş parçacığı boşalınca yükle (düşük öncelik).
 */
export function PageHeroVideo({
  sources,
  poster = "/og.png",
  posterAlt = "Noqta — kahraman alanı arka plan görseli",
  overlayClassName = "bg-black/50",
  children,
  className,
  videoClassName,
  videoLoad = "eager",
  deferMs = 400,
  /** Viewport’a sabit arka plan; içerik kaydırılırken video yerinde kalır. */
  fixedBackdrop = true,
}: {
  sources: readonly string[];
  poster?: string;
  /** Poster img için erişilebilirlik / SEO uyumlu kısa açıklama */
  posterAlt?: string;
  overlayClassName?: string;
  children: ReactNode;
  className?: string;
  videoClassName?: string;
  videoLoad?: VideoLoadStrategy;
  deferMs?: number;
  fixedBackdrop?: boolean;
}) {
  const [mountVideo, setMountVideo] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const readyRef = useRef(false);

  const primarySrc = safeVideoHref(sources[0] ?? "") ?? "";

  const saveDataActive = (): boolean => {
    try {
      return !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    } catch {
      return false;
    }
  };

  const markVideoReady = () => {
    if (readyRef.current) return;
    readyRef.current = true;
    setVideoVisible(true);
  };

  /** Eager: preload + video etiketini ilk boyamadan önce bağla (bir frame gecikmesini azaltır). */
  useLayoutEffect(() => {
    readyRef.current = false;
    setVideoVisible(false);

    if (videoLoad !== "eager" || !primarySrc || saveDataActive()) {
      setMountVideo(false);
      return;
    }

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = primarySrc;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    setMountVideo(true);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [primarySrc, videoLoad]);

  useEffect(() => {
    if (sources.length === 0 || videoLoad !== "idle") return;
    if (saveDataActive()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setMountVideo(true);
    };

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    if (typeof requestIdleCallback !== "undefined") {
      idleHandle = requestIdleCallback(start, { timeout: Math.max(1200, deferMs + 500) });
    } else {
      timeoutHandle = setTimeout(start, deferMs);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    };
  }, [sources, videoLoad, deferMs]);

  /** Kaynak değişince (SPA) görünürlük bayrağını sıfırla — idle yolu. */
  useEffect(() => {
    if (videoLoad !== "idle") return;
    readyRef.current = false;
    setVideoVisible(false);
  }, [primarySrc, videoLoad]);

  const videoPreload = videoLoad === "eager" ? "auto" : "metadata";

  return (
    <section
      className={cn(
        "relative",
        fixedBackdrop ? "min-h-[100dvh] overflow-visible" : "min-h-[100dvh] overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none",
          fixedBackdrop
            ? "fixed inset-0 z-0 h-[100dvh] min-h-[100dvh] w-full max-h-[100dvh] overflow-hidden"
            : "absolute inset-0 -z-10",
        )}
        aria-hidden
      >
        <img
          src={poster}
          alt={posterAlt}
          className={cn("absolute inset-0 h-full w-full object-cover", videoClassName)}
          decoding="async"
          fetchPriority="high"
        />
        {mountVideo && sources.length > 0 ? (
          <video
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
              videoVisible ? "opacity-100" : "opacity-0",
              videoClassName,
            )}
            autoPlay
            loop
            muted
            playsInline
            preload={videoPreload}
            poster={poster}
            {...(videoLoad === "eager" ? { fetchPriority: "high" as const } : {})}
            onLoadedData={markVideoReady}
            onCanPlay={markVideoReady}
          >
            {sources.map((src) => {
              const h = safeVideoHref(src);
              return h ? <source key={src} src={h} type="video/mp4" /> : null;
            })}
          </video>
        ) : null}
        <div className={cn("absolute inset-0", overlayClassName)} />
      </div>
      {fixedBackdrop ? <div className="relative z-10">{children}</div> : children}
    </section>
  );
}

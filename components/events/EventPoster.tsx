"use client";

import { useState } from "react";

/**
 * Etkinlik afişi: gerçek görsel varsa düz <img> (herhangi bir https kaynağı güvenle yüklenir),
 * yoksa ya da yüklenemezse tasarlanmış yedek afiş (koyu kart, beyaz noqt logosu, başlık, tarih, limon çizgi).
 * Kapsayıcıyı (en-boy oranı, göreli konum) çağıran verir; bileşen onu doldurur.
 */
export function EventPoster({
  image,
  title,
  dateLabel,
  alt,
  sizes,
  eager = false,
  grayscale = false,
  showFallbackTitle = true,
  compact = false,
  objectPosition,
  className = "",
}: {
  image?: string | null;
  title: string;
  dateLabel?: string;
  /** Verilmezse başlık. */
  alt?: string;
  sizes?: string;
  eager?: boolean;
  grayscale?: boolean;
  /** Başlık zaten afişin üstünde ayrıca yazılıyorsa yedek afişte tekrar etme. */
  showFallbackTitle?: boolean;
  /** Küçük önizleme: yalnız logo. */
  compact?: boolean;
  objectPosition?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = image && !failed ? image : null;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? title}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`absolute inset-0 size-full object-cover ${grayscale ? "cr-bw" : ""} ${className}`}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt ?? title}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden bg-[#141414] p-4 text-center ${className}`}
      style={{ backgroundImage: "radial-gradient(120% 80% at 50% 0%, rgba(221,247,106,0.10), rgba(20,20,20,0) 60%)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/club-radio/noqt-logo-white.png"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        className={`h-auto ${compact ? "w-3/5 max-w-[56px]" : "w-1/3 max-w-[120px] opacity-90"}`}
      />
      {!compact ? (
        <>
          <span aria-hidden="true" className="h-[2px] w-10 bg-[#DDF76A]" />
          {showFallbackTitle ? (
            <span className="cr-display line-clamp-4 max-w-full break-words text-[22px] normal-case leading-[1.05] text-[#F4F4EE]" style={{ fontStretch: "112%" }}>
              {title}
            </span>
          ) : null}
          {dateLabel ? <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#A6A9A0]">{dateLabel}</span> : null}
        </>
      ) : null}
    </span>
  );
}

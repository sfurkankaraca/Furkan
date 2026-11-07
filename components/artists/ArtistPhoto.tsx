import Image from "next/image";

/** next/image'in küçültebildiği kaynaklar: yerel dosyalar ve noqt.events'in Supabase deposu. */
function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

/**
 * Sanatçı fotoğrafı: noqt.events'teki özgün dosyalar 6000 px'e kadar çıkabiliyor,
 * bu yüzden uygun olanları next/image ile küçültüp kare kırpar. Ebeveyn `relative` olmalı.
 */
export function ArtistPhoto({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (canOptimize(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={`absolute inset-0 size-full object-cover ${className}`} />;
}

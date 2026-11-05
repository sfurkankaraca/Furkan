import Image from "next/image";

/** club radio fotoğrafı: varsayılan siyah-beyaz işlem; bw={false} ile renkli. */
export function Photo({
  src,
  alt,
  sizes,
  position,
  bw = true,
  fill = false,
  priority = false,
  className = "",
  radius = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  position?: string;
  bw?: boolean;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  radius?: string;
}) {
  const cls = `${bw ? "cr-bw" : ""} object-cover ${radius} ${className}`;
  const style = position ? { objectPosition: position } : undefined;
  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cls} style={style} />;
  }
  const isYt = src.includes("/yt-");
  return (
    <Image
      src={src}
      alt={alt}
      width={isYt ? 1280 : 1800}
      height={isYt ? 720 : 1013}
      sizes={sizes}
      priority={priority}
      className={`block w-full ${cls}`}
      style={style}
    />
  );
}

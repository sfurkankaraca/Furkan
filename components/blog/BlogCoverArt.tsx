import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog/registry";
import { coverFor, coverPalette } from "@/lib/blog/covers";

/**
 * Yazı kapağı: fotoğraf tanımlıysa fotoğraf, değilse slug'dan türetilen
 * tipografik kapak. Dergi ızgarasında her kart dolu görünsün diye.
 */
export function BlogCoverArt({
  post,
  className = "",
  sizes = "(min-width: 768px) 33vw, 100vw",
  priority = false,
}: {
  post: BlogPostMeta;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const cover = coverFor(post);

  if (cover) {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  const { from, to, ink } = coverPalette(post.slug);
  const initials = post.title.replace(/[^\p{L}\p{N} ]/gu, "").trim().slice(0, 2).toUpperCase();

  return (
    <div
      aria-hidden
      className={`absolute inset-0 flex items-end overflow-hidden ${className}`}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      <div
        className="absolute -right-6 -top-10 select-none text-[9rem] font-black leading-none tracking-tighter opacity-25 md:text-[12rem]"
        style={{ color: ink }}
      >
        {initials}
      </div>
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 10px, currentColor 10px 11px)",
          color: ink,
        }}
      />
      <p
        className="relative m-4 text-[10px] font-semibold uppercase tracking-[0.2em] md:m-5"
        style={{ color: ink, opacity: 0.85 }}
      >
        {post.categoryLabel}
      </p>
    </div>
  );
}

/** Kapak fotoğrafının telif satırı — fotoğraf varsa basılır. */
export function BlogCoverCredit({ post, className = "" }: { post: BlogPostMeta; className?: string }) {
  const cover = coverFor(post);
  if (!cover?.credit) return null;
  return (
    <p className={`text-[11px] text-muted-foreground ${className}`}>
      Fotoğraf:{" "}
      {cover.creditUrl ? (
        <a href={cover.creditUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {cover.credit}
        </a>
      ) : (
        cover.credit
      )}
    </p>
  );
}

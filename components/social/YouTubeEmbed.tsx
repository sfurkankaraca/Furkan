import { cn } from "@/lib/utils";
import { parseYoutubeUrl, youtubeNocookieEmbedSrc } from "@/lib/youtube/embed";

type YouTubeEmbedProps = {
  url: string;
  title?: string;
  className?: string;
};

export function YouTubeEmbed({ url, title = "YouTube video", className }: YouTubeEmbedProps) {
  const ref = parseYoutubeUrl(url);
  if (!ref) return null;
  const src = youtubeNocookieEmbedSrc(ref);
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-black/40 shadow-lg",
        className,
      )}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

import { Instagram } from "lucide-react";
import { ACADEMY_INSTAGRAM_HANDLE, ACADEMY_INSTAGRAM_POSTS } from "@/lib/academy-instagram";

export function AcademyInstagramFeed() {
  const profileUrl = `https://www.instagram.com/${ACADEMY_INSTAGRAM_HANDLE}/`;
  return (
    <section aria-labelledby="instagram-heading">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Instagram</p>
          <h2 id="instagram-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Derslerden ve workshoplardan
          </h2>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <Instagram className="size-4 text-fuchsia-600" aria-hidden />@{ACADEMY_INSTAGRAM_HANDLE}
        </a>
      </div>

      {/* Mobilde yatay kaydırma, masaüstünde 3 sütun */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {ACADEMY_INSTAGRAM_POSTS.map((post) => (
          <div
            key={post.code}
            className="w-[85%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-card sm:w-[60%] md:w-auto"
          >
            <iframe
              src={`https://www.instagram.com/${post.type}/${post.code}/embed`}
              title={`@${ACADEMY_INSTAGRAM_HANDLE} Instagram gönderisi`}
              loading="lazy"
              allowTransparency
              allow="encrypted-media; picture-in-picture"
              className="block h-[560px] w-full border-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

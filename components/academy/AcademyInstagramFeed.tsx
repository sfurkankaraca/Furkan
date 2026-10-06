import { Instagram } from "lucide-react";
import {
  ACADEMY_INSTAGRAM_HANDLE,
  ACADEMY_INSTAGRAM_POSTS,
  fetchInstagramCaption,
  instagramPostUrl,
} from "@/lib/academy-instagram";
import { InstagramReelGrid } from "./InstagramReelGrid";

export async function AcademyInstagramFeed() {
  const posts = await Promise.all(
    ACADEMY_INSTAGRAM_POSTS.map(async (post) => ({
      ...post,
      url: instagramPostUrl(post),
      caption: await fetchInstagramCaption(post),
    })),
  );
  const profileUrl = `https://www.instagram.com/${ACADEMY_INSTAGRAM_HANDLE}/`;

  return (
    <section aria-labelledby="instagram-heading">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-noqt-lime px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-black">
            <Instagram className="size-3.5" aria-hidden />@{ACADEMY_INSTAGRAM_HANDLE}
          </p>
          <h2 id="instagram-heading" className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Derslerden ve workshoplardan
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Mixler, dersler ve stüdyodan kareler.</p>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-noqt-sky px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-95"
        >
          Instagram&apos;da takip et ↗
        </a>
      </div>

      <InstagramReelGrid posts={posts} />
    </section>
  );
}

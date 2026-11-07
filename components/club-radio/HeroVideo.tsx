"use client";

import type { SetVideo } from "@/lib/club-radio/content";
import { LiteEmbed } from "@/components/club-radio/VideoCard";

/** Ana sayfa kahraman videosu: açılışta izlenebilir (küçük resim + büyük oynat düğmesi, tek tıkla autoplay). */
export function HeroVideo({ video }: { video: SetVideo }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2A2A2A]">
      <LiteEmbed video={video} btn={96} sizes="(max-width: 900px) 100vw, 62vw" priority className="rounded-none" />
    </div>
  );
}

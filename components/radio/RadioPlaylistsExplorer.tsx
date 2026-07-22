"use client";

import { useMemo, useState } from "react";
import { ListMusic, ExternalLink, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CANONICAL_RADIO_CATEGORIES,
  type CanonicalRadioCategory,
  normalizeRadioCategory,
} from "@/lib/radio-categories";
import { getRadioCoverFallback } from "@/lib/radio-cover-fallback";

export type RadioPlaylistItem = {
  id: string;
  title: string;
  spotifyUrl: string;
  coverImage?: string | null;
  category: string;
  featured: boolean;
  sortOrder: number;
};

type NormalizedRadioPlaylistItem = RadioPlaylistItem & {
  normalizedCategory: CanonicalRadioCategory;
};

function PlaylistCard({ item, large }: { item: NormalizedRadioPlaylistItem; large?: boolean }) {
  const coverUrl =
    item.coverImage && String(item.coverImage).trim().length > 0
      ? item.coverImage
      : getRadioCoverFallback(item.normalizedCategory);

  return (
    <a
      href={item.spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-white/20 hover:bg-white/[0.06]",
        large ? "flex flex-col sm:flex-row sm:items-stretch" : "flex flex-col",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-black/40",
          large ? "aspect-square w-full sm:w-[min(44%,280px)]" : "aspect-square w-full",
        )}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={`${item.title} Spotify playlist kapak görseli — ${item.normalizedCategory}`}
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-white/25">
            <ListMusic className="size-14" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
        {item.featured ? (
          <span className="absolute left-3 top-3 rounded-full border border-amber-400/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
            Öne çıkan
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 p-4 md:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-white/45">{item.normalizedCategory}</p>
        <h3 className={cn("font-semibold text-white", large ? "text-lg md:text-xl" : "text-base")}>{item.title}</h3>
        <span className="inline-flex items-center gap-1.5 text-sm text-cyan-300/90 group-hover:text-cyan-200">
          Spotify&apos;da aç
          <ExternalLink className="size-3.5 opacity-80" aria-hidden />
        </span>
      </div>
    </a>
  );
}

export default function RadioPlaylistsExplorer({
  items,
  spotifyProfileUrl,
}: {
  items: RadioPlaylistItem[];
  /** noqta Spotify kullanıcı profili (public playlist’ler) */
  spotifyProfileUrl?: string;
}) {
  const [filter, setFilter] = useState<string>("all");

  const normalizedItems = useMemo<NormalizedRadioPlaylistItem[]>(() => {
    return items.map((p) => ({
      ...p,
      normalizedCategory: normalizeRadioCategory(p.category),
    }));
  }, [items]);

  const categories = useMemo(() => {
    const set = new Set<CanonicalRadioCategory>();
    for (const p of normalizedItems) set.add(p.normalizedCategory);
    return CANONICAL_RADIO_CATEGORIES.filter((c) => set.has(c));
  }, [normalizedItems]);

  const featured = useMemo(() => normalizedItems.filter((p) => p.featured), [normalizedItems]);

  const filtered = useMemo(() => {
    if (filter === "all") return normalizedItems;
    return normalizedItems.filter((p) => p.normalizedCategory === filter);
  }, [normalizedItems, filter]);

  if (items.length === 0) {
    return (
      <div className="grid gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
          <ListMusic className="mx-auto size-12 text-white/20" aria-hidden />
          <p className="mt-4 text-white/70">Liste verisi yüklenemedi.</p>
          <p className="mt-1 text-sm text-white/45">
            {spotifyProfileUrl ? (
              <a
                href={spotifyProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300/90 hover:text-cyan-200 inline-flex items-center gap-1 justify-center"
              >
                Spotify profilindeki koleksiyonlara git
                <ExternalLink className="size-3.5 opacity-80" aria-hidden />
              </a>
            ) : (
              "Admin panelden playlist ekleyebilirsiniz."
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CANONICAL_RADIO_CATEGORIES.filter((c) => c !== "Diğer")
            .slice(0, 6)
            .map((category) => (
              <div
                key={category}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                aria-label={`${category} koleksiyonları`}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getRadioCoverFallback(category)}
                    alt=""
                    className="size-full object-cover opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/45">{category}</p>
                  <h3 className="mt-1 font-semibold text-white">Koleksiyon</h3>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 md:gap-16">
      {spotifyProfileUrl ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 md:px-5">
          <p className="text-sm text-white/65 flex items-center gap-2 min-w-0">
            <UserRound className="size-4 shrink-0 text-emerald-400/90" aria-hidden />
            <span>
              Tüm herkese açık listeler{" "}
              <span className="text-white/80 font-medium">noqta</span> Spotify profilinde.
            </span>
          </p>
          <a
            href={spotifyProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1DB954] px-4 py-2 text-sm font-medium text-black hover:bg-[#1ed760] transition shrink-0"
          >
            Profili aç
            <ExternalLink className="size-3.5 opacity-90" aria-hidden />
          </a>
        </div>
      ) : null}

      {featured.length > 0 && filter === "all" ? (
        <section aria-labelledby="radio-featured">
          <h2 id="radio-featured" className="mb-4 text-lg font-semibold tracking-tight md:text-xl">
            Öne çıkanlar
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((p) => (
              <PlaylistCard key={p.id} item={p} large />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="radio-filter">
        <h2 id="radio-filter" className="sr-only">
          Tür filtresi
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              filter === "all"
                ? "border-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                : "border-white/15 bg-white/5 text-white/75 hover:border-white/25 hover:bg-white/10",
            )}
          >
            Tümü
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                filter === c
                  ? "border-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                  : "border-white/15 bg-white/5 text-white/75 hover:border-white/25 hover:bg-white/10",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {filter === "all" ? (
        categories.map((category) => {
          const list = normalizedItems
            .filter((p) => p.normalizedCategory === category)
            .filter((p) => !p.featured);

          return (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <h2 id={`cat-${category}`} className="mb-4 text-lg font-semibold tracking-tight md:text-xl">
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "tr"))
                  .map((p) => (
                    <PlaylistCard key={p.id} item={p} />
                  ))}
              </div>
            </section>
          );
        })
      ) : (
        <section aria-labelledby={`cat-${filter}`}>
          <h2 id={`cat-${filter}`} className="mb-4 text-lg font-semibold tracking-tight md:text-xl">
            {filter}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "tr"))
              .map((p) => (
                <PlaylistCard key={p.id} item={p} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

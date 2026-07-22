import Link from "next/link";
import { ContentCard } from "@/components/layout/PageShell";
import {
  FURKAN_BIO_BY_PAGE,
  FURKAN_KARACA,
  FURKAN_PROFILE_IMAGE_URL,
  type FurkanBioPageKey,
} from "@/lib/content/furkan-karaca";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";

export async function FurkanBioCard({
  variant,
  className = "",
}: {
  variant: FurkanBioPageKey;
  className?: string;
}) {
  const { roleLabel, paragraphs } = FURKAN_BIO_BY_PAGE[variant];
  const overrides = await readSiteImageOverrides();
  const img = (resolveSiteImageUrl("furkan_bio_photo", overrides) ?? FURKAN_PROFILE_IMAGE_URL).trim();

  return (
    <ContentCard
      className={`border-border bg-card p-5 md:p-6 ${className}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {img ? (
          <div className="mx-auto shrink-0 sm:mx-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-border bg-muted sm:h-32 sm:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        ) : (
          <div
            className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-fuchsia-100 to-cyan-100 text-lg font-semibold text-foreground sm:mx-0 sm:h-32 sm:w-32"
            aria-hidden
          >
            FK
          </div>
        )}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-600">{roleLabel}</p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground md:text-2xl">{FURKAN_KARACA.name}</h2>
          <div className="mt-3 grid gap-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            href={FURKAN_KARACA.profileHref}
            className="mt-4 inline-flex text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 underline-offset-4 hover:underline"
          >
            Tam biyografi ve portfolyo →
          </Link>
        </div>
      </div>
    </ContentCard>
  );
}

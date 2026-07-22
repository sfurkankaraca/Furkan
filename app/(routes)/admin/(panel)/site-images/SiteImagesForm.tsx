"use client";

import UploadWidget from "@/components/UploadWidget";
import type { SiteImageSlot } from "@/lib/site-images/registry";
import { siteImagePageSectionLabel } from "@/lib/site-images/page-groups";
import { saveSiteImageSlot } from "./actions";

type Row = SiteImageSlot & {
  savedUrl: string;
  effectiveUrl: string | null;
};

export function SiteImagesForm({ rows }: { rows: Row[] }) {
  let lastPage = "";
  return (
    <div className="grid gap-8">
      {rows.map((slot) => {
        const inputId = `site-img-url-${slot.id}`;
        const showGroup = slot.page !== lastPage;
        lastPage = slot.page;

        return (
          <div key={slot.id} className="grid gap-4">
            {showGroup ? (
              <div className="border-b border-border pb-2 pt-2 first:pt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  {siteImagePageSectionLabel(slot.page)}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{slot.page}</p>
              </div>
            ) : null}

            <div className="rounded-xl border border-border bg-background/20 p-4 md:p-5 grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h4 className="text-base font-medium text-foreground">{slot.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{slot.description}</p>
                  {slot.defaultUrl ? (
                    <p className="text-xs text-muted-foreground mt-1">Kod varsayılanı: {slot.defaultUrl}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-start">
                <div className="w-40 shrink-0 aspect-video rounded-lg border border-border overflow-hidden bg-foreground/5">
                  {slot.effectiveUrl ? (
                    slot.mediaType === "video" ? (
                      <video src={slot.effectiveUrl} className="h-full w-full object-cover" controls muted playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slot.effectiveUrl} alt="" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground px-2 text-center">
                      {slot.mediaType === "video" ? "Video yok" : "Görsel yok"}
                    </div>
                  )}
                </div>

                <form action={saveSiteImageSlot} className="flex-1 min-w-[min(100%,280px)] grid gap-3">
                  <input type="hidden" name="slotId" value={slot.id} />
                  <label className="grid gap-1">
                    <span className="text-xs text-muted-foreground">Görsel URL (https… veya /public yolu)</span>
                    <input
                      id={inputId}
                      name="url"
                      type="text"
                      inputMode="url"
                      autoComplete="off"
                      defaultValue={slot.savedUrl}
                      placeholder="https://… veya /dosya.jpg"
                      className="rounded-xl bg-background border border-border px-3 py-2 text-foreground text-sm font-mono"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <UploadWidget
                      targetInputId={inputId}
                      buttonLabel={slot.mediaType === "video" ? "Video yükle (Blob)" : "Yükle (Blob)"}
                      accept={slot.mediaType === "video" ? "video/*" : "image/*"}
                      showHint={false}
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-foreground text-background px-3 py-2 text-sm font-medium hover:bg-white/90"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>

                {slot.savedUrl ? (
                  <form action={saveSiteImageSlot}>
                    <input type="hidden" name="slotId" value={slot.id} />
                    <input type="hidden" name="url" value="" />
                    <button
                      type="submit"
                      className="rounded-xl border border-border text-foreground/70 px-3 py-2 text-sm hover:bg-foreground/5"
                    >
                      Sıfırla
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { parseYoutubeUrl } from "@/lib/youtube/embed";

type Props = {
  eventsYoutubeLinesInitial: string;
  bookingYoutubeLinesInitial: string;
};

export function SiteYoutubeSettingsForm({ eventsYoutubeLinesInitial, bookingYoutubeLinesInitial }: Props) {
  const [eventsLines, setEventsLines] = useState(eventsYoutubeLinesInitial);
  const [bookingLines, setBookingLines] = useState(bookingYoutubeLinesInitial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  const eventsPreviewList = eventsLines
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const bookingPreviewList = bookingLines
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const invalidEvents = eventsPreviewList.filter((u) => !parseYoutubeUrl(u));
  const invalidBooking = bookingPreviewList.filter((u) => !parseYoutubeUrl(u));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/site", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventsYoutubeUrls: eventsPreviewList,
          bookingYoutubeUrls: bookingPreviewList,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMessage(typeof data?.error === "string" ? data.error : "Kayıt başarısız.");
        return;
      }
      setStatus("ok");
      setMessage("Kaydedildi. Birkaç saniye içinde sayfalarda görünür.");
    } catch {
      setStatus("err");
      setMessage("Ağ hatası.");
    }
  }

  return (
    <section className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-950/20 p-5 md:p-6 grid gap-5">
      <div>
        <h3 className="text-base font-semibold text-white">YouTube gömüleri</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Etkinlikler sayfasında üstte yatay kaydırmalı setler; booking sayfası altında liste. Her satıra bir link
          (youtube.com/watch, youtu.be, playlist).
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-5">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-foreground/70">Etkinlikler — set videoları (satır veya virgülle çoklu)</span>
          <textarea
            name="eventsYoutubeUrls"
            value={eventsLines}
            onChange={(e) => setEventsLines(e.target.value)}
            rows={4}
            placeholder={"https://youtu.be/…\nhttps://www.youtube.com/watch?v=…"}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm font-mono placeholder:text-white/25 resize-y min-h-[100px]"
          />
          {invalidEvents.length > 0 ? (
            <span className="text-xs text-amber-600">
              Tanınmayan satırlar: {invalidEvents.slice(0, 3).join(" · ")}
              {invalidEvents.length > 3 ? " …" : ""}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-foreground/70">Booking — set videoları (satır başı veya virgülle birden fazla)</span>
          <textarea
            name="bookingYoutubeUrls"
            value={bookingLines}
            onChange={(e) => setBookingLines(e.target.value)}
            rows={5}
            placeholder={"https://youtu.be/…\nhttps://www.youtube.com/watch?v=…"}
            className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm font-mono placeholder:text-white/25 resize-y min-h-[120px]"
          />
          {invalidBooking.length > 0 ? (
            <span className="text-xs text-amber-600">
              Tanınmayan satırlar: {invalidBooking.slice(0, 3).join(" · ")}
              {invalidBooking.length > 3 ? " …" : ""}
            </span>
          ) : null}
        </label>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="submit"
            disabled={status === "saving" || invalidEvents.length > 0 || invalidBooking.length > 0}
            className="rounded-xl bg-fuchsia-600 text-white px-4 py-2 text-sm font-medium hover:bg-fuchsia-500 disabled:opacity-40 disabled:pointer-events-none"
          >
            {status === "saving" ? "Kaydediliyor…" : "Kaydet"}
          </button>
          {status === "ok" ? <span className="text-sm text-emerald-600">{message}</span> : null}
          {status === "err" ? <span className="text-sm text-red-400">{message}</span> : null}
        </div>
      </form>
    </section>
  );
}

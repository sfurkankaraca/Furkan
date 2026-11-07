"use client";

import Link from "next/link";
import type { EventItem } from "@/components/EventCard";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/club-radio/i18n/client";
import { formatDate, intlLocale, type Lang } from "@/lib/club-radio/i18n/lang";
import { rich } from "@/lib/club-radio/i18n/rich";
import { EventPoster } from "@/components/events/EventPoster";

function dateParts(iso: string, lang: Lang): { day: string; mon: string; dow: string; time: string; year: string } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const f = (o: Intl.DateTimeFormatOptions) => formatDate(d, lang, o);
  const hasTime = /T\d{2}:\d{2}/.test(iso);
  return {
    day: f({ day: "numeric" }),
    mon: f({ month: "short" }).replace(".", ""),
    dow: f({ weekday: "long" }),
    year: f({ year: "numeric" }),
    time: hasTime ? f({ hour: "2-digit", minute: "2-digit", hour12: false }) : "",
  };
}

const pill = "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-bold uppercase tracking-[0.5px] no-underline";

/** Buluşmalar sayfası kartı: büyük afiş, tarih hapı, başlık, mekân/şehir ve bilet düğmesi. Bilet/başvuru mantığı önceki satırla aynı. */
export function EventFlyerCard({ event, archived = false }: { event: EventItem; archived?: boolean }) {
  const { isLoggedIn, club } = useAuth();
  const { lang, t } = useLang();
  const href = `/events/${event.id}`;
  const parts = event.date ? dateParts(event.date, lang) : null;
  const hasTicketing = Boolean(event.ticketing?.enabled && event.ticketing.priceTry > 0);
  const price = event.ticketing?.priceTry;
  const place = [event.venue, event.city].filter(Boolean).join(" · ") || event.city;
  const membersOnly = Boolean(event.membersOnly);
  const canBuyTicket = hasTicketing && (!membersOnly || club?.fullMember);

  const pillText = parts
    ? archived
      ? `${parts.day} ${parts.mon} ${parts.year}`
      : `${parts.day} ${parts.mon} ${parts.dow}${parts.time ? ` · ${parts.time}` : ""}`
    : t.events.dateTba;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616] transition hover:border-[#DDF76A]/60">
      <Link href={href} className="relative block aspect-[4/5] w-full overflow-hidden bg-[#0A0A0A] no-underline">
        <EventPoster
          image={event.image}
          title={event.title}
          dateLabel={pillText}
          alt={t.poster.coverAlt(event.title, place)}
          grayscale={archived}
          showFallbackTitle
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition duration-500 group-hover:scale-[1.02]"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.5px] ${
            archived ? "bg-[#0A0A0A]/85 text-[#F4F4EE]" : "bg-[#DDF76A] text-[#0A0A0A]"
          }`}
        >
          {pillText}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="cr-display m-0 text-balance text-[22px] normal-case leading-[1.05]" style={{ fontStretch: "112%" }}>
            <Link href={href} className="no-underline hover:text-[#DDF76A]">{event.title}</Link>
          </h3>
          {membersOnly ? (
            <span className="rounded-md border border-[#fcd34d]/50 bg-[#fcd34d]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#fcd34d]">
              {t.events.clubEvent}
            </span>
          ) : null}
        </div>
        {place ? <p className="m-0 text-[14px] text-[#A6A9A0]">{place}</p> : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {!archived && hasTicketing && canBuyTicket ? (
            <Link href={`${href}/bilet`} className={`${pill} bg-[#DDF76A] !text-[#0A0A0A]`}>
              {t.events.buyTicket}{price != null ? ` · ₺${Number(price).toLocaleString(intlLocale(lang))}` : ""}
            </Link>
          ) : !archived && hasTicketing && membersOnly ? (
            <Link
              href={isLoggedIn ? "/account/club" : `/login?next=${encodeURIComponent(`${href}/bilet`)}`}
              className={`${pill} border border-[#fcd34d]/60 text-[#fcd34d]`}
            >
              {isLoggedIn ? t.events.clubMembership : t.events.clubSignIn}
            </Link>
          ) : !archived && event.ctaUrl ? (
            <Link href={event.ctaUrl} className={`${pill} bg-[#DDF76A] !text-[#0A0A0A]`}>
              {t.events.apply}
            </Link>
          ) : null}
          <Link href={href} className={`${pill} border border-[#3A3A3A] text-[#F4F4EE] hover:border-[#F4F4EE]`}>
            {t.events.detail}
          </Link>
        </div>
        {event.socialUrl ? (
          <a
            href={event.socialUrl}
            target="_blank"
            rel="noopener"
            className="cr-ul self-start text-[13px] font-semibold text-[#C9CBC3] hover:text-[#DDF76A]"
          >
            {rich(t.events.viewOnSocial)}
          </a>
        ) : null}
      </div>
    </article>
  );
}

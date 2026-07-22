"use server";

import { sendAdminEventMail } from "@/lib/mail/send";
import { redirect } from "next/navigation";
import { readEventsJson, writeEventsJson } from "@/lib/server/events-store";
import { makeUniqueEventId } from "@/lib/event-id";
import type { EventOrganizer, EventTicketing, LineupItem, PublicEvent } from "@/lib/event-types";

export type PhotoItem = {
  url: string;
  title?: string;
  description?: string;
};

export type PlaylistItem = {
  djName: string;
  description?: string;
  avatarUrl?: string;
  spotifyEmbedUrl: string;
};

function parseNestedList<T extends Record<string, unknown>>(formData: FormData, prefix: string): T[] {
  const map = new Map<number, T>();
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(prefix + "[")) continue;
    const idxStart = prefix.length + 1;
    const idxEnd = key.indexOf("]", idxStart);
    if (idxEnd === -1) continue;
    const idx = Number(key.slice(idxStart, idxEnd));
    const fieldStart = key.indexOf("[", idxEnd + 1);
    const fieldEnd = key.indexOf("]", fieldStart + 1);
    if (fieldStart === -1 || fieldEnd === -1) continue;
    const field = key.slice(fieldStart + 1, fieldEnd);
    const existing = (map.get(idx) || {}) as T;
    (existing as Record<string, string>)[field] = String(value);
    map.set(idx, existing);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

function parseTicketing(formData: FormData): EventTicketing | undefined {
  const enabled = formData.get("ticketingEnabled") === "on";
  if (!enabled) return undefined;
  const priceRaw = String(formData.get("ticketingPrice") || "").trim();
  const priceTry = Number(priceRaw.replace(",", "."));
  if (!Number.isFinite(priceTry) || priceTry <= 0) {
    return { enabled: true, priceTry: 0 };
  }
  const maxPer = String(formData.get("ticketingMaxPerOrder") || "").trim();
  const cap = String(formData.get("ticketingTotalCap") || "").trim();
  const note = String(formData.get("ticketingNote") || "").trim();
  const ticketing: EventTicketing = {
    enabled: true,
    priceTry,
    note: note || undefined,
  };
  const maxPerOrder = maxPer ? Number(maxPer) : NaN;
  if (Number.isFinite(maxPerOrder) && maxPerOrder > 0) ticketing.maxPerOrder = maxPerOrder;
  const totalCap = cap ? Number(cap) : NaN;
  if (Number.isFinite(totalCap) && totalCap > 0) ticketing.totalCap = totalCap;
  return ticketing;
}

function parseGenres(formData: FormData): string[] | undefined {
  const raw = String(formData.get("genres") || "");
  const parts = raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function parseOrganizer(formData: FormData): EventOrganizer | undefined {
  const name = String(formData.get("organizerName") || "").trim();
  const imageUrl = String(formData.get("organizerImage") || "").trim();
  const href = String(formData.get("organizerUrl") || "").trim();
  if (!name && !imageUrl && !href) return undefined;
  return { name: name || undefined, imageUrl: imageUrl || undefined, href: href || undefined };
}

function parseDetailFields(formData: FormData): Partial<PublicEvent> {
  const subtitle = String(formData.get("subtitle") || "").trim();
  const endDateRaw = String(formData.get("endDate") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const venueAddress = String(formData.get("venueAddress") || "").trim();
  const venueMapQuery = String(formData.get("venueMapQuery") || "").trim();
  const rules = String(formData.get("rules") || "").trim();
  const genres = parseGenres(formData);
  const organizer = parseOrganizer(formData);
  const lineup = parseNestedList<LineupItem>(formData, "lineup").filter((l) => l.name);

  const out: Partial<PublicEvent> = {};
  if (subtitle) out.subtitle = subtitle;
  if (endDateRaw) {
    const d = new Date(endDateRaw);
    if (!Number.isNaN(d.getTime())) out.endDate = d.toISOString();
  }
  if (description) out.description = description;
  if (venueAddress) out.venueAddress = venueAddress;
  if (venueMapQuery) out.venueMapQuery = venueMapQuery;
  if (rules) out.rules = rules;
  if (genres?.length) out.genres = genres;
  if (organizer) out.organizer = organizer;
  if (lineup.length) out.lineup = lineup;
  return out;
}

export async function createEvent(formData: FormData) {
  const title = String(formData.get("title") || "");
  const date = String(formData.get("date") || "");
  const city = String(formData.get("city") || "");
  const venue = String(formData.get("venue") || "");
  const ctaUrlRaw = String(formData.get("ctaUrl") || "");
  const image = String(formData.get("image") || "");

  if (!title || !date || !city) {
    return { ok: false, error: "Zorunlu alanları doldurun" } as const;
  }

  const photos = parseNestedList<PhotoItem>(formData, "photos").filter((p) => p.url);
  const playlists = parseNestedList<PlaylistItem>(formData, "playlists").filter((p) => p.spotifyEmbedUrl && p.djName);

  const ctaUrl = ctaUrlRaw || "/events/apply";

  const events = await readEventsJson();
  const id = makeUniqueEventId(title, date, new Set(events.map((e) => e.id)));
  const ticketing = parseTicketing(formData);
  if (ticketing?.enabled && ticketing.priceTry <= 0) {
    return { ok: false, error: "Bilet satışı için geçerli bir fiyat girin" } as const;
  }

  const membersOnly = formData.get("membersOnly") === "on";
  const detail = parseDetailFields(formData);
  const event: PublicEvent = {
    id,
    title,
    date: new Date(date).toISOString(),
    city,
    venue: venue || undefined,
    ctaUrl,
    image: image || undefined,
    photos: photos.length ? photos : undefined,
    playlists: playlists.length ? playlists : undefined,
    ...(ticketing?.enabled ? { ticketing } : {}),
    ...(membersOnly ? { membersOnly: true } : {}),
    ...detail,
  };

  events.unshift(event);
  await writeEventsJson(events);

  await sendAdminEventMail({
    title,
    date,
    city,
    venue: venue || undefined,
    ctaUrl,
    image: image || undefined,
    note: ticketing?.enabled ? `Yeni etkinlik (bilet: ${ticketing.priceTry} TRY)` : "Yeni etkinlik eklendi",
  });
  redirect("/admin/events");
}

export async function updateEvent(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const title = String(formData.get("title") || "");
  const date = String(formData.get("date") || "");
  const city = String(formData.get("city") || "");
  const venue = String(formData.get("venue") || "");
  const ctaUrl = String(formData.get("ctaUrl") || "");
  const image = String(formData.get("image") || "");

  const photos = parseNestedList<PhotoItem>(formData, "photos").filter((p) => p.url);
  const playlists = parseNestedList<PlaylistItem>(formData, "playlists").filter((p) => p.spotifyEmbedUrl && p.djName);
  const ticketing = parseTicketing(formData);

  const subtitle = String(formData.get("subtitle") || "").trim();
  const endDateRaw = String(formData.get("endDate") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const venueAddress = String(formData.get("venueAddress") || "").trim();
  const venueMapQuery = String(formData.get("venueMapQuery") || "").trim();
  const rules = String(formData.get("rules") || "").trim();
  const genres = parseGenres(formData);
  const organizer = parseOrganizer(formData);
  const lineupParsed = parseNestedList<LineupItem>(formData, "lineup").filter((l) => l.name);

  const events = await readEventsJson();
  const next = events.map((e) => {
    if (e.id !== eventId) return e;
    const merged: PublicEvent = {
      ...e,
      title: title || e.title,
      date: date ? new Date(date).toISOString() : e.date,
      city: city || e.city,
      venue: venue || undefined,
      ctaUrl: ctaUrl || undefined,
      image: image || undefined,
      photos: photos.length ? photos : undefined,
      playlists: playlists.length ? playlists : undefined,
    };

    if (subtitle) merged.subtitle = subtitle;
    else delete merged.subtitle;
    if (endDateRaw) {
      const d = new Date(endDateRaw);
      if (!Number.isNaN(d.getTime())) merged.endDate = d.toISOString();
    } else delete merged.endDate;
    if (description) merged.description = description;
    else delete merged.description;
    if (venueAddress) merged.venueAddress = venueAddress;
    else delete merged.venueAddress;
    if (venueMapQuery) merged.venueMapQuery = venueMapQuery;
    else delete merged.venueMapQuery;
    if (rules) merged.rules = rules;
    else delete merged.rules;
    if (genres?.length) merged.genres = genres;
    else delete merged.genres;
    if (organizer) merged.organizer = organizer;
    else delete merged.organizer;
    if (lineupParsed.length) merged.lineup = lineupParsed;
    else delete merged.lineup;

    if (ticketing?.enabled) {
      if (ticketing.priceTry <= 0) return e;
      merged.ticketing = ticketing;
    } else {
      delete merged.ticketing;
    }

    merged.membersOnly = formData.get("membersOnly") === "on";
    if (!merged.membersOnly) delete merged.membersOnly;

    return merged;
  });

  await writeEventsJson(next);
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  if (!eventId) {
    return { ok: false, error: "eventId missing" } as const;
  }
  const events = await readEventsJson();
  const next = events.filter((e) => e.id !== eventId);
  await writeEventsJson(next);
  redirect("/admin/events");
}

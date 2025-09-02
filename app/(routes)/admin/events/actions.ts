"use server";

import { put, list } from "@vercel/blob";
import { sendAdminEventMail } from "@/lib/mail/send";
import { redirect } from "next/navigation";

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

export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  photos?: PhotoItem[];
  playlists?: PlaylistItem[];
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
    (existing as any)[field] = String(value);
    map.set(idx, existing);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

async function getEventsFromBlob(): Promise<AdminEvent[]> {
  try {
    const { blobs } = await list({ prefix: "noqta-events.json" });
    
    if (blobs.length > 0) {
      const latestBlob = blobs[blobs.length - 1];
      const response = await fetch(latestBlob.url, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.error("Error reading events from Blob:", error);
  }
  
  // Default events if none found
  return [
    {
      id: "perseid",
      title: "Perseid Meteor Yağmuru",
      date: "2024-08-12T21:00:00+03:00",
      city: "İstanbul",
      venue: "Belgrad Ormanı",
      ctaUrl: "/events/perseid/apply",
      image: "/events/perseid.jpeg",
      photos: [],
      playlists: []
    }
  ];
}

async function saveEventsToBlob(events: AdminEvent[]): Promise<void> {
  try {
    const data = JSON.stringify(events, null, 2);
    await put("noqta-events.json", data, { access: 'public', addRandomSuffix: false });
    console.log("Events saved to Blob successfully");
  } catch (error) {
    console.error("Error saving events to Blob:", error);
    throw error;
  }
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
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}-${date.slice(0, 10)}`;

  const events = await getEventsFromBlob();
  const event: AdminEvent = {
    id,
    title,
    date: new Date(date).toISOString(),
    city,
    venue: venue || undefined,
    ctaUrl,
    image: image || undefined,
    photos: photos.length ? photos : undefined,
    playlists: playlists.length ? playlists : undefined,
  };
  
  events.unshift(event);
  await saveEventsToBlob(events);

  await sendAdminEventMail({ title, date, city, venue: venue || undefined, ctaUrl, image: image || undefined, note: "Yeni etkinlik eklendi" });
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

  const events = await getEventsFromBlob();
  const next = events.map((e) => e.id === eventId ? {
    ...e,
    title: title || e.title,
    date: date ? new Date(date).toISOString() : e.date,
    city: city || e.city,
    venue: venue || undefined,
    ctaUrl: ctaUrl || undefined,
    image: image || undefined,
    photos: photos.length ? photos : undefined,
    playlists: playlists.length ? playlists : undefined,
  } : e);

  await saveEventsToBlob(next);
  redirect("/admin/events");
}



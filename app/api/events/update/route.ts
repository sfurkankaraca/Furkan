import { NextResponse } from "next/server";
import { readEventsJson, writeEventsJson } from "@/lib/server/events-store";
import type { PublicEvent } from "@/lib/event-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, newImage, title, date, city, venue, ctaUrl, photos, playlists, memberPhotosAdd } = body || {};

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const currentEvents = await readEventsJson();
    const idx = currentEvents.findIndex((e) => e.id === eventId);
    const mergeUpdates: Partial<PublicEvent> = {};
    if (newImage) mergeUpdates.image = newImage;
    if (title) mergeUpdates.title = title;
    if (date) mergeUpdates.date = date;
    if (city) mergeUpdates.city = city;
    if (venue !== undefined) mergeUpdates.venue = venue || undefined;
    if (ctaUrl !== undefined) mergeUpdates.ctaUrl = ctaUrl || undefined;
    if (Array.isArray(photos)) mergeUpdates.photos = photos;
    if (Array.isArray(playlists)) mergeUpdates.playlists = playlists;

    let nextList: PublicEvent[];
    if (idx !== -1) {
      const prev = currentEvents[idx] || {};
      let nextObj: PublicEvent = { ...prev, ...mergeUpdates };
      if (Array.isArray(memberPhotosAdd) && memberPhotosAdd.length > 0) {
        const prevMembers = Array.isArray(prev.memberPhotos) ? prev.memberPhotos : [];
        nextObj = { ...nextObj, memberPhotos: [...prevMembers, ...memberPhotosAdd] };
      }
      nextList = currentEvents.map((e, i) => (i === idx ? nextObj : e));
    } else {
      nextList = [
        ...currentEvents,
        {
          id: eventId,
          title: String(title || eventId),
          date: String(date || ""),
          city: String(city || ""),
          ...mergeUpdates,
          memberPhotos: Array.isArray(memberPhotosAdd) ? memberPhotosAdd : undefined,
        } as PublicEvent,
      ];
    }

    const { url } = await writeEventsJson(nextList);

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      updatedEvents: nextList,
      blobUrl: url,
      eventsBlobUrl: url,
    });
  } catch (error) {
    console.error("POST /api/events/update", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

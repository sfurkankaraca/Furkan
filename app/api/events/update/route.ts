import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log(">> POST /api/events/update tetiklendi");
    
    const body = await request.json();
    console.log(">> Request body:", body);
    
    const { eventId, newImage, title, date, city, venue, ctaUrl, photos, playlists, memberPhotosAdd } = body || {};
    
    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    // Read current events from Blob
    const { blobs } = await list({ prefix: "noqta-events.json" });
    let currentEvents: any[] = [];
    
    if (blobs.length > 0) {
      const latestBlob = blobs[blobs.length - 1];
      const response = await fetch(latestBlob.url, { cache: 'no-store' });
      if (response.ok) {
        currentEvents = await response.json();
      }
    }

    if (!Array.isArray(currentEvents)) currentEvents = [];

    const idx = currentEvents.findIndex((e: any) => e.id === eventId);
    const mergeUpdates: Record<string, any> = {};
    if (newImage) mergeUpdates.image = newImage;
    if (title) mergeUpdates.title = title;
    if (date) mergeUpdates.date = date;
    if (city) mergeUpdates.city = city;
    if (venue !== undefined) mergeUpdates.venue = venue || undefined;
    if (ctaUrl !== undefined) mergeUpdates.ctaUrl = ctaUrl || undefined;
    if (Array.isArray(photos)) mergeUpdates.photos = photos;
    if (Array.isArray(playlists)) mergeUpdates.playlists = playlists;

    if (idx !== -1) {
      const prev = currentEvents[idx] || {};
      let nextObj = { ...prev, ...mergeUpdates };
      // Append member photos if provided
      if (Array.isArray(memberPhotosAdd) && memberPhotosAdd.length > 0) {
        const prevMembers = Array.isArray(prev.memberPhotos) ? prev.memberPhotos : [];
        nextObj.memberPhotos = [...prevMembers, ...memberPhotosAdd];
      }
      currentEvents[idx] = nextObj;
    } else {
      currentEvents.push({ id: eventId, ...mergeUpdates, memberPhotos: Array.isArray(memberPhotosAdd) ? memberPhotosAdd : undefined });
    }
    
    const data = JSON.stringify(currentEvents, null, 2);
    const mainBlob = await put("noqta-events.json", data, {
      access: 'public',
      addRandomSuffix: false
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Event updated successfully",
      updatedEvents: currentEvents,
      blobUrl: mainBlob.url
    });
    
  } catch (error) {
    console.error(">> Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

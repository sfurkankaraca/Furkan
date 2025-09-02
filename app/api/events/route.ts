import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    console.log(">> GET /api/events tetiklendi");
    
    // Read events from Blob
    const { blobs } = await list({ prefix: "noqta-events.json" });
    let events = [];
    
    if (blobs.length > 0) {
      const latestBlob = blobs[blobs.length - 1];
      console.log(">> Latest events blob found:", latestBlob.url);
      
      try {
        const response = await fetch(latestBlob.url, { cache: 'no-store' });
        if (response.ok) {
          events = await response.json();
          console.log(">> Events loaded from Blob:", events.length);
        }
      } catch (err) {
        console.log(">> Failed to read from Blob, using default events");
        events = [
          {
            id: "perseid",
            title: "Perseid Meteor Yağmuru",
            date: "2024-08-12",
            city: "İstanbul",
            venue: "Belgrad Ormanı",
            ctaUrl: "/events/perseid/apply",
            image: "/events/perseid.jpeg",
            photos: [],
            playlists: []
          }
        ];
      }
    } else {
      console.log(">> No events blob found, using default events");
      events = [
        {
          id: "perseid",
          title: "Perseid Meteor Yağmuru",
          date: "2024-08-12",
          city: "İstanbul",
          venue: "Belgrad Ormanı",
          ctaUrl: "/events/perseid/apply",
          image: "/events/perseid.jpeg",
          photos: [],
          playlists: []
        }
      ];
    }
    
    console.log(">> Returning events:", events);
    return NextResponse.json(events);
    
  } catch (error) {
    console.error(">> Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

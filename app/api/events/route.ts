import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    console.log(">> GET /api/events tetiklendi");
    
    // Read events from Blob
    const { blobs } = await list({ prefix: "noqta-events.json" });
    let events = [] as any[];

    if (blobs.length > 0) {
      const exact = (blobs as any[]).find((b: any) => b.pathname === "noqta-events.json") || blobs[blobs.length - 1];
      console.log(">> Events blob chosen:", exact?.url);

      try {
        const response = await fetch(exact.url, { cache: 'no-store' });
        if (response.ok) {
          events = await response.json();
          console.log(">> Events loaded from Blob:", events.length);
        }
      } catch (err) {
        console.log(">> Failed to read from Blob, using default events");
        events = [
          {
            id: "noqta-b2b-dj-workshop-2025-10-02",
            title: "noqta B2B DJ Workshop",
            date: "2025-10-02T18:00:00+03:00",
            city: "İstanbul",
            venue: "noqta studyo",
            ctaUrl: "/academy/workshops/dj/apply",
            image: "/pexels-a-e-g-s-728750948-20557241.jpg",
          },
          {
            id: "dj-101-registrations-open",
            title: "DJ 101",
            date: "",
            city: "İstanbul",
            venue: "",
            ctaUrl: "/academy/labs/dj101/apply",
            image: undefined,
          },
        ];
      }
    } else {
      console.log(">> No events blob found, using default events");
      events = [
        {
          id: "noqta-b2b-dj-workshop-2025-10-02",
          title: "noqta B2B DJ Workshop",
          date: "2025-10-02T18:00:00+03:00",
          city: "İstanbul",
          venue: "noqta studyo",
          ctaUrl: "/academy/workshops/dj/apply",
          image: "/pexels-a-e-g-s-728750948-20557241.jpg",
        },
        {
          id: "dj-101-registrations-open",
          title: "DJ 101",
          date: "",
          city: "İstanbul",
          venue: "",
          ctaUrl: "/academy/labs/dj101/apply",
          image: undefined,
        },
      ];
    }
    
    console.log(">> Returning events:", events);
    return NextResponse.json(events);
    
  } catch (error) {
    console.error(">> Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { put } from '@vercel/blob';

export async function POST() {
  try {
    console.log("Setting up Vercel Blob database...");
    
    const EVENTS_BLOB_KEY = 'noqta-events.json';
    
    // Default events verilerini ekle
    const defaultEvents = [
      {
        id: "perseid",
        title: "Perseid Meteor Yağmuru",
        date: "2024-08-12T21:00:00+03:00",
        city: "İstanbul",
        venue: "Belgrad Ormanı",
        ctaUrl: "/events/perseid/apply",
        image: "/events/perseid.jpeg",
        photos: [
          {
            url: "https://images.unsplash.com/photo-1534796636912-3b95b3e5986e?w=800&h=600&fit=crop",
            title: "Meteor yağmuru",
            description: "Gece gökyüzünde meteorlar"
          },
          {
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            title: "Yıldızlı gece",
            description: "Açık gökyüzü"
          }
        ],
        playlists: [
          {
            djName: "DJ Cosmic",
            description: "Ambient ve elektronik müzik",
            avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX5Vy6DFOcx00?utm_source=generator"
          },
          {
            djName: "DJ Stellar",
            description: "Chill house ve deep techno",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX5Vy6DFOcx00?utm_source=generator"
          }
        ]
      },
      {
        id: "private-meteor-party-2025-08-12",
        title: "Private Meteor Party",
        date: "2025-08-12T21:00:00+03:00",
        city: "Kayseri",
        venue: "Somewhere near Felahiye",
        ctaUrl: "/events/apply",
        image: "/events/perseid.jpeg",
        photos: [],
        playlists: []
      }
    ];
    
    // Blob'a kaydet
    const data = JSON.stringify(defaultEvents, null, 2);
    const { url } = await put(EVENTS_BLOB_KEY, data, { access: 'public' });
    
    console.log("Vercel Blob database setup completed successfully:", url);
    
    return NextResponse.json({ 
      success: true, 
      message: "Vercel Blob database setup completed",
      events: defaultEvents,
      blobUrl: url
    });
    
  } catch (error) {
    console.error("Blob setup error:", error);
    return NextResponse.json({ 
      error: "Failed to setup Blob database", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

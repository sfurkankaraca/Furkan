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
  memberPhotos?: PhotoItem[];
  playlists?: PlaylistItem[];
};

// Static events data
export const staticEvents: AdminEvent[] = [
  {
    "id": "private-meteor-party-2025-08-12",
    "title": "Private Meteor Party",
    "date": "2025-08-12T21:00:00+03:00",
    "city": "Kayseri",
    "venue": "Somewhere near Felahiye",
    "ctaUrl": "/events/apply",
    "image": "/events/perseid.jpeg"
  }
];

export async function readEventsStatic(): Promise<AdminEvent[]> {
  return staticEvents;
}

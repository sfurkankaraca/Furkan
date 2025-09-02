import { put, list, del } from '@vercel/blob';

const EVENTS_BLOB_KEY = 'noqta-events.json';

export async function getEvents() {
  try {
    // Vercel Blob'dan events verilerini çek
    const { blobs } = await list({ prefix: EVENTS_BLOB_KEY });
    const eventsBlob = blobs.find(blob => blob.pathname === EVENTS_BLOB_KEY) || blobs.find(blob => blob.pathname.startsWith(EVENTS_BLOB_KEY));
    
    if (eventsBlob) {
      const response = await fetch(eventsBlob.url, { cache: 'no-store' });
      const events = await response.json();
      return events;
    } else {
      // İlk kez çalıştırıldığında default event'i ekle
      const defaultEvents = [
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
      await put(EVENTS_BLOB_KEY, data, { access: 'public', addRandomSuffix: false });
      
      return defaultEvents;
    }
  } catch (error) {
    console.error('Blob error:', error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const events = await getEvents();
    return events.find(event => event.id === id) || null;
  } catch (error) {
    console.error('Blob error:', error);
    return null;
  }
}

export async function updateEventImage(id: string, newImage: string) {
  try {
    const events = await getEvents();
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, image: newImage } : event
    );
    
    // Blob'a kaydet
    const data = JSON.stringify(updatedEvents, null, 2);
    await put(EVENTS_BLOB_KEY, data, { access: 'public', addRandomSuffix: false });
    
    return updatedEvents.find(event => event.id === id) || null;
  } catch (error) {
    console.error('Blob error:', error);
    return null;
  }
}

export async function createEvent(event: {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  photos?: any[];
  playlists?: any[];
}) {
  try {
    const events = await getEvents();
    const newEvents = [...events, event];
    
    // Blob'a kaydet
    const data = JSON.stringify(newEvents, null, 2);
    await put(EVENTS_BLOB_KEY, data, { access: 'public', addRandomSuffix: false });
    
    return event;
  } catch (error) {
    console.error('Blob error:', error);
    return null;
  }
}

export async function updateEvent(eventId: string, updates: Partial<any>) {
  try {
    const events = await getEvents();
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, ...updates } : event
    );
    
    // Blob'a kaydet
    const data = JSON.stringify(updatedEvents, null, 2);
    await put(EVENTS_BLOB_KEY, data, { access: 'public', addRandomSuffix: false });
    
    return updatedEvents.find(event => event.id === eventId) || null;
  } catch (error) {
    console.error('Blob error:', error);
    return null;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const events = await getEvents();
    const filteredEvents = events.filter(event => event.id !== eventId);
    
    // Blob'a kaydet
    const data = JSON.stringify(filteredEvents, null, 2);
    await put(EVENTS_BLOB_KEY, data, { access: 'public', addRandomSuffix: false });
    
    return true;
  } catch (error) {
    console.error('Blob error:', error);
    return false;
  }
}

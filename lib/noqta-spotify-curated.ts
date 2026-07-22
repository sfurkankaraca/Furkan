/**
 * noqta’nın Spotify kullanıcı profilindeki herkese açık playlist’ler.
 * Kaynak: https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm
 * (Profil güncellenirse buradaki ID’ler güncellenmeli.)
 */

export const NOQTA_SPOTIFY_PROFILE_URL =
  "https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm";

export type NoqtaSpotifyCuratedItem = {
  id: string;
  title: string;
  spotifyUrl: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  coverImage?: string | null;
};

/** Radyo sayfası + admin playlist satırı ile uyumlu ortak şekil */
export type RadioPlaylistRow = NoqtaSpotifyCuratedItem;

/** Profildeki 6 herkese açık koleksiyon */
export const NOQTA_SPOTIFY_CURATED_PLAYLISTS: NoqtaSpotifyCuratedItem[] = [
  {
    id: "noqt-house-collection",
    title: "Noqt House Collection",
    spotifyUrl: "https://open.spotify.com/playlist/12ruOTT6oEtdbKMXf1hfwB",
    category: "House",
    featured: true,
    sortOrder: 10,
  },
  {
    id: "noqt-hardgroove-collection",
    title: "Noqt Hardgroove Collection",
    spotifyUrl: "https://open.spotify.com/playlist/1g6iA7B1kIrZRk0hiQl5P0",
    category: "Techno",
    featured: true,
    sortOrder: 20,
  },
  {
    id: "noqt-afro-house-collection",
    title: "Noqt Afro House Collection",
    spotifyUrl: "https://open.spotify.com/playlist/1KGBPZOIaDtUAKKE0ajauZ",
    category: "House",
    featured: false,
    sortOrder: 30,
  },
  {
    id: "noqt-for-ladies",
    title: "Noqt for Ladies",
    spotifyUrl: "https://open.spotify.com/playlist/1SPTga3pT8jwrX341wlUfG",
    category: "R&B",
    featured: false,
    sortOrder: 40,
  },
  {
    id: "noqt-for-children",
    title: "Noqt for Children",
    spotifyUrl: "https://open.spotify.com/playlist/7ATXVunkuIHSGW68iWdbKB",
    category: "Pop",
    featured: false,
    sortOrder: 50,
  },
  {
    id: "noqt-workout",
    title: "Noqt Workout",
    spotifyUrl: "https://open.spotify.com/playlist/6jEOVDspfe4Tjq820YeQlW",
    category: "Hip Hop",
    featured: false,
    sortOrder: 60,
  },
];

function playlistIdFromSpotifyUrl(url: string): string | null {
  const m = url.trim().match(/playlist\/([a-zA-Z0-9]+)/);
  return m?.[1] ?? null;
}

/** Önce noqta Spotify koleksiyonları, ardından DB’deki ek playlist’ler; aynı Spotify playlist ID’si tekrarlanmaz. */
export function mergeWithNoqtaSpotifyPlaylists(dbItems: RadioPlaylistRow[]): RadioPlaylistRow[] {
  const seen = new Set<string>();
  const out: RadioPlaylistRow[] = [];

  for (const p of NOQTA_SPOTIFY_CURATED_PLAYLISTS) {
    const pid = playlistIdFromSpotifyUrl(p.spotifyUrl);
    if (pid) seen.add(pid);
    out.push({ ...p });
  }

  for (const p of dbItems) {
    const pid = playlistIdFromSpotifyUrl(p.spotifyUrl);
    if (pid && seen.has(pid)) continue;
    if (pid) seen.add(pid);
    out.push(p);
  }

  return out;
}

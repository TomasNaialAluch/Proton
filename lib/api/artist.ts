import { protonQuery } from "./protonApi";

export const NAIAL_ARTIST_ID = "88457";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProtonArtist {
  id: string;
  name: string;
  image: { url: string } | null;
}

export interface ProtonTrack {
  id: string;
  title: string;
  release: {
    id: string;
    name: string;
    date: string;
    label: { id: string; name: string };
  };
}

export interface ProtonArtistWithTracks extends ProtonArtist {
  tracks: ProtonTrack[];
}

// ── Queries ────────────────────────────────────────────────────────────────

const ARTIST_WITH_TRACKS_QUERY = `
  query GetArtistWithTracks($id: ID!) {
    artist(id: $id) {
      id
      name
      image { url }
      tracks {
        id
        title
        release {
          id
          name
          date
          label { id name }
        }
      }
    }
  }
`;

// ── Fetchers ───────────────────────────────────────────────────────────────

export async function fetchArtistWithTracks(
  id: string = NAIAL_ARTIST_ID
): Promise<ProtonArtistWithTracks> {
  const data = await protonQuery<{ artist: ProtonArtistWithTracks }>(
    "GetArtistWithTracks",
    ARTIST_WITH_TRACKS_QUERY,
    { id }
  );
  return data.artist;
}

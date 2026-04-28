import { protonQuery } from "./protonApi";
import { mockMixes } from "@/lib/mock/mixes";
import type { ProtonMix } from "@/types/mix";

// ── Queries ────────────────────────────────────────────────────────────────

const LATEST_MIXES_QUERY = `
  query GetLatestMixes($limit: Int, $genre: String) {
    mixes(limit: $limit, genre: $genre) {
      id
      title
      date
      youtubeId
      genre
      artist {
        id
        name
        image { url }
      }
    }
  }
`;

const MIX_BY_ID_QUERY = `
  query GetMix($id: ID!) {
    mix(id: $id) {
      id
      title
      date
      youtubeId
      genre
      artist {
        id
        name
        image { url }
      }
    }
  }
`;

// ── Fetchers ───────────────────────────────────────────────────────────────

export async function fetchLatestMixes(
  limit = 12,
  genre?: string
): Promise<ProtonMix[]> {
  try {
    const data = await protonQuery<{ mixes: ProtonMix[] }>(
      "GetLatestMixes",
      LATEST_MIXES_QUERY,
      { limit, genre }
    );
    return data.mixes;
  } catch {
    // API no expone esta query todavía — usar mock
    const mixes = genre
      ? mockMixes.filter((m) => m.genre.toLowerCase() === genre.toLowerCase())
      : mockMixes;
    return mixes.slice(0, limit);
  }
}

export async function fetchMixById(id: string): Promise<ProtonMix | null> {
  try {
    const data = await protonQuery<{ mix: ProtonMix }>(
      "GetMix",
      MIX_BY_ID_QUERY,
      { id }
    );
    return data.mix;
  } catch {
    return mockMixes.find((m) => m.id === id) ?? null;
  }
}

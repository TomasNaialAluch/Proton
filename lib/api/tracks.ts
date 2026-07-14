import { mockTracks } from "@/lib/mock/tracks";
import { mockMonthlyStreams } from "@/lib/mock/streams";
import type { Track } from "@/types/track";

// Simulates network delay — replace the body with a real fetch() call when the API is ready
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchTracks(): Promise<Track[]> {
  await delay(300);
  return mockTracks;
}

export async function fetchMonthlyStreams() {
  await delay(200);
  return mockMonthlyStreams;
}

export async function fetchTracksSummary() {
  await delay(150);
  const tracks = mockTracks;
  return {
    totalTracks: tracks.length,
    // Streams/sales aren't on `Track` (see types/track.ts) — they're sensitive,
    // access-scoped data. A real implementation would look them up per-track
    // for the authenticated owner, same as the Performance page already does.
    topTrack: tracks[0],
  };
}

import { mockTracks } from "@/lib/mock/tracks";
import { PEER_TRACKS } from "@/lib/mock/peerTracks";
import { mockMonthlyStreams } from "@/lib/mock/streams";
import type { Track } from "@/types/track";

// Simulates network delay — replace the body with a real fetch() call when the API is ready
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchTracks(): Promise<Track[]> {
  await delay(300);
  return mockTracks;
}

/**
 * Looks up a single track by id regardless of whose catalog it's in — a
 * real `GET /tracks/:id` endpoint wouldn't care whether the track belongs
 * to the authenticated producer or someone else, so this checks both
 * pools rather than assuming "my tracks." Needed by Feedback's
 * "pending to review" flow, which points at other producers' tracks. See
 * docs/feature-peer-feedback-tracks.md.
 */
export async function fetchTrackById(id: string): Promise<Track | undefined> {
  await delay(200);
  return mockTracks.find((t) => t.id === id) ?? PEER_TRACKS.find((t) => t.id === id);
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

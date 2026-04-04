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
    totalStreams: tracks.reduce((sum, t) => sum + t.streams, 0),
    totalSales: 1,
    topTrack: [...tracks].sort((a, b) => b.streams - a.streams)[0],
  };
}

import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import type { Track } from "@/types/track";

/**
 * `Track.artistId`/`artistIds` carry no display name on their own — the
 * preview bar needs one to show. Resolves against the roster (same lookup
 * `TrackRemixCard` uses for credited names), joining collabs with "&".
 */
export function resolveTrackArtistName(track: Track): string {
  const credited = track.artistIds ?? [track.artistId];
  const names = credited
    .map((id) => mockRosterArtists.find((a) => a.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  return names.length > 0 ? names.join(" & ") : "Unknown artist";
}

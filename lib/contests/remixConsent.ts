import { mockTracks } from "@/lib/mock/tracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";

function findTrack(trackId: string) {
  return LABEL_SAMPLE_TRACKS.find((t) => t.id === trackId) ?? mockTracks.find((t) => t.id === trackId);
}

/**
 * Whether at least one artist credited on this track has opted into
 * remix requests (`Artist.openToRemix`). A label putting a track up for
 * a remix contest isn't enough on its own — it's the artist's name and
 * credit on the release, so their consent gates whether the contest
 * actually opens up (stems + submission) or shows "Awaiting artist"
 * instead. This used to be a separate `remixOpportunities` approval
 * step; now it's just this check applied to any `activeContests` entry.
 * See docs/feature-contest-flow.md, "Merging remix opportunities into
 * contests".
 */
export function trackArtistsOptedInToRemix(trackId: string): boolean {
  const track = findTrack(trackId);
  if (!track) return false;
  const creditedIds = track.artistIds ?? [track.artistId];
  return creditedIds.some((id) => mockRosterArtists.find((a) => a.id === id)?.openToRemix);
}

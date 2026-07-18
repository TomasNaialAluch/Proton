import type { LabelArtistSuggestion } from "@/types/labelArtistSuggestion";

/**
 * Independent artists NOT on any label's roster — deliberately new
 * identities, distinct from `mockRosterArtists` (already-signed roster)
 * and the Feedback/Connections peers (Lume, Darko, Vesna, Kaiser — those
 * are shown elsewhere as already on labels, so reusing them here would
 * contradict "not yet signed"). See docs/feature-label-manager-toolkit.md.
 */
export const mockArtistSuggestions: LabelArtistSuggestion[] = [
  {
    id: "suggest-sudbeat-1",
    labelId: "2", // Sudbeat
    artist: {
      id: "solene-frost",
      name: "Solene Frost",
      genres: ["Progressive House", "Melodic House"],
      country: "France",
      bio: "Paris-based producer building long, emotive arrangements — three independent EPs so far, no label yet.",
    },
    reason: {
      type: "genre_fit",
      sharedGenres: ["Progressive"],
      highlights: [
        "Genre and tempo range line up closely with Sudbeat's current catalog",
        "Consistent independent release schedule over the last year — not a one-off",
      ],
    },
    status: "pending",
    createdAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "suggest-sudbeat-2",
    labelId: "2", // Sudbeat
    artist: {
      id: "nadir-cole",
      name: "Nadir Cole",
      genres: ["Progressive", "Deep House"],
      country: "Canada",
      bio: "Toronto producer and occasional live-set performer, self-released since 2024.",
    },
    reason: {
      type: "catalog_gap",
      sharedGenres: ["Progressive"],
      highlights: [
        "Leans deeper/darker than most of Sudbeat's current roster — could round out the catalog rather than duplicate it",
      ],
    },
    status: "pending",
    createdAt: "2026-07-08T09:00:00Z",
  },
  {
    id: "suggest-bedrock-1",
    labelId: "3", // Bedrock
    artist: {
      id: "marlowe-kade",
      name: "Marlowe Kade",
      genres: ["Techno", "Progressive"],
      country: "Germany",
      bio: "Berlin-based, peak-time focused productions with a hypnotic, track-driven style.",
    },
    reason: {
      type: "genre_fit",
      sharedGenres: ["Progressive", "Techno"],
      highlights: [
        "Production quality and peak-time focus match Bedrock's high bar closely",
        "Already played by a couple of DJs adjacent to Bedrock's usual lineup",
      ],
    },
    status: "pending",
    createdAt: "2026-07-05T09:00:00Z",
  },
];

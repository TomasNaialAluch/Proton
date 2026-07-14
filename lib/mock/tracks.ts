import type { Track } from "@/types/track";

export const mockTracks: Track[] = [
  // Release: Beyond Living — Toxic Astronaut (TA0118)
  { id: "1", title: "Sides (Original Mix)",                artistId: "naial", duration: 0, genre: "Melodic House", releaseDate: "2023-09-01", status: "published", audioUrl: "", coverUrl: "", bpm: 122, key: "A min",  labelSlug: "toxic-astronaut",  releaseName: "Beyond Living" },
  { id: "2", title: "Living (Original Mix)",               artistId: "naial", duration: 0, genre: "Melodic House", releaseDate: "2023-09-01", status: "published", audioUrl: "", coverUrl: "", bpm: 124, key: "F# min", labelSlug: "toxic-astronaut",  releaseName: "Beyond Living" },
  { id: "3", title: "Breach (Original Mix)",               artistId: "naial", duration: 0, genre: "Melodic House", releaseDate: "2023-09-01", status: "published", audioUrl: "", coverUrl: "", bpm: 123, key: "C min",  labelSlug: "toxic-astronaut",  releaseName: "Beyond Living" },

  // Release: Mind Altered — Outer Space (OSO107)
  { id: "6", title: "Dmt (Original Mix)",                  artistId: "naial", duration: 0, genre: "Progressive",   releaseDate: "2025-03-28", status: "published", audioUrl: "", coverUrl: "", bpm: 126, key: "G min",  labelSlug: "outer-space-oasis", releaseName: "Mind Altered" },
  { id: "7", title: "Does This to My Mind (Original Mix)", artistId: "naial", duration: 0, genre: "Progressive",   releaseDate: "2025-03-28", status: "published", audioUrl: "", coverUrl: "", bpm: 127, key: "D min",  labelSlug: "outer-space-oasis", releaseName: "Mind Altered" },

  // Release: Tied Inside — Outer Space (OSO176)
  { id: "4", title: "Emotional Damage (Original Mix)",     artistId: "naial", duration: 0, genre: "Progressive",   releaseDate: "2026-03-06", status: "published", audioUrl: "", coverUrl: "", bpm: 125, key: "E min",  labelSlug: "outer-space-oasis", releaseName: "Tied Inside" },
  { id: "5", title: "Tied Inside (Original Mix)",          artistId: "naial", duration: 0, genre: "Progressive",   releaseDate: "2026-03-06", status: "published", audioUrl: "", coverUrl: "", bpm: 124, key: "B min",  labelSlug: "outer-space-oasis", releaseName: "Tied Inside" },

  // Pending release: Dear Deer Music licensing agreement — release date TBA
  { id: "8", title: "JIK (Original Mix)",                  artistId: "naial", duration: 0, genre: "Melodic House", releaseDate: "", status: "pending", audioUrl: "", coverUrl: "", bpm: 124, key: "A min", labelSlug: "dear-deer-music", releaseName: "JIK / Never Leave" },
  { id: "9", title: "Never Leave (Original Mix)",          artistId: "naial", duration: 0, genre: "Melodic House", releaseDate: "", status: "pending", audioUrl: "", coverUrl: "", bpm: 122, key: "F min", labelSlug: "dear-deer-music", releaseName: "JIK / Never Leave" },
];

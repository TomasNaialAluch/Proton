import type { Track } from "@/types/track";

/**
 * Tracks belonging to OTHER producers (the "Feedback" peers — see
 * lib/mock/feedback.ts) — deliberately a separate pool from `mockTracks`
 * (`lib/mock/tracks.ts`, which is explicitly the logged-in producer's own
 * catalog). A pending-to-review request necessarily points at someone
 * else's track, so it can't resolve against "my tracks" without reusing
 * an id that isn't really theirs — that's exactly the bug this file
 * fixes. See docs/feature-peer-feedback-tracks.md.
 */
export const PEER_TRACKS: Track[] = [
  {
    id: "peer-vesna-1",
    title: "Afterglow",
    artistId: "vesna",
    duration: 421,
    genre: "Melodic House & Techno",
    releaseDate: "2026-05-12",
    status: "published",
    audioUrl: "",
    coverUrl: "",
    bpm: 123,
    key: "A min",
  },
  {
    id: "peer-lume-1",
    title: "Static Bloom",
    artistId: "lume",
    duration: 398,
    genre: "Progressive House",
    releaseDate: "2026-04-02",
    status: "published",
    audioUrl: "",
    coverUrl: "",
    bpm: 122,
    key: "F min",
  },
  {
    id: "peer-darko-1",
    title: "Hollow Spectrum",
    artistId: "darko",
    duration: 445,
    genre: "Deep House",
    releaseDate: "2026-03-20",
    status: "published",
    audioUrl: "",
    coverUrl: "",
    bpm: 120,
    key: "G min",
  },
];

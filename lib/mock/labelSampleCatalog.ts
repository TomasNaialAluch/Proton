/**
 * Sample catalog for the Label Detail prototype ("Recent releases" strip and
 * the Artist Roster it derives from). Same tracks shown for every label
 * until there's a real per-label catalog query (see docs/feature-labels-detail.md,
 * Roadmap). Retired `LabelDemoTrack` (a disconnected ad-hoc type) in favor of
 * this — these are real `Track[]` objects, crediting real artists from
 * `mockRosterArtists`, so Label Detail, Artist Detail, and Track Detail can
 * all read the same entity instead of three different shapes (see
 * docs/feature-track-detail.md).
 */

import type { Track } from "@/types/track";

/** Short banner copy shown in the UI. */
export const LABEL_DEMO_CATALOG_NOTICE =
  "Sample catalog: the same tracks are shown for every label in this prototype.";

export const LABEL_SAMPLE_TRACKS: Track[] = [
  {
    id: "demo-1",
    title: "Midnight Run",
    artistId: "naial",
    releaseName: "Spring Sampler 2026",
    releaseDate: "2026-04-02",
    duration: 402,
    genre: "Melodic House",
    bpm: 124,
    status: "published",
    audioUrl: "",
    coverUrl: "",
  },
  {
    id: "demo-2",
    title: "Weightless",
    artistId: "gmj",
    releaseName: "Horizons EP",
    releaseDate: "2026-03-18",
    duration: 432,
    genre: "Progressive",
    bpm: 122,
    status: "published",
    audioUrl: "",
    coverUrl: "",
    // Demonstrates the feedback-gating rule from (see docs/feature-track-detail.md): Track Detail only
    // shows a "leave feedback" action when this is true.
    openForFeedback: true,
    // Tied to a real label (unlike the rest of this shared sample) so the
    // per-track "request to remix" flow (see docs/feature-track-detail.md) has a real
    // conversation to land in end to end.
    labelSlug: "sudbeat",
  },
  {
    id: "demo-3",
    title: "Fading Signal",
    artistId: "matter",
    releaseName: "Signals LP",
    releaseDate: "2026-02-10",
    duration: 480,
    genre: "Techno",
    bpm: 128,
    status: "published",
    audioUrl: "",
    coverUrl: "",
    // Sudbeat approved this for remix (see lib/mock/labels.ts), but Matter
    // (the artist) has openToRemix: false — deliberately demonstrates that
    // label approval alone isn't enough; the artist has to say yes too.
    labelSlug: "sudbeat",
  },
  {
    id: "demo-4",
    title: "Open Horizons",
    artistId: "emily",
    releaseName: "South Series",
    releaseDate: "2026-01-22",
    duration: 465,
    genre: "Deep House",
    bpm: 120,
    status: "published",
    audioUrl: "",
    coverUrl: "",
    // Both gates pass here — Bedrock approved it AND Emily has openToRemix:
    // true — so this is the one sample track where "Request to remix"
    // actually renders end to end.
    labelSlug: "bedrock",
  },
  {
    id: "demo-5",
    title: "Pulse of the Earth",
    artistId: "naial",
    // Two artists credited — proves a track can represent a real collab,
    // not just a single producer (see docs/feature-track-detail.md).
    artistIds: ["naial", "gmj"],
    releaseName: "Earth Tones",
    releaseDate: "2025-12-05",
    duration: 550,
    genre: "Melodic House",
    bpm: 123,
    status: "published",
    audioUrl: "",
    coverUrl: "",
  },
  {
    id: "demo-6",
    title: "Solar Flare",
    artistId: "gmj",
    releaseName: "Night Drives",
    releaseDate: "2026-05-30",
    duration: 410,
    genre: "Progressive",
    bpm: 124,
    status: "published",
    audioUrl: "",
    coverUrl: "",
    // Has a real label but deliberately NO activeContests entry anywhere —
    // the case Track Detail's "Request a remix" fallback exists for (see
    // TrackRemixCard.tsx): the label hasn't opened a remix call yet, so a
    // producer can ask for one instead of seeing nothing at all.
    labelSlug: "hope-recordings",
  },
];

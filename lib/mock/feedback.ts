import type { Feedback, FeedbackProducer } from "@/types/feedback";

export const mockMe: FeedbackProducer = { id: "naial", name: "Naial" };

const peers: FeedbackProducer[] = [
  { id: "lume", name: "Lume" },
  { id: "darko", name: "Darko" },
  { id: "vesna", name: "Vesna" },
];

/** Feedback I already received from other producers, on my own tracks. */
export const mockReceivedFeedback: Feedback[] = [
  {
    id: "fb-1",
    trackId: "4", // Emotional Damage
    fromProducer: peers[0],
    toProducer: mockMe,
    scores: { groove: 8, percussion: 7, melody: 9, synthDesign: 6, mix: 7, arrangement: 8 },
    comment: "Hook principal muy fuerte. La percusión podría tener más punch en el segundo drop.",
    createdAt: "2026-06-18T10:30:00Z",
    read: false,
  },
  {
    id: "fb-2",
    trackId: "6", // Dmt
    fromProducer: peers[1],
    toProducer: mockMe,
    scores: { groove: 9, percussion: 9, melody: 6, synthDesign: 8, mix: 8, arrangement: 7 },
    comment: "Groove muy sólido. La melodía principal se siente un poco secundaria, le daría más protagonismo.",
    createdAt: "2026-06-15T18:05:00Z",
    read: true,
  },
  // Two more reviews on the same track (Dmt) — mock-only, added to demo how
  // the grouped "Received" view (docs/feature-peer-feedback-tracks.md)
  // handles several reviews on one track instead of just one.
  {
    id: "fb-3",
    trackId: "6", // Dmt
    fromProducer: peers[2],
    toProducer: mockMe,
    scores: { groove: 7, percussion: 6, melody: 8, synthDesign: 7, mix: 6, arrangement: 7 },
    comment: "Buena progresión melódica, pero el mix se siente un poco apretado en los graves.",
    createdAt: "2026-06-20T14:15:00Z",
    read: false,
  },
  {
    id: "fb-4",
    trackId: "6", // Dmt
    fromProducer: peers[0],
    toProducer: mockMe,
    scores: { groove: 8, percussion: 8, melody: 7, synthDesign: 9, mix: 8, arrangement: 8 },
    comment: "El diseño de sonido es lo más fuerte acá. Lo escucharía en un B2B sin dudarlo.",
    createdAt: "2026-06-22T09:40:00Z",
    read: false,
  },
];

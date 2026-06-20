import type { Feedback, FeedbackProducer, PendingFeedbackRequest } from "@/types/feedback";

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
];

/** Tracks (mine) assigned for me to review — no feedback submitted yet from my side. */
export const mockPendingToReview: PendingFeedbackRequest[] = [
  {
    id: "req-1",
    trackId: "2", // Living (standing in for a peer's track in this prototype catalog)
    fromProducer: peers[2],
    toProducer: mockMe,
    requestedAt: "2026-06-19T09:00:00Z",
  },
];

export interface FeedbackProducer {
  id: string;
  name: string;
}

export const FEEDBACK_CATEGORIES = [
  { key: "groove", label: "Groove / rhythm" },
  { key: "percussion", label: "Percussion" },
  { key: "melody", label: "Main melody / hook" },
  { key: "synthDesign", label: "Synth design" },
  { key: "mix", label: "Mix" },
  { key: "arrangement", label: "Arrangement / structure" },
] as const;

export type FeedbackCategoryKey = (typeof FEEDBACK_CATEGORIES)[number]["key"];

export type FeedbackScores = Partial<Record<FeedbackCategoryKey, number>>;

export interface Feedback {
  id: string;
  trackId: string;
  fromProducer: FeedbackProducer;
  toProducer: FeedbackProducer;
  scores: FeedbackScores;
  comment: string;
  createdAt: string;
  read: boolean;
  /** Set when this feedback is a reply to another feedback. */
  returnedFeedbackId?: string;
}

/** A track assigned for review that has no feedback submitted yet. */
export interface PendingFeedbackRequest {
  id: string;
  trackId: string;
  fromProducer: FeedbackProducer;
  toProducer: FeedbackProducer;
  requestedAt: string;
}

import type { FeedbackProducer } from "@/types/feedback";

export interface ConnectionPeer extends FeedbackProducer {
  label: string;
  genres: string[];
}

/** "similar" = matching strengths/weaknesses. "complementary" = each strong where the other is weak. */
export type ConnectionMatchType = "similar" | "complementary";

export interface ConnectionMatchReason {
  type: ConnectionMatchType;
  sharedGenres: string[];
  /** Short, human-readable explanations of the signal — always shown, never a black box. */
  highlights: string[];
}

export type ConnectionStatus = "pending" | "accepted_by_me" | "matched" | "declined";

export interface ConnectionSuggestion {
  id: string;
  peer: ConnectionPeer;
  reason: ConnectionMatchReason;
  status: ConnectionStatus;
  createdAt: string;
  /**
   * Mock-only: whether the other side already said yes. Drives the demo's instant-match
   * branch. The current producer never sees this value directly — per the no-incomodar
   * rule, you only ever know your own answer, never the other side's, until both match.
   */
  peerAlreadyAccepted: boolean;
  /** Set once both sides accept. */
  conversationId?: string;
}

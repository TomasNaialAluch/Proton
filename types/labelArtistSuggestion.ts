/**
 * An artist NOT currently on this label's roster, suggested as worth
 * reaching out to. Mirrors `ConnectionSuggestion` (types/connection.ts) —
 * same "why this pairing" reasoning card the producer side already uses
 * for Connections — but label→artist instead of producer→producer, and
 * one-way (the label decides to reach out or not; there's no mutual
 * double opt-in the way producer connections work, since this product
 * connects labels with artists, not labels matching each other — see
 * docs/README-routing-architecture.md). See
 * docs/feature-label-manager-toolkit.md, "1. Artist suggestions".
 */
export interface LabelArtistSuggestionPeer {
  id: string;
  name: string;
  genres: string[];
  country?: string;
  bio?: string;
}

export type LabelArtistMatchType = "genre_fit" | "catalog_gap";

export interface LabelArtistMatchReason {
  type: LabelArtistMatchType;
  sharedGenres: string[];
  /** Short, human-readable explanations of the signal — always shown, never a black box. */
  highlights: string[];
}

export type LabelArtistSuggestionStatus = "pending" | "contacted" | "dismissed";

export interface LabelArtistSuggestion {
  id: string;
  /** Which label this suggestion is for — matches `ProtonLabel.id`, same key `labelScopeStore.activeLabelId` uses. */
  labelId: string;
  artist: LabelArtistSuggestionPeer;
  reason: LabelArtistMatchReason;
  status: LabelArtistSuggestionStatus;
  createdAt: string;
  /** Set once the label reaches out. */
  conversationId?: string;
}

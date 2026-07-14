export interface ProtonLabel {
  id: string;
  name: string;
  slug: string;
  image: { url: string } | null;
  artistCount?: number;
  genres?: string[];
  description?: string;

  // browser + detail enrichment
  releaseCount?: number;
  lastReleaseDate?: string;
  demoStatus?: "open" | "closed" | "unknown";
  demoGenres?: string[];
  featured?: boolean;
  foundedYear?: number;
  beatportUrl?: string;

  // detail page — demo policy (label-reported)
  demoPolicy?: {
    preferredFormat?: "wav" | "mp3" | "either";
    estimatedResponseTime?: string;
    notes?: string;
  };

  // detail page — action surfaces
  activeContests?: {
    id: string;
    title: string;
    description: string;
    deadline?: string;
    prize?: string;
  }[];

  /**
   * Tracks the LABEL has approved for remix — this is step 1 of a 2-step
   * approval (label, then the credited artist). References a real `Track`
   * by id instead of free-text title/artist so it can be checked against
   * that track's `openToRemix` artist(s) — see docs/feature-track-detail.md,
   * "The 2-step remix approval". A track only becomes actually requestable
   * once both the label AND the artist have said yes.
   */
  remixOpportunities?: {
    id: string;
    trackId: string;
    deadline?: string;
  }[];
}

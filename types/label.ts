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

  /**
   * A remix call against a track the label already owns — not a ranked
   * competition (no places, no prize tiers). References a real `Track` by
   * id, so it can be checked against that track's `openToRemix` artist(s):
   * a contest only actually opens up (stems + submission) once the
   * credited artist(s) have also opted in — the label putting a track up
   * isn't enough on its own, since it's the artist's name on the release.
   * This used to be two separate systems (a `remixOpportunities` list
   * with only a text-message "request" and no way to get the stems, plus
   * this `activeContests` list) — merged into one, see
   * docs/feature-contest-flow.md, "Merging remix opportunities into
   * contests".
   */
  activeContests?: {
    id: string;
    title: string;
    description: string;
    trackId: string;
    deadline?: string;
    prize?: string;
  }[];
}

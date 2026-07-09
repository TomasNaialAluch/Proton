export interface ProtonLabel {
  id: string;
  name: string;
  slug: string;
  image: { url: string } | null;
  artistCount?: number;
  genres?: string[];
  /** Shown on the label's profile page — what they're about, what they're looking for. */
  description?: string;
}

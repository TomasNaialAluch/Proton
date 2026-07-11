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
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  duration: number;
  genre: string;
  releaseDate: string;
  status: "draft" | "pending" | "published";
  audioUrl: string;
  coverUrl: string;
  streams: number;
  /** Catalog metadata set by the label manager — not derived in the feedback flow. */
  bpm?: number;
  key?: string;
  /** Opt-in, set by the credited producer — exposes this track in the cross-label Discover feed. Default false. */
  openForFeedback?: boolean;
}

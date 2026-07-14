export interface Track {
  id: string;
  title: string;
  /** Primary credited artist — kept for backward compat with existing single-artist reads. */
  artistId: string;
  /** All artists credited on this track, including `artistId`. Falls back to `[artistId]`
   *  when absent, so a track can represent a collab between two (or more) artists without
   *  every existing single-artist track needing to be updated. */
  artistIds?: string[];
  duration: number;
  genre: string;
  releaseDate: string;
  status: "draft" | "pending" | "published";
  audioUrl: string;
  coverUrl: string;
  /** Catalog metadata set by the label manager — not derived in the feedback flow. */
  bpm?: number;
  key?: string;
  /** Opt-in, set by the credited producer — exposes this track in the cross-label Discover feed. Default false. */
  openForFeedback?: boolean;
  /** Which label released this track, if any — lets Label Detail read a label's real catalog. */
  labelSlug?: string;
  /** The release/EP/LP/single this track is part of, for display (e.g. "Horizons EP"). */
  releaseName?: string;
}

/**
 * Streams/sales are deliberately NOT on this type — see
 * docs/README-security.md #1 and docs/feature-track-detail.md.
 * That data is sensitive (only the track's own artist and the label with
 * distribution rights should see it) and lives in access-scoped lookups
 * instead (e.g. `TRACK_STREAMS`/`TRACK_SALES` in lib/mock/performance.ts),
 * never on the object a producer's Track Detail page can read for someone
 * else's track.
 */

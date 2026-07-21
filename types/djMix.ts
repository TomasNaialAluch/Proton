export type DjMixStatus = "in_development" | "published";

/**
 * One row of a mix's tracklist. Most tracks a DJ plays in a mix are NOT
 * on Proton at all — Proton distributes ~1500 labels, a small slice of
 * all electronic music — so a tracklist entry is free text by default
 * (`name`), and only carries `trackId` when it was actually matched
 * against a track that exists in Proton's own catalog (autocomplete while
 * typing). See docs/analisis-platform-integracion.md.
 */
export interface DjMixTracklistEntry {
  name: string;
  trackId?: string;
}

/**
 * A DJ mix a producer submits — mirrors the real SoundSystem "Create New
 * Mix" flow.
 */
export interface DjMix {
  id: string;
  title: string;
  artistId: string;
  tracklist: DjMixTracklistEntry[];
  status: DjMixStatus;
  createdAt: string;
}

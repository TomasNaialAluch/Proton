import type { DjMixTracklistEntry } from "@/types/djMix";

export type ShowSubmissionStatus = "pending" | "reviewed";

/**
 * A demo submitted for consideration as a Proton Radio show — its own
 * upload, not a reference to something else. Very close in shape to
 * `DjMix` (title, genre, description, tracklist) since a show submission
 * really is just an uploaded set; the one real difference is Proton
 * turning an accepted submission into a broadcast/video afterward, which
 * isn't something the producer does. Real product is invitation-only
 * (mailto to Bonnie, no form at all); this is the prototype's real,
 * saved-locally equivalent. See docs/analisis-platform-integracion.md.
 */
export interface ShowSubmission {
  id: string;
  artistId: string;
  title: string;
  genre: string;
  description?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  tracklist: DjMixTracklistEntry[];
  status: ShowSubmissionStatus;
  createdAt: string;
}

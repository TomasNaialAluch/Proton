export type SubmissionStatus = "sent" | "listening" | "accepted" | "passed";

export interface LabelSubmission {
  id: string;
  /** Legacy submissions (before the direct-upload flow) reference an existing catalog track. */
  trackId?: string;
  /** New submissions are a raw demo file the producer uploads, not yet a catalog track. */
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  genre?: string;
  labelSlug: string;
  note: string;
  status: SubmissionStatus;
  sentAt: string;
  respondedAt: string | null;
}

export type SubmissionStatus = "sent" | "listening" | "accepted" | "passed";

export interface LabelSubmission {
  id: string;
  trackId: string;
  labelSlug: string;
  note: string;
  status: SubmissionStatus;
  sentAt: string;
  respondedAt: string | null;
}

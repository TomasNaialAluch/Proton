import type { LabelSubmission } from "@/types/submission";

export const mockLabelSubmissions: LabelSubmission[] = [
  {
    id: "s4",
    trackId: "8",
    labelSlug: "dear-deer-music",
    note: "Two originals — JIK and Never Leave. Open to a licensing deal.",
    status: "accepted",
    sentAt: "2026-02-14",
    respondedAt: "2026-03-05",
  },
  {
    id: "s3",
    trackId: "4",
    labelSlug: "hope-recordings",
    note: "Would love this on Hope — fits the label's melodic/progressive sound.",
    status: "listening",
    sentAt: "2026-06-30",
    respondedAt: null,
  },
  {
    id: "s2",
    trackId: "6",
    labelSlug: "bedrock",
    note: "",
    status: "passed",
    sentAt: "2026-05-18",
    respondedAt: "2026-05-24",
  },
  {
    id: "s1",
    trackId: "2",
    labelSlug: "sudbeat",
    note: "First submission — open to feedback either way.",
    status: "sent",
    sentAt: "2026-07-04",
    respondedAt: null,
  },
];

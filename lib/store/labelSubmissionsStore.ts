import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockLabelSubmissions } from "@/lib/mock/labelSubmissions";
import type { LabelSubmission } from "@/types/submission";

interface LabelSubmissionsState {
  submissions: LabelSubmission[];
  submitTrack: (input: { trackId: string; labelSlug: string; note: string }) => void;
}

export const useLabelSubmissionsStore = create<LabelSubmissionsState>()(
  persist(
    (set) => ({
      submissions: mockLabelSubmissions,
      submitTrack: ({ trackId, labelSlug, note }) =>
        set((state) => ({
          submissions: [
            {
              id: `s${Date.now()}`,
              trackId,
              labelSlug,
              note,
              status: "sent",
              sentAt: new Date().toISOString().slice(0, 10),
              respondedAt: null,
            },
            ...state.submissions,
          ],
        })),
    }),
    { name: "proton-label-submissions" }
  )
);

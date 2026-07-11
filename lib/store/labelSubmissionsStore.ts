import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockLabelSubmissions } from "@/lib/mock/labelSubmissions";
import type { LabelSubmission } from "@/types/submission";

interface LabelSubmissionsState {
  submissions: LabelSubmission[];
  submitTrack: (input: {
    labelSlug: string;
    note: string;
    genre: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }) => void;
}

export const useLabelSubmissionsStore = create<LabelSubmissionsState>()(
  persist(
    (set) => ({
      submissions: mockLabelSubmissions,
      submitTrack: ({ labelSlug, note, genre, fileName, fileType, fileSize }) =>
        set((state) => ({
          submissions: [
            {
              id: `s${Date.now()}`,
              labelSlug,
              note,
              genre,
              fileName,
              fileType,
              fileSize,
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

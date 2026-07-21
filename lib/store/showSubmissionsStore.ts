import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShowSubmission } from "@/types/showSubmission";
import type { DjMixTracklistEntry } from "@/types/djMix";

interface ShowSubmissionsState {
  submissions: ShowSubmission[];
  submitDemo: (input: {
    artistId: string;
    title: string;
    genre: string;
    description?: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    tracklist: DjMixTracklistEntry[];
  }) => string;
}

export const useShowSubmissionsStore = create<ShowSubmissionsState>()(
  persist(
    (set) => ({
      submissions: [],

      submitDemo: (input) => {
        const id = `show-submission-${Date.now()}`;
        set((state) => ({
          submissions: [
            { id, status: "pending", createdAt: new Date().toISOString(), ...input },
            ...state.submissions,
          ],
        }));
        return id;
      },
    }),
    { name: "proton-show-submissions" }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProtonLabel } from "@/types/label";

export type LabelContest = NonNullable<ProtonLabel["activeContests"]>[number];

interface ContestsState {
  /** Contests created by the label-manager, on top of the ones seeded in
   *  `lib/mock/labels.ts`. Keyed by `labelId` since a contest doesn't carry
   *  that field itself (same shape as `ProtonLabel.activeContests`). */
  extraContests: { labelId: string; contest: LabelContest }[];
  createContest: (input: {
    labelId: string;
    title: string;
    description: string;
    trackId: string;
    deadline?: string;
    prize?: string;
  }) => string;
}

export const useContestsStore = create<ContestsState>()(
  persist(
    (set) => ({
      extraContests: [],

      createContest: ({ labelId, title, description, trackId, deadline, prize }) => {
        const id = `contest-${labelId}-${Date.now()}`;
        set((state) => ({
          extraContests: [
            ...state.extraContests,
            { labelId, contest: { id, title, description, trackId, ...(deadline ? { deadline } : {}), ...(prize ? { prize } : {}) } },
          ],
        }));
        return id;
      },
    }),
    { name: "proton-label-manager-contests" }
  )
);

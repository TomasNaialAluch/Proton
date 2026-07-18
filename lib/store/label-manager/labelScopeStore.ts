"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Naial's real, signed label in the mock data — contract `r4` ("Beyond
 * Living", already `signed`, see `lib/mock/contracts.ts`), plus a contest
 * already seeded on his own track "Living" (`lib/mock/labels.ts`).
 *
 * Label-manager view is scoped to being the manager of THIS ONE label,
 * mirroring how the producer view is scoped to one producer (Naial) —
 * not a free switcher across all 19 mock labels as if one account ran
 * every label on the platform simultaneously. See
 * docs/label-manager-qa-plan.md, item 5 ("elegí una label... va a ser
 * el caso de uso de como si fuésemos label manager de esa label").
 */
export const LABEL_MANAGER_LABEL_ID = "6";

interface LabelScopeState {
  /** Fixed — there is exactly one label in this scope, not a settable field. */
  readonly activeLabelId: string;
  /** Optional zoom: focus on a single artist within the label's own roster. */
  activeArtistId: string | null;
  setActiveArtist: (artistId: string) => void;
  clearActiveArtist: () => void;
}

export const useLabelScopeStore = create<LabelScopeState>()(
  persist(
    (set) => ({
      activeLabelId: LABEL_MANAGER_LABEL_ID,
      activeArtistId: null,
      setActiveArtist: (artistId) => set({ activeArtistId: artistId }),
      clearActiveArtist: () => set({ activeArtistId: null }),
    }),
    {
      name: "proton-label-scope",
      // Bumped: the old shape (mode / setAllLabels / setActiveLabel) is gone.
      // migrate() drops the stale persisted shape entirely instead of just
      // logging a "couldn't be migrated" warning on every load forever —
      // only `activeArtistId` (still a real field) survives the upgrade.
      version: 2,
      migrate: (persisted) => {
        // Default `merge` shallow-merges this into the real initial state,
        // so omitting the action functions here is fine — they come from
        // `currentState`, only the two data fields need a real value.
        const old = persisted as { activeArtistId?: string | null } | undefined;
        return {
          activeLabelId: LABEL_MANAGER_LABEL_ID,
          activeArtistId: old?.activeArtistId ?? null,
        } as LabelScopeState;
      },
    }
  )
);

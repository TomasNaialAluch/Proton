"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LabelScopeMode = "all_labels" | "label";

interface LabelScopeState {
  mode: LabelScopeMode;
  /** When mode === "label", the active label id. */
  activeLabelId: string | null;
  /** Optional zoom: focus on a single artist within the active scope. */
  activeArtistId: string | null;
  setAllLabels: () => void;
  setActiveLabel: (labelId: string) => void;
  setActiveArtist: (artistId: string) => void;
  clearActiveArtist: () => void;
}

export const useLabelScopeStore = create<LabelScopeState>()(
  persist(
    (set) => ({
      mode: "label",
      activeLabelId: "1",
      activeArtistId: null,
      setAllLabels: () =>
        set({ mode: "all_labels", activeLabelId: null, activeArtistId: null }),
      setActiveLabel: (labelId) =>
        set({ mode: "label", activeLabelId: labelId, activeArtistId: null }),
      setActiveArtist: (artistId) => set({ activeArtistId: artistId }),
      clearActiveArtist: () => set({ activeArtistId: null }),
    }),
    {
      name: "proton-label-scope",
      version: 1,
    }
  )
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PrototypeView = "producer" | "label_manager";

interface PrototypeViewState {
  view: PrototypeView;
  setView: (view: PrototypeView) => void;
}

export const usePrototypeViewStore = create<PrototypeViewState>()(
  persist(
    (set) => ({
      view: "producer",
      setView: (view) => set({ view }),
    }),
    {
      name: "proton-prototype-view",
      version: 1,
      partialize: (state) => ({ view: state.view }),
    }
  )
);


import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProtonLabel } from "@/types/label";

export interface DemoPolicyOverride {
  demoStatus?: ProtonLabel["demoStatus"];
  demoGenres?: string[];
  demoPolicy?: NonNullable<ProtonLabel["demoPolicy"]>;
}

interface DemoPolicyState {
  /** Keyed by `ProtonLabel.id`. Only set once a label-manager actually
   *  edits their label's demo policy — everything else keeps reading the
   *  mock-seeded fields on `ProtonLabel` unchanged. */
  overrides: Record<string, DemoPolicyOverride>;
  setDemoPolicy: (labelId: string, override: DemoPolicyOverride) => void;
}

export const useDemoPolicyStore = create<DemoPolicyState>()(
  persist(
    (set) => ({
      overrides: {},
      setDemoPolicy: (labelId, override) =>
        set((state) => ({ overrides: { ...state.overrides, [labelId]: override } })),
    }),
    { name: "proton-label-manager-demo-policy" }
  )
);

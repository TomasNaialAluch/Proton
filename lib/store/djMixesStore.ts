import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DjMix, DjMixTracklistEntry } from "@/types/djMix";

interface DjMixesState {
  mixes: DjMix[];
  createMix: (input: { artistId: string; title: string; tracklist: DjMixTracklistEntry[] }) => string;
  publishMix: (id: string) => void;
}

export const useDjMixesStore = create<DjMixesState>()(
  persist(
    (set) => ({
      mixes: [],

      createMix: ({ artistId, title, tracklist }) => {
        const id = `mix-${Date.now()}`;
        set((state) => ({
          mixes: [
            { id, artistId, title, tracklist, status: "in_development", createdAt: new Date().toISOString() },
            ...state.mixes,
          ],
        }));
        return id;
      },

      publishMix: (id) =>
        set((state) => ({
          mixes: state.mixes.map((m) => (m.id === id ? { ...m, status: "published" } : m)),
        })),
    }),
    { name: "proton-dj-mixes" }
  )
);

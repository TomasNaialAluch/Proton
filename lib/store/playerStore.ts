import { create } from "zustand";
import type { ProtonMix } from "@/types/mix";

interface PlayerState {
  currentMix: ProtonMix | null;
  isPlaying: boolean;
  queue: ProtonMix[];
  play: (mix: ProtonMix) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setQueue: (mixes: ProtonMix[]) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentMix: null,
  isPlaying: false,
  queue: [],
  play: (mix) => set({ currentMix: mix, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  toggle: () => set({ isPlaying: !get().isPlaying }),
  setQueue: (mixes) => set({ queue: mixes }),
}));

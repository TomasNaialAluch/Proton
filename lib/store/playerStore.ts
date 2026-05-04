import { create } from "zustand";
import type { ProtonMix } from "@/types/mix";

export type PlayerChrome = "expanded" | "minimized";
export type PlaybackSource = "audio" | "youtube";

interface PlayerState {
  currentMix: ProtonMix | null;
  isPlaying: boolean;
  queue: ProtonMix[];
  /** Barra completa vs FAB flotante */
  playerChrome: PlayerChrome;
  /** Motor activo: audio HTML5 o reproductor embebido de YouTube */
  playbackSource: PlaybackSource | null;
  /** Mix pendiente de elección (pestaña vs mini) */
  youtubeChoiceMix: ProtonMix | null;
  play: (mix: ProtonMix, source?: PlaybackSource) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setQueue: (mixes: ProtonMix[]) => void;
  setPlayerChrome: (chrome: PlayerChrome) => void;
  setYoutubeChoiceMix: (mix: ProtonMix | null) => void;
  /** Cierra el reproductor (quita el mix y limpia cola / estado de UI). */
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentMix: null,
  isPlaying: false,
  queue: [],
  playerChrome: "expanded",
  playbackSource: null,
  youtubeChoiceMix: null,
  play: (mix, source = "audio") =>
    set({
      currentMix: mix,
      isPlaying: true,
      playbackSource: source,
      youtubeChoiceMix: null,
      /** Vídeo embebido: barra completa para no quedar en FAB sin superficie para el iframe. */
      ...(source === "youtube" ? { playerChrome: "expanded" as const } : {}),
    }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  toggle: () => set({ isPlaying: !get().isPlaying }),
  setQueue: (mixes) => set({ queue: mixes }),
  setPlayerChrome: (chrome) => set({ playerChrome: chrome }),
  setYoutubeChoiceMix: (mix) => set({ youtubeChoiceMix: mix }),
  clearPlayer: () =>
    set({
      currentMix: null,
      isPlaying: false,
      queue: [],
      playerChrome: "expanded",
      playbackSource: null,
      youtubeChoiceMix: null,
    }),
}));
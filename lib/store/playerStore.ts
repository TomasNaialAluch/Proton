import { create } from "zustand";
import type { ProtonMix } from "@/types/mix";
import type { YoutubeVideoHints } from "@/lib/youtube/youtubeVideoHints";

export type PlayerChrome = "expanded" | "minimized";
export type PlaybackSource = "audio" | "youtube";

export type YoutubeMiniBlockedPayload = {
  mix: ProtonMix;
  hints: YoutubeVideoHints;
};

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
  /** Metadatos del vídeo (Data API) para avisos en el mini player */
  youtubePlaybackHints: YoutubeVideoHints | null;
  /** Mini player no permitido (privado, sin embed, etc.) */
  youtubeMiniBlocked: YoutubeMiniBlockedPayload | null;
  /** Error reportado por la IFrame API al reproducir */
  youtubeEmbedError: string | null;
  play: (
    mix: ProtonMix,
    source?: PlaybackSource,
    opts?: { youtubeHints?: YoutubeVideoHints | null }
  ) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setQueue: (mixes: ProtonMix[]) => void;
  setPlayerChrome: (chrome: PlayerChrome) => void;
  setYoutubeChoiceMix: (mix: ProtonMix | null) => void;
  setYoutubeMiniBlocked: (payload: YoutubeMiniBlockedPayload | null) => void;
  setYoutubeEmbedError: (message: unknown) => void;
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
  youtubePlaybackHints: null,
  youtubeMiniBlocked: null,
  youtubeEmbedError: null,
  play: (mix, source = "audio", opts) =>
    set({
      currentMix: mix,
      isPlaying: true,
      playbackSource: source,
      youtubeChoiceMix: null,
      youtubeMiniBlocked: null,
      youtubeEmbedError: null,
      youtubePlaybackHints:
        source === "youtube" ? (opts?.youtubeHints ?? null) : null,
      /** Vídeo embebido: barra completa para no quedar en FAB sin superficie para el iframe. */
      ...(source === "youtube" ? { playerChrome: "expanded" as const } : {}),
    }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  toggle: () => set({ isPlaying: !get().isPlaying }),
  setQueue: (mixes) => set({ queue: mixes }),
  setPlayerChrome: (chrome) => set({ playerChrome: chrome }),
  setYoutubeChoiceMix: (mix) => set({ youtubeChoiceMix: mix }),
  setYoutubeMiniBlocked: (payload) => set({ youtubeMiniBlocked: payload }),
  setYoutubeEmbedError: (message) =>
    set({
      youtubeEmbedError:
        message == null
          ? null
          : typeof message === "string"
            ? message
            : message instanceof Error
              ? message.message
              : null,
    }),
  clearPlayer: () =>
    set({
      currentMix: null,
      isPlaying: false,
      queue: [],
      playerChrome: "expanded",
      playbackSource: null,
      youtubeChoiceMix: null,
      youtubePlaybackHints: null,
      youtubeMiniBlocked: null,
      youtubeEmbedError: null,
    }),
}));
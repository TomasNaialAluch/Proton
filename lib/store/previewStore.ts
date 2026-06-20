import { create } from "zustand";
import { usePlayerStore } from "./playerStore";

/**
 * Coordinates short "preview" playback (Discover cards, the Feedback track
 * player) with the global radio player so only one source ever sounds at once.
 *
 * Design (see docs/feature-preview-vs-global-player.md, Option B): the preview
 * keeps its OWN `<audio>` per page — protected-master concerns (no download,
 * signed URLs) stay isolated from the radio engine. This store only owns the
 * coordination: pause the global player when a preview starts, and resume it
 * when previews stop, WITHOUT touching `currentMix` (the radio mix is preserved).
 */
interface PreviewState {
  /** Which preview is currently active (track id), or null. */
  activePreviewId: string | null;
  /** Whether the global player was playing when the first preview started. */
  resumeGlobalOnStop: boolean;
  startPreview: (id: string) => void;
  stopPreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set, get) => ({
  activePreviewId: null,
  resumeGlobalOnStop: false,

  startPreview: (id) => {
    const { activePreviewId } = get();
    // Only coordinate with the global player on the FIRST preview. Switching
    // from one preview to another must not re-pause or re-capture the flag —
    // the global player is already paused and the resume intent already stored.
    if (activePreviewId === null) {
      const player = usePlayerStore.getState();
      if (player.isPlaying) {
        player.pause();
        set({ resumeGlobalOnStop: true });
      } else {
        set({ resumeGlobalOnStop: false });
      }
    }
    set({ activePreviewId: id });
  },

  stopPreview: () => {
    if (get().resumeGlobalOnStop) {
      // Auto-resume (recommended policy): the producer's background radio mix
      // comes back when they finish sampling. currentMix was never touched.
      usePlayerStore.getState().resume();
    }
    set({ activePreviewId: null, resumeGlobalOnStop: false });
  },
}));

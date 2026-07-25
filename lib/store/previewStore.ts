import { create } from "zustand";
import { usePlayerStore } from "./playerStore";
import type { Track } from "@/types/track";

/**
 * Coordinates short "preview" playback (Discover cards, Track Detail, the
 * Feedback inline panel, label track cards) with the global player so only
 * one source ever sounds at once.
 *
 * Design (see docs/feature-preview-vs-global-player.md, Option B + section 6):
 * the preview is a SEPARATE engine from the global player (own `<audio>`,
 * own protections) — this store only owns coordination + "what's active"
 * state, never the audio element itself (that's `usePreviewAudioEngine`).
 */
interface PreviewState {
  /** Which preview is currently active (track id), or null. */
  activePreviewId: string | null;
  /** Full track, not just the id — so the docked bar / inline panel can
   *  render title/cover/duration without re-deriving it from whichever
   *  mock array it came from. */
  activePreviewTrack: Track | null;
  /** Track.artistId has no display name on its own — carried alongside. */
  activePreviewArtistName: string | null;
  /** True only while a global-player source is paused *specifically*
   *  because a preview started — the thing the confirmation modal asks
   *  about. Not the same as "was playing at some point." */
  pausedForPreview: boolean;
  startPreview: (track: Track, artistName: string) => void;
  /** Closing the preview (✕) — just clears preview state. Does NOT decide
   *  whether to show the resume-show modal; that's a UI-layer decision
   *  (check `pausedForPreview` first) — see PreviewDockedBar. */
  closePreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set, get) => ({
  activePreviewId: null,
  activePreviewTrack: null,
  activePreviewArtistName: null,
  pausedForPreview: false,

  startPreview: (track, artistName) => {
    const { activePreviewId } = get();
    // Only coordinate with the global player on the FIRST preview. Switching
    // from one preview to another must not re-pause or re-flag — the global
    // player is already paused (or was never playing) from the first one.
    if (activePreviewId === null) {
      const player = usePlayerStore.getState();
      if (player.isPlaying) {
        player.pause();
        set({ pausedForPreview: true });
      } else {
        set({ pausedForPreview: false });
      }
    }
    set({
      activePreviewId: track.id,
      activePreviewTrack: track,
      activePreviewArtistName: artistName,
    });
  },

  closePreview: () => {
    set({
      activePreviewId: null,
      activePreviewTrack: null,
      activePreviewArtistName: null,
      pausedForPreview: false,
    });
  },
}));

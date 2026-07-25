import { create } from "zustand";

/**
 * Reactive playback progress + controls for the ONE shared preview
 * `<audio>` element. Deliberately separate from `previewStore` (which only
 * tracks *what's* active + global-player coordination, per
 * docs/feature-preview-vs-global-player.md section 6) — this store is pure
 * engine plumbing: written to by `usePreviewAudioEngine` (mounted once,
 * inside `PreviewDockedBar`), read by both `PreviewDockedBar` and
 * `PreviewInlinePanel` so the two skins never show different progress or
 * fight over control of the same `<audio>`.
 */
interface PreviewPlaybackState {
  playing: boolean;
  currentTime: number;
  duration: number;
  toggle: () => void;
  seek: (seconds: number) => void;
}

const noop = () => {};

export const usePreviewPlaybackStore = create<PreviewPlaybackState>(() => ({
  playing: false,
  currentTime: 0,
  duration: 0,
  toggle: noop,
  seek: noop,
}));

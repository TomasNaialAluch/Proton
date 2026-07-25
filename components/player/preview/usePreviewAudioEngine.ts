"use client";

import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { usePreviewStore } from "@/lib/store/previewStore";
import { usePreviewPlaybackStore } from "@/lib/store/previewPlaybackStore";

/**
 * The one shared `<audio>` for previews. Mounted exactly once — inside
 * `PreviewDockedBar`, which is root-mounted (via `PlayerSlot`) whenever a
 * preview is active. Publishes reactive progress + play/pause/seek into
 * `previewPlaybackStore` so `PreviewInlinePanel` (Feedback's larger inline
 * skin) can read/drive the exact same playback without owning a second
 * `<audio>` — see docs/feature-preview-vs-global-player.md section 8.1.
 * Same shape/spirit as `components/player/global-player/usePlayerAudioEngine.ts`.
 */
export function usePreviewAudioEngine(): { audioRef: RefObject<HTMLAudioElement | null> } {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = usePreviewStore((s) => s.activePreviewTrack);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !el.src) return;
    if (usePreviewPlaybackStore.getState().playing) el.pause();
    else el.play().catch(() => usePreviewPlaybackStore.setState({ playing: false }));
  }, []);

  const seek = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    const max = Number.isFinite(el.duration) ? el.duration : seconds;
    el.currentTime = Math.min(Math.max(0, seconds), max);
    usePreviewPlaybackStore.setState({ currentTime: el.currentTime });
  }, []);

  // Publish the real control functions once, so the inline panel can drive this exact <audio>.
  useEffect(() => {
    usePreviewPlaybackStore.setState({ toggle, seek });
  }, [toggle, seek]);

  // New track loaded — reset progress and autoplay if there's a source.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    usePreviewPlaybackStore.setState({ currentTime: 0, duration: 0 });
    if (!track) {
      el.pause();
      el.removeAttribute("src");
      usePreviewPlaybackStore.setState({ playing: false });
      return;
    }
    el.src = track.audioUrl || "";
    el.load();
    if (track.audioUrl) {
      el.play()
        .then(() => usePreviewPlaybackStore.setState({ playing: true }))
        .catch(() => usePreviewPlaybackStore.setState({ playing: false }));
    } else {
      usePreviewPlaybackStore.setState({ playing: false });
    }
  }, [track]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => usePreviewPlaybackStore.setState({ currentTime: el.currentTime });
    const onLoadedMeta = () =>
      usePreviewPlaybackStore.setState({ duration: Number.isFinite(el.duration) ? el.duration : 0 });
    const onEnded = () => usePreviewPlaybackStore.setState({ playing: false }); // finishing does NOT close the preview — only ✕ does
    const onPlay = () => usePreviewPlaybackStore.setState({ playing: true });
    const onPause = () => usePreviewPlaybackStore.setState({ playing: false });

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoadedMeta);
    el.addEventListener("durationchange", onLoadedMeta);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.removeEventListener("durationchange", onLoadedMeta);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  // Unmounting the engine (no more active preview) always stops playback and clears controls.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      usePreviewPlaybackStore.setState({ playing: false, currentTime: 0, duration: 0, toggle: () => {}, seek: () => {} });
    };
  }, []);

  return { audioRef };
}

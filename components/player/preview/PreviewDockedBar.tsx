"use client";

import { useState } from "react";
import { Play, Pause, X } from "lucide-react";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import { usePreviewStore } from "@/lib/store/previewStore";
import { usePlayerStore } from "@/lib/store/playerStore";
import { usePreviewAudioEngine } from "./usePreviewAudioEngine";
import { usePreviewPlaybackStore } from "@/lib/store/previewPlaybackStore";
import ResumeShowModal from "./ResumeShowModal";
import { waveformBars, PREVIEW_CLIP_RATIO, isWithinPreviewClip } from "@/lib/player/previewWaveform";
import { formatPlaybackTime } from "@/lib/player/formatPlaybackTime";
import { useDashboardPlayerInsetClass } from "@/components/player/global-player/useDashboardPlayerInsetClass";

/**
 * The one bottom-docked preview bar — modeled on the real protonradio.com
 * preview bar (see docs/feature-preview-vs-global-player.md section 5.1):
 * play/pause, thumbnail, artist + title, "PREVIEW" tag, elapsed time,
 * waveform scrubber, total duration. No next/prev/queue/mix, no purchase
 * CTA (permanently omitted — see section 5.2) — a ✕ sits in that slot
 * instead, since it's the control that can trigger `ResumeShowModal`.
 *
 * Root-mounted via `PlayerSlot`, so it persists across navigation and owns
 * the ONE shared preview `<audio>` (`usePreviewAudioEngine`).
 */
export default function PreviewDockedBar() {
  const track = usePreviewStore((s) => s.activePreviewTrack);
  const artistName = usePreviewStore((s) => s.activePreviewArtistName);
  const pausedForPreview = usePreviewStore((s) => s.pausedForPreview);
  const closePreview = usePreviewStore((s) => s.closePreview);
  const pausedMixTitle = usePlayerStore((s) => s.currentMix?.title ?? "your show");
  const { audioRef } = usePreviewAudioEngine();
  const playing = usePreviewPlaybackStore((s) => s.playing);
  const currentTime = usePreviewPlaybackStore((s) => s.currentTime);
  const duration = usePreviewPlaybackStore((s) => s.duration);
  const toggle = usePreviewPlaybackStore((s) => s.toggle);
  const seek = usePreviewPlaybackStore((s) => s.seek);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const dashboardInset = useDashboardPlayerInsetClass();

  if (!track) return null;

  const bars = waveformBars(track.id, 48);
  const progress = duration > 0 ? currentTime / duration : 0;

  const handleClose = () => {
    if (pausedForPreview) {
      setShowResumeModal(true);
      return;
    }
    closePreview();
  };

  return (
    <>
      {/* No native controls exposed — no browser "download" affordance on protected masters. */}
      <audio ref={audioRef} preload="none" />

      <div
        className={`fixed bottom-16 lg:bottom-0 right-0 z-40 border-t border-[var(--color-border)] bg-surface px-4 py-2.5 transition-[left] duration-300 ease-in-out ${dashboardInset}`}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            disabled={!track.audioUrl}
            aria-label={playing ? "Pause" : "Play"}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40 transition-opacity"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <CoverArt seed={track.id} className="size-9 rounded-md" />

          <div className="min-w-0 w-32 shrink-0">
            <p className="truncate text-xs font-semibold text-text-primary">{artistName}</p>
            <p className="truncate text-xs text-text-secondary">{track.title}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary/70">Preview</p>
          </div>

          <span className="hidden sm:block shrink-0 text-[11px] tabular-nums text-text-secondary">
            {formatPlaybackTime(currentTime)}
          </span>

          <div
            className="relative hidden sm:flex h-8 flex-1 min-w-0 cursor-pointer items-end gap-[2px]"
            onClick={(e) => {
              if (!duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
              seek(ratio * duration);
            }}
          >
            {bars.map((h, i) => {
              const played = i / bars.length <= progress;
              const inClip = isWithinPreviewClip(i, bars.length);
              return (
                <span
                  key={i}
                  style={{ height: `${h * 100}%` }}
                  className={`flex-1 rounded-sm ${played ? "bg-accent" : "bg-[var(--color-border)]"} ${inClip ? "" : "opacity-30"}`}
                />
              );
            })}
            <span
              className="absolute inset-y-0 w-px bg-white/80"
              style={{ left: `${PREVIEW_CLIP_RATIO.start * 100}%` }}
              aria-hidden
            />
            <span
              className="absolute inset-y-0 w-px bg-white/80"
              style={{ left: `${PREVIEW_CLIP_RATIO.end * 100}%` }}
              aria-hidden
            />
          </div>

          <span className="hidden sm:block shrink-0 text-[11px] tabular-nums text-text-secondary">
            {formatPlaybackTime(duration)}
          </span>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close preview"
            className="ml-auto flex size-7 shrink-0 items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-background transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {showResumeModal && (
        <ResumeShowModal
          showName={pausedMixTitle}
          onResolve={() => {
            setShowResumeModal(false);
            closePreview();
          }}
        />
      )}
    </>
  );
}

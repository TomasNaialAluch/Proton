"use client";

import { Play, Pause, Music2 } from "lucide-react";
import type { Track } from "@/types/track";
import { usePreviewStore } from "@/lib/store/previewStore";
import { usePreviewPlaybackStore } from "@/lib/store/previewPlaybackStore";
import { waveformBars, PREVIEW_CLIP_RATIO, isWithinPreviewClip } from "@/lib/player/previewWaveform";
import { resolveTrackArtistName } from "@/lib/player/resolveTrackArtistName";

/**
 * The larger inline waveform block `FeedbackScoreForm` embeds while scoring
 * a track. Renamed + refactored from the old `TrackWaveformPlayer` (see
 * docs/feature-preview-vs-global-player.md section 8.2) — no longer owns
 * its own `<audio>`. Reads the same shared preview engine/store the docked
 * bar drives, so scoring a track and seeing it in the docked bar is one
 * consistent playback state, not two independent ones.
 *
 * No title/genre/BPM/key header — the caller already shows that elsewhere
 * on the page.
 */
export default function PreviewInlinePanel({ track }: { track: Track }) {
  const activePreviewId = usePreviewStore((s) => s.activePreviewId);
  const startPreview = usePreviewStore((s) => s.startPreview);
  const isActive = activePreviewId === track.id;

  const storePlaying = usePreviewPlaybackStore((s) => s.playing);
  const storeCurrentTime = usePreviewPlaybackStore((s) => s.currentTime);
  const storeDuration = usePreviewPlaybackStore((s) => s.duration);
  const storeToggle = usePreviewPlaybackStore((s) => s.toggle);

  const playing = isActive && storePlaying;
  const progress = isActive && storeDuration > 0 ? storeCurrentTime / storeDuration : 0;
  const hasSource = Boolean(track.audioUrl);
  const bars = waveformBars(track.id, 64);

  const togglePlay = () => {
    if (!hasSource) return;
    if (isActive) storeToggle();
    else startPreview(track, resolveTrackArtistName(track));
  };

  return (
    <div>
      <div className="flex items-center gap-3" onContextMenu={(e) => e.preventDefault()}>
        <button
          type="button"
          onClick={togglePlay}
          disabled={!hasSource}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white
            disabled:opacity-40 transition-opacity"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <div className="relative flex h-12 flex-1 items-end gap-[2px] overflow-hidden">
          {bars.map((h, i) => {
            const played = i / bars.length <= progress;
            const inClip = isWithinPreviewClip(i, bars.length);
            return (
              <span
                key={i}
                style={{ height: `${h * 100}%` }}
                className={`flex-1 rounded-sm transition-opacity ${played ? "bg-accent" : "bg-[var(--color-border)]"} ${inClip ? "" : "opacity-30"}`}
              />
            );
          })}
          {/* Boundary markers — where the audible clip starts/ends, same convention as Beatport's preview player. */}
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
      </div>

      <p className="mt-2 text-[11px] text-text-secondary">
        Only the highlighted section is available to preview.
      </p>

      {!hasSource && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
          <Music2 size={12} /> Streaming-only preview — playback source not wired up in this prototype.
        </p>
      )}
    </div>
  );
}

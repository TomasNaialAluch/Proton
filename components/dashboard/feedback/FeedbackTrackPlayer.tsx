"use client";

import TrackWaveformPlayer from "./TrackWaveformPlayer";
import type { Track } from "@/types/track";

interface FeedbackTrackPlayerProps {
  track: Track;
}

/** Metadata header + playback, for standalone feedback pages that don't
 *  already show this info elsewhere (feedback/[id], feedback/track/[trackId]).
 *  Track Detail's embedded scoring (`FeedbackScoreForm`) uses
 *  `TrackWaveformPlayer` directly instead, since its own header already
 *  shows title/genre/BPM/key — this would just repeat it. */
export default function FeedbackTrackPlayer({ track }: FeedbackTrackPlayerProps) {
  return (
    <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-text-primary truncate">{track.title}</h2>
          <p className="text-xs text-text-secondary">{track.genre}</p>
        </div>
        <div className="flex shrink-0 gap-4 text-right">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">BPM</p>
            <p className="text-sm font-semibold text-text-primary tabular-nums">{track.bpm ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">Key</p>
            <p className="text-sm font-semibold text-text-primary">{track.key ?? "—"}</p>
          </div>
        </div>
      </div>

      <TrackWaveformPlayer track={track} />
    </div>
  );
}

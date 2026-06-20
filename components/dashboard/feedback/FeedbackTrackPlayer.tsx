"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music2 } from "lucide-react";
import type { Track } from "@/types/track";
import { usePreviewStore } from "@/lib/store/previewStore";

/**
 * Deterministic pseudo-waveform so the same track always renders the same bars
 * without needing real audio analysis (no waveform data in the mock catalog).
 */
function waveformBars(seed: string, count: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return Array.from({ length: count }, (_, i) => {
    h = (h * 1103515245 + 12345) % 2147483648;
    return 0.25 + (h / 2147483648) * 0.75;
  });
}

interface FeedbackTrackPlayerProps {
  track: Track;
}

export default function FeedbackTrackPlayer({ track }: FeedbackTrackPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const bars = waveformBars(track.id, 64);
  const hasSource = Boolean(track.audioUrl);

  /** Shared with Discover previews — coordinates with the global radio player. */
  const activePreviewId = usePreviewStore((s) => s.activePreviewId);
  const startPreview = usePreviewStore((s) => s.startPreview);
  const stopPreview = usePreviewStore((s) => s.stopPreview);
  const playing = activePreviewId === track.id;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onEnd = () => stopPreview();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [stopPreview]);

  /** Playing is page-scoped: leaving the feedback view stops it and resumes the global player. */
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      stopPreview();
    };
  }, [stopPreview]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !hasSource) return;
    if (playing) {
      audio.pause();
      stopPreview();
    } else {
      startPreview(track.id); // pauses the global radio player if it was playing
      audio.play().catch(() => stopPreview());
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
      {/* No native controls exposed — no browser "download" affordance. */}
      <audio ref={audioRef} src={track.audioUrl || undefined} preload="none" />

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

      <div
        className="flex items-center gap-3"
        onContextMenu={(e) => e.preventDefault()}
      >
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
            return (
              <span
                key={i}
                style={{ height: `${h * 100}%` }}
                className={`flex-1 rounded-sm ${played ? "bg-accent" : "bg-[var(--color-border)]"}`}
              />
            );
          })}
        </div>
      </div>

      {!hasSource && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
          <Music2 size={12} /> Streaming-only preview — playback source not wired up in this prototype.
        </p>
      )}
    </div>
  );
}

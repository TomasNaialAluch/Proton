"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";

export default function GlobalPlayer() {
  const { currentMix, isPlaying, toggle } = usePlayerStore();

  if (!currentMix) return null;

  const artist = currentMix.artist;
  const artwork = artist.image?.url;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center gap-3 px-4"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Artwork */}
      <div className="w-10 h-10 rounded shrink-0 overflow-hidden bg-white/10 flex items-center justify-center">
        {artwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artwork} alt={currentMix.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate leading-tight">
          {currentMix.title}
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] truncate leading-tight">
          {artist.name}
          {currentMix.genre && ` · ${currentMix.genre}`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Previous"
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "var(--color-accent)" }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={16} className="text-white" />
          ) : (
            <Play size={16} className="text-white" fill="white" />
          )}
        </button>

        <button
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Next"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Duration */}
      {currentMix.duration && (
        <span className="text-xs text-[var(--color-text-secondary)] shrink-0 hidden sm:block">
          {currentMix.duration}
        </span>
      )}
    </div>
  );
}

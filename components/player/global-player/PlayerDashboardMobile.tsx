"use client";

import { useState } from "react";
import { ChevronDown, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { usePlayerAudio } from "./PlayerAudioContext";
import PlayerArtwork from "./PlayerArtwork";
import PlayerSeekBar from "./PlayerSeekBar";
import PlayerYouTubeQualityControl from "./PlayerYouTubeQualityControl";

/**
 * Dashboard móvil: sobre BottomNav (`bottom-16`).
 * Colapsado: solo línea de progreso + título en pequeño (tap para expandir).
 * Expandido: carátula y transporte.
 * YouTube: el iframe debe estar montado — arrancar expandido y no colapsar (evita cortar el vídeo).
 */
export default function PlayerDashboardMobile() {
  const { currentMix, isPlaying, toggle, clearPlayer, playbackSource } =
    usePlayerStore();
  const audioApi = usePlayerAudio();
  const isYoutube = playbackSource === "youtube";
  const [expanded, setExpanded] = useState(false);
  /** YouTube necesita el nodo del iframe montado; si solo miramos `expanded`, un frame colapsado rompe el embed. */
  const showExpanded = isYoutube || expanded;

  const canCollapse = !isYoutube;

  if (!currentMix) return null;

  const artist = currentMix.artist;

  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-50 flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-[var(--color-border)] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] md:hidden"
      style={{
        background: "var(--color-surface)",
        backdropFilter: "blur(12px)",
      }}
    >
      <PlayerSeekBar />

      {!showExpanded ? (
        <button
          type="button"
          className="w-full px-3 py-1.5 text-left"
          onClick={() => setExpanded(true)}
          aria-expanded={showExpanded}
          aria-label="Expand player controls"
        >
          <p className="truncate text-[11px] leading-snug text-[var(--color-text-secondary)]">
            {currentMix.title}
          </p>
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-2 py-1.5">
            <span className="min-w-0 flex-1 truncate px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Now playing
            </span>
            <div className="flex shrink-0 items-center">
              {canCollapse ? (
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-white/5"
                  aria-label="Minimize player"
                >
                  <ChevronDown size={20} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  clearPlayer();
                  setExpanded(false);
                }}
                className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-white/5"
                aria-label="Close player"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3 pb-3 pt-2">
            {audioApi.youtubeMountRef ? (
              <div className="relative h-[72px] w-[128px] shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-black">
                <div
                  ref={audioApi.youtubeMountRef}
                  className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full"
                />
              </div>
            ) : (
              <PlayerArtwork mix={currentMix} size="md" />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {currentMix.title}
              </p>
              <p className="truncate text-xs text-[var(--color-text-secondary)]">
                {artist.name}
                {currentMix.genre && ` · ${currentMix.genre}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                className="p-2 text-[var(--color-text-secondary)]"
                aria-label="Previous"
              >
                <SkipBack size={18} />
              </button>
              <button
                type="button"
                onClick={toggle}
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "var(--color-accent)" }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={18} className="text-white" />
                ) : (
                  <Play size={18} className="text-white" fill="white" />
                )}
              </button>
              <button
                type="button"
                className="p-2 text-[var(--color-text-secondary)]"
                aria-label="Next"
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>
          {audioApi.youtubeQualityControls ? (
            <PlayerYouTubeQualityControl variant="compact" />
          ) : null}
        </>
      )}
    </div>
  );
}

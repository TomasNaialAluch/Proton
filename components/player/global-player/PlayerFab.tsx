"use client";

import { ChevronUp, Pause, Play } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { usePlayerAudio } from "./PlayerAudioContext";
import PlayerArtwork from "./PlayerArtwork";

/** Misma huella que `PlayerArtwork` `lg` (`size-12` = 48px). */
const FAB_ART_PX = 48;
/** 16:9 inscrito en el cuadrado (ancho = lado del cuadrado). */
const FAB_YT_VIDEO_H = Math.round((FAB_ART_PX * 9) / 16);

export default function PlayerFab() {
  const { currentMix, isPlaying, toggle, setPlayerChrome } = usePlayerStore();
  const audioApi = usePlayerAudio();
  const { currentTime, duration, youtubeMountRef } = audioApi;

  if (!currentMix) return null;

  const pct =
    duration > 0 && Number.isFinite(duration)
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-0 overflow-hidden rounded-full border shadow-lg"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
      role="toolbar"
      aria-label="Mini player"
    >
      <div className="h-0.5 w-full bg-black/20" aria-hidden>
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-150 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div
        className={`flex items-center gap-1 pr-2 py-1 ${youtubeMountRef ? "pl-0" : "pl-1"}`}
      >
        {youtubeMountRef ? (
          <div
            className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-white/10"
            aria-hidden
          >
            <div
              ref={youtubeMountRef}
              className="shrink-0 [&_iframe]:h-full [&_iframe]:w-full"
              style={{
                width: FAB_ART_PX,
                height: FAB_YT_VIDEO_H,
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPlayerChrome("expanded")}
            className="flex items-center shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label="Expand player"
          >
            <PlayerArtwork mix={currentMix} size="lg" rounded="full" />
          </button>
        )}

        <button
          type="button"
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
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
          onClick={() => setPlayerChrome("expanded")}
          className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors shrink-0"
          aria-label="Expand player"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </div>
  );
}

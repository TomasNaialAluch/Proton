"use client";

import { formatPlaybackTime } from "@/lib/player/formatPlaybackTime";
import { usePlayerAudio } from "./PlayerAudioContext";

/**
 * Línea de progreso (~3px). El `input` range va anclado al borde inferior de esta
 * franja y crece hacia arriba (`bottom-0` + altura fija), así el área táctil no
 * invade la fila de botones ni zonas “vacías” debajo de la barra.
 */
export default function PlayerSeekBar() {
  const { currentTime, duration, seek } = usePlayerAudio();
  const max = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const pct = max > 0 ? Math.min(100, Math.max(0, (currentTime / max) * 100)) : 0;

  const label =
    max > 0
      ? `${formatPlaybackTime(currentTime)} / ${formatPlaybackTime(max)}`
      : "Playback position";

  return (
    <div className="relative z-10 w-full shrink-0 h-[3px] overflow-visible">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] overflow-hidden bg-white/[0.08]"
        aria-hidden
      >
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-100 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={max || 1}
        step={0.1}
        value={max ? Math.min(currentTime, max) : 0}
        onChange={(e) => seek(Number(e.target.value))}
        disabled={!max}
        aria-label={label}
        className="absolute inset-x-0 bottom-0 z-20 h-8 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 opacity-0"
      />
    </div>
  );
}

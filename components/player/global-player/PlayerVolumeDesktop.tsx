"use client";

import { Volume2, VolumeX } from "lucide-react";
import { usePlayerAudio } from "./PlayerAudioContext";

const SLIDER_PX = 120; // 7.5rem

/** Volumen en ≥ md: barra en la fila del reproductor, despliega con hover; clic en icono = mute. */
export default function PlayerVolumeDesktop() {
  const { volume, setVolume, muted, toggleMute } = usePlayerAudio();

  return (
    <div className="group relative hidden shrink-0 items-center gap-0 md:flex">
      <button
        type="button"
        onClick={toggleMute}
        className="shrink-0 rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="max-w-0 overflow-hidden transition-[max-width] duration-200 ease-out group-hover:max-w-[7.75rem]">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 cursor-pointer"
          style={{
            accentColor: "var(--color-accent)",
            width: SLIDER_PX,
            minWidth: 0,
            maxWidth: SLIDER_PX,
          }}
          aria-label="Volume level"
        />
      </div>
    </div>
  );
}

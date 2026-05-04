"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePlayerAudio } from "./PlayerAudioContext";

/** Volumen táctil: panel flotante con tap (viewport menor que md). */
export default function PlayerVolumeMobile() {
  const { volume, setVolume, muted, toggleMute } = usePlayerAudio();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0 md:hidden">
      {open && (
        <div
          className="absolute bottom-full right-0 z-[60] mb-2 flex w-[10.5rem] flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 shadow-lg backdrop-blur-md"
          role="dialog"
          aria-label="Volume"
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-full cursor-pointer"
            style={{ accentColor: "var(--color-accent)" }}
            aria-label="Volume level"
          />
          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center justify-center gap-2 rounded-md py-1 text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{muted ? "Unmute" : "Mute"}</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        aria-label="Volume"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

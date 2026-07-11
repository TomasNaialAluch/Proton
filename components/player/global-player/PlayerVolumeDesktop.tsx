"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePlayerAudio } from "./PlayerAudioContext";

export default function PlayerVolumeDesktop() {
  const { volume, setVolume, muted, toggleMute } = usePlayerAudio();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative hidden shrink-0 items-center md:flex">
      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center rounded-xl border border-[var(--color-border)] px-2 py-3 shadow-xl"
          style={{ background: "var(--color-surface)" }}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume level"
            className="cursor-pointer"
            style={{
              writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
              direction: "rtl",
              accentColor: "var(--color-accent)",
              width: 20,
              height: 80,
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onDoubleClick={toggleMute}
        className="shrink-0 rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        aria-label={open ? "Close volume" : "Open volume"}
        title="Click to adjust volume · Double-click to mute"
      >
        {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

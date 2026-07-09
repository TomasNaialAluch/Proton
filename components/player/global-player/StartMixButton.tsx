"use client";

import { useState } from "react";
import { Radio } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { fetchLatestMixes } from "@/lib/api/mixes";
import { buildRadioQueue } from "@/lib/player/startMix";
import type { ProtonMix } from "@/types/mix";

const QUEUE_TARGET_COUNT = 10;
/** How long the "mix started" toast stays up before fading out. */
const TOAST_MS = 2600;

interface StartMixButtonProps {
  mix: ProtonMix;
  /** Set when the button sits inside an element that also handles clicks
   *  (e.g. MixCard's whole-card onClick) so tapping it doesn't also play the mix. */
  stopPropagation?: boolean;
  className?: string;
}

export default function StartMixButton({
  mix,
  stopPropagation = false,
  className = "",
}: StartMixButtonProps) {
  const setQueue = usePlayerStore((s) => s.setQueue);
  /** `null` = hidden, `"loading"` = shown immediately on tap (fetch still in flight),
   *  `number` = shown once the queue is actually built, with the real count. */
  const [toast, setToast] = useState<"loading" | number | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={async (e) => {
          if (stopPropagation) e.stopPropagation();
          // Show feedback the instant it's tapped — fetchLatestMixes can take a moment
          // (real API call, mock fallback on failure), and a silent wait reads as "did
          // nothing happen?".
          setToast("loading");
          // Replaces the queue (not appends) — pressing this again always regenerates a
          // fresh batch from what's currently playing, instead of growing without end.
          const pool = await fetchLatestMixes(48);
          const related = buildRadioQueue(mix, pool, QUEUE_TARGET_COUNT);
          setQueue(related);
          setToast(related.length);
          window.setTimeout(() => setToast(null), TOAST_MS);
        }}
        aria-label="Start mix — queue related tracks"
        title="Start mix"
        className={`flex items-center justify-center transition-colors ${className}`}
      >
        <Radio size={18} className="text-[var(--color-accent)]" />
      </button>

      {toast !== null && (
        <div
          role="status"
          className="fixed left-1/2 top-1/2 z-[90] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium shadow-2xl"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-accent)",
            color: "var(--color-text-primary)",
          }}
        >
          <Radio
            size={16}
            className={`text-[var(--color-accent)] ${toast === "loading" ? "animate-pulse" : ""}`}
          />
          {toast === "loading"
            ? "Starting mix…"
            : `Mix started — ${toast} track${toast === 1 ? "" : "s"} queued`}
        </div>
      )}
    </>
  );
}

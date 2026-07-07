"use client";

import { ListPlus, Check } from "lucide-react";
import { useState } from "react";
import { usePlayerStore } from "@/lib/store/playerStore";
import type { ProtonMix } from "@/types/mix";

interface AddToQueueButtonProps {
  mix: ProtonMix;
  /** Set when the button sits inside an element that also handles clicks
   *  (e.g. MixCard's whole-card onClick) so tapping it doesn't also play the mix. */
  stopPropagation?: boolean;
  className?: string;
}

/** Brief "added" confirmation before reverting to the plain icon. */
const CONFIRM_MS = 1200;

export default function AddToQueueButton({
  mix,
  stopPropagation = false,
  className = "",
}: AddToQueueButtonProps) {
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        addToQueue(mix);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), CONFIRM_MS);
      }}
      aria-label="Add to queue"
      className={`flex items-center justify-center transition-colors ${className}`}
    >
      {justAdded ? (
        <Check size={16} className="text-[var(--color-accent)]" />
      ) : (
        <ListPlus size={16} className="text-white" />
      )}
    </button>
  );
}

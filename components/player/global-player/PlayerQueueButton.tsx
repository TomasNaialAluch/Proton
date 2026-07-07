"use client";

import { useState } from "react";
import { ListMusic } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import PlayerQueueDrawer from "./PlayerQueueDrawer";

export default function PlayerQueueButton() {
  const [open, setOpen] = useState(false);
  const queueLength = usePlayerStore((s) => s.queue.length);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Queue"
        className="relative shrink-0 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
      >
        <ListMusic size={18} />
        {queueLength > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {queueLength > 9 ? "9+" : queueLength}
          </span>
        )}
      </button>
      <PlayerQueueDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

"use client";

import { X } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import PlayerArtwork from "./PlayerArtwork";

interface PlayerQueueDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function PlayerQueueDrawer({ open, onClose }: PlayerQueueDrawerProps) {
  const queue = usePlayerStore((s) => s.queue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const setQueue = usePlayerStore((s) => s.setQueue);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[70] bg-black/40" aria-hidden />
      <div
        role="dialog"
        aria-label="Queue"
        className="fixed bottom-0 right-0 z-[80] flex max-h-[60vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[var(--color-border)] shadow-2xl sm:bottom-20 sm:right-4 sm:w-96 sm:rounded-2xl"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Up next{queue.length > 0 ? ` (${queue.length})` : ""}
          </span>
          <div className="flex items-center gap-3">
            {queue.length > 0 && (
              <button
                type="button"
                onClick={() => setQueue([])}
                className="text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close queue"
              className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
              Nothing queued yet.
            </p>
          ) : (
            queue.map((mix) => (
              <div
                key={mix.id}
                className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 last:border-b-0"
              >
                <PlayerArtwork mix={mix} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {mix.title}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {mix.artist.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromQueue(mix.id)}
                  aria-label={`Remove ${mix.title} from queue`}
                  className="shrink-0 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { usePlayerStore } from "@/lib/store/playerStore";

/**
 * Blocking Yes/No confirmation shown when the preview bar's ✕ is pressed
 * while a show/mix is paused-for-preview (see
 * docs/feature-preview-vs-global-player.md section 4.3). Owned by
 * `PreviewDockedBar`, not the store — "ask the user something" is a UI
 * decision, not state-store logic.
 */
export default function ResumeShowModal({
  showName,
  onResolve,
}: {
  showName: string;
  /** Called after the Yes/No action is applied, so the caller can clear the preview either way. */
  onResolve: () => void;
}) {
  const resume = usePlayerStore((s) => s.resume);
  const clearPlayer = usePlayerStore((s) => s.clearPlayer);

  const handleYes = () => {
    resume();
    onResolve();
  };

  const handleNo = () => {
    clearPlayer();
    onResolve();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-surface p-5 shadow-xl">
        <p className="text-sm font-semibold text-text-primary mb-1">Continue listening?</p>
        <p className="text-xs text-text-secondary mb-4">
          You paused <span className="font-medium text-text-primary">{showName}</span> to preview tracks.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleNo}
            className="flex-1 rounded-lg border border-[var(--color-border)] py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            No
          </button>
          <button
            type="button"
            onClick={handleYes}
            className="flex-1 rounded-lg bg-accent py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Yes, resume
          </button>
        </div>
      </div>
    </div>
  );
}

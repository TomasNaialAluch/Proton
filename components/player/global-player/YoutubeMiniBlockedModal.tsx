"use client";

import { useId } from "react";
import { ExternalLink } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { youtubeWatchUrl } from "@/lib/player/youtubeWatchUrl";
import { noticeLines } from "@/lib/youtube/youtubeVideoHints";

/**
 * Preferencia «mini» pero el vídeo no se puede embeber (privado, embed off, etc.).
 */
export default function YoutubeMiniBlockedModal() {
  const payload = usePlayerStore((s) => s.youtubeMiniBlocked);
  const setYoutubeMiniBlocked = usePlayerStore((s) => s.setYoutubeMiniBlocked);
  const titleId = useId();

  if (!payload) return null;

  const { mix, hints } = payload;
  const vid = mix.youtubeId.trim();
  const lines = noticeLines(hints);

  const close = () => setYoutubeMiniBlocked(null);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-[var(--color-text-primary)]"
        >
          Mini player unavailable
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          This video can’t be played in the embedded player here. You can still
          open it on YouTube.
        </p>
        <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
          {mix.title}
        </p>

        {lines.length > 0 && (
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-secondary)]">
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              window.open(youtubeWatchUrl(vid), "_blank", "noopener,noreferrer");
              close();
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-accent)" }}
          >
            <ExternalLink size={18} className="shrink-0" aria-hidden />
            Open on YouTube
          </button>
          <button
            type="button"
            onClick={close}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

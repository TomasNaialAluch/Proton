"use client";

import { useEffect, useId, useState } from "react";
import { ExternalLink, PictureInPicture } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { youtubeWatchUrl } from "@/lib/player/youtubeWatchUrl";
import { fetchYoutubeVideoHintsClient } from "@/lib/youtube/fetchYoutubeVideoHintsClient";
import {
  noticeLines,
  shouldBlockMiniPlayer,
  type YoutubeVideoHints,
} from "@/lib/youtube/youtubeVideoHints";
import {
  writeYoutubePlaybackPreference,
  type YoutubePlaybackPreference,
} from "@/lib/player/youtubePreference";

/**
 * Cuando el usuario intenta reproducir un mix que solo tiene `youtubeId` y no hay preferencia guardada.
 */
export default function YouTubeChoiceModal() {
  const mix = usePlayerStore((s) => s.youtubeChoiceMix);
  const setYoutubeChoiceMix = usePlayerStore((s) => s.setYoutubeChoiceMix);
  const play = usePlayerStore((s) => s.play);
  const titleId = useId();
  const [remember, setRemember] = useState(false);
  const [hints, setHints] = useState<YoutubeVideoHints | null>(null);
  const [hintsLoading, setHintsLoading] = useState(false);

  useEffect(() => {
    if (!mix?.youtubeId?.trim()) return;
    let cancelled = false;
    const vid = mix.youtubeId.trim();
    setHints(null);
    setHintsLoading(true);
    void fetchYoutubeVideoHintsClient(vid).then((h) => {
      if (!cancelled) {
        setHints(h);
        setHintsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mix?.id, mix?.youtubeId]);

  if (!mix?.youtubeId?.trim()) return null;

  const vid = mix.youtubeId.trim();
  const blockMini = Boolean(hints && shouldBlockMiniPlayer(hints));
  const notices = hints ? noticeLines(hints) : [];

  const close = () => {
    setRemember(false);
    setYoutubeChoiceMix(null);
  };

  const persistIfNeeded = (pref: YoutubePlaybackPreference) => {
    if (remember) writeYoutubePlaybackPreference(pref);
  };

  const openInNewTab = () => {
    persistIfNeeded("tab");
    window.open(youtubeWatchUrl(vid), "_blank", "noopener,noreferrer");
    close();
  };

  const openMiniPlayer = () => {
    if (blockMini) return;
    persistIfNeeded("mini");
    play(mix, "youtube", { youtubeHints: hints ?? undefined });
    close();
  };

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
          Play on YouTube
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          This show is available as video on YouTube. How would you like to watch
          it?
        </p>
        <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
          {mix.title}
        </p>

        {hintsLoading && (
          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            Checking video availability…
          </p>
        )}

        {!hintsLoading && notices.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {notices.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        {!hintsLoading && blockMini && (
          <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400/95">
            The mini player can’t be used for this video. Use Open YouTube
            instead.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={openInNewTab}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
          >
            <ExternalLink size={18} className="shrink-0 opacity-80" aria-hidden />
            Open YouTube in a new tab
          </button>
          <button
            type="button"
            onClick={openMiniPlayer}
            disabled={hintsLoading || blockMini}
            title={
              blockMini
                ? "Embedding isn’t available for this video"
                : undefined
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            style={{ background: "var(--color-accent)" }}
          >
            <PictureInPicture size={18} className="shrink-0" aria-hidden />
            Mini player here
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border-[var(--color-border)]"
          />
          Remember my choice on this device
        </label>

        <button
          type="button"
          onClick={close}
          className="mt-4 w-full rounded-lg py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

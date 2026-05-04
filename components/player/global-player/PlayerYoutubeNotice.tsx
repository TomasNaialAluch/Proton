"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { noticeLines } from "@/lib/youtube/youtubeVideoHints";
import { youtubeWatchUrl } from "@/lib/player/youtubeWatchUrl";

/**
 * Avisos del estado del vídeo (Data API) y errores del iframe embebido.
 */
export default function PlayerYoutubeNotice() {
  const playbackSource = usePlayerStore((s) => s.playbackSource);
  const hints = usePlayerStore((s) => s.youtubePlaybackHints);
  const currentMix = usePlayerStore((s) => s.currentMix);
  const embedErrorRaw = usePlayerStore((s) => s.youtubeEmbedError);
  const watchId = currentMix?.youtubeId?.trim();

  if (playbackSource !== "youtube") return null;

  const embedError =
    typeof embedErrorRaw === "string" ? embedErrorRaw : null;

  const fromHints = hints ? noticeLines(hints) : [];
  const combined = embedError ? [embedError, ...fromHints] : fromHints;
  const seen = new Set<string>();
  const unique = combined.filter((t) => {
    if (!t || seen.has(t)) return false;
    seen.add(t);
    return true;
  });

  if (unique.length === 0) return null;

  return (
    <div
      role={embedError ? "alert" : undefined}
      aria-live={embedError ? "assertive" : "polite"}
      className={`flex gap-2 border-b px-3 py-2.5 text-[12px] leading-snug text-[var(--color-text-primary)] ${
        embedError
          ? "border-red-500/30 bg-red-500/[0.12]"
          : "border-amber-500/20 bg-amber-500/[0.08]"
      }`}
    >
      <AlertTriangle
        className={`mt-0.5 h-4 w-4 shrink-0 ${embedError ? "text-red-400/95" : "text-amber-500/90"}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <ul
          className={`list-disc space-y-0.5 pl-3 text-[var(--color-text-secondary)] ${
            embedError
              ? "marker:text-red-400/80"
              : "marker:text-amber-600/80"
          }`}
        >
          {unique.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        {embedError && watchId ? (
          <a
            href={youtubeWatchUrl(watchId)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
          >
            <ExternalLink size={13} className="shrink-0 opacity-90" aria-hidden />
            Open on YouTube
          </a>
        ) : null}
      </div>
    </div>
  );
}

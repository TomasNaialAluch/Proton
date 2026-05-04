"use client";

import { useId, useState } from "react";
import { ExternalLink, PictureInPicture } from "lucide-react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { youtubeWatchUrl } from "@/lib/player/youtubeWatchUrl";
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

  if (!mix?.youtubeId?.trim()) return null;

  const vid = mix.youtubeId.trim();

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
    persistIfNeeded("mini");
    play(mix, "youtube");
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
          Reproducir en YouTube
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Este show está disponible como vídeo en YouTube. ¿Cómo quieres verlo?
        </p>
        <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
          {mix.title}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={openInNewTab}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
          >
            <ExternalLink size={18} className="shrink-0 opacity-80" aria-hidden />
            Abrir YouTube en otra pestaña
          </button>
          <button
            type="button"
            onClick={openMiniPlayer}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-accent)" }}
          >
            <PictureInPicture size={18} className="shrink-0" aria-hidden />
            Mini reproductor aquí
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border-[var(--color-border)]"
          />
          Recordar mi elección en este dispositivo
        </label>

        <button
          type="button"
          onClick={close}
          className="mt-4 w-full rounded-lg py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

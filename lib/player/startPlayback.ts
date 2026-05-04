import type { ProtonMix } from "@/types/mix";
import { usePlayerStore, type PlaybackSource } from "@/lib/store/playerStore";
import { readYoutubePlaybackPreference } from "@/lib/player/youtubePreference";
import { youtubeWatchUrl } from "@/lib/player/youtubeWatchUrl";

/**
 * Punto de entrada al reproducir un mix desde la UI pública.
 * - Con `audioUrl` → siempre reproductor `<audio>`.
 * - Solo `youtubeId` → preferencia guardada, o modal (`youtubeChoiceMix`).
 * - Sin audio ni YouTube → demo de audio como hasta ahora.
 */
export function startPlayback(mix: ProtonMix): void {
  const store = usePlayerStore.getState();
  const hasYoutubeId = Boolean(mix.youtubeId?.trim());

  if (mix.audioUrl) {
    store.play(mix, "audio");
    return;
  }

  if (hasYoutubeId) {
    const pref = readYoutubePlaybackPreference();
    if (pref === "tab") {
      window.open(
        youtubeWatchUrl(mix.youtubeId.trim()),
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    if (pref === "mini") {
      store.play(mix, "youtube");
      return;
    }
    store.setYoutubeChoiceMix(mix);
    return;
  }

  store.play(mix, "audio");
}

/** Para tests o llamadas internas que necesiten forzar el modo. */
export function playMixWithSource(mix: ProtonMix, source: PlaybackSource): void {
  usePlayerStore.getState().play(mix, source);
}

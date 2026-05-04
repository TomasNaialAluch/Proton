import type { ProtonMix } from "@/types/mix";
import {
  shouldBlockMiniPlayer,
  type YoutubeVideoHints,
} from "@/lib/youtube/youtubeVideoHints";
import { fetchYoutubeVideoHintsClient } from "@/lib/youtube/fetchYoutubeVideoHintsClient";
import { usePlayerStore, type PlaybackSource } from "@/lib/store/playerStore";
import { readYoutubePlaybackPreference } from "@/lib/player/youtubePreference";
import { youtubeWatchUrl } from "@/lib/player/youtubeWatchUrl";

/**
 * Punto de entrada al reproducir un mix desde la UI pública.
 * - Con `audioUrl` → siempre reproductor `<audio>`.
 * - Solo `youtubeId` → preferencia guardada, o modal (`youtubeChoiceMix`).
 * - Sin audio ni YouTube → demo de audio como hasta ahora.
 *
 * Para YouTube con preferencia «mini», consulta la Data API antes de abrir
 * el embed; si no se puede embeber, abre un modal de aviso.
 */
export async function startPlaybackAsync(mix: ProtonMix): Promise<void> {
  const store = usePlayerStore.getState();
  const hasYoutubeId = Boolean(mix.youtubeId?.trim());

  if (mix.audioUrl) {
    store.play(mix, "audio");
    return;
  }

  if (hasYoutubeId) {
    const vid = mix.youtubeId.trim();
    const pref = readYoutubePlaybackPreference();
    if (pref === "tab") {
      window.open(youtubeWatchUrl(vid), "_blank", "noopener,noreferrer");
      return;
    }
    if (pref === "mini") {
      const hints = await fetchYoutubeVideoHintsClient(vid);
      if (hints && shouldBlockMiniPlayer(hints)) {
        store.setYoutubeMiniBlocked({ mix, hints });
        return;
      }
      store.play(mix, "youtube", { youtubeHints: hints ?? undefined });
      return;
    }
    store.setYoutubeChoiceMix(mix);
    return;
  }

  store.play(mix, "audio");
}

export function startPlayback(mix: ProtonMix): void {
  void startPlaybackAsync(mix);
}

/** Para tests o llamadas internas que necesiten forzar el modo. */
export function playMixWithSource(
  mix: ProtonMix,
  source: PlaybackSource,
  opts?: { youtubeHints?: YoutubeVideoHints | null }
): void {
  usePlayerStore.getState().play(mix, source, opts);
}

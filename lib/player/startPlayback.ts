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
 *
 * `opts.auto`: avance automático de cola (fin de track → siguiente), sin
 * gesto del usuario detrás. Si no hay preferencia guardada, en este caso no
 * corresponde abrir el modal de elección (quedaría flotando sin que nadie
 * lo haya pedido) — se asume «mini» para seguir escuchando en la app.
 */
export async function startPlaybackAsync(
  mix: ProtonMix,
  opts?: { auto?: boolean }
): Promise<void> {
  const store = usePlayerStore.getState();
  const hasYoutubeId = Boolean(mix.youtubeId?.trim());

  if (mix.audioUrl) {
    store.play(mix, "audio");
    return;
  }

  if (hasYoutubeId) {
    const vid = mix.youtubeId.trim();
    const pref = readYoutubePlaybackPreference();
    const effectivePref = pref ?? (opts?.auto ? "mini" : null);

    if (effectivePref === "tab") {
      window.open(youtubeWatchUrl(vid), "_blank", "noopener,noreferrer");
      return;
    }
    if (effectivePref === "mini") {
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

export function startPlayback(mix: ProtonMix, opts?: { auto?: boolean }): void {
  void startPlaybackAsync(mix, opts);
}

/** Para tests o llamadas internas que necesiten forzar el modo. */
export function playMixWithSource(
  mix: ProtonMix,
  source: PlaybackSource,
  opts?: { youtubeHints?: YoutubeVideoHints | null }
): void {
  usePlayerStore.getState().play(mix, source, opts);
}

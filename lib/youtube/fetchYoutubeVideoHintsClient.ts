"use client";

import type { YoutubeVideoHints } from "@/lib/youtube/youtubeVideoHints";

type OkBody = { ok: true; hints: YoutubeVideoHints };
type ErrBody = { ok: false; reason?: string; error?: string };

/**
 * Obtiene metadatos del vídeo vía ruta interna. Devuelve `null` si no hay datos
 * (sin API key, error de red, respuesta inválida).
 */
export async function fetchYoutubeVideoHintsClient(
  videoId: string
): Promise<YoutubeVideoHints | null> {
  try {
    const r = await fetch(
      `/api/youtube/video?v=${encodeURIComponent(videoId)}`,
      { cache: "no-store" }
    );
    if (!r.ok) return null;
    const body = (await r.json()) as OkBody | ErrBody;
    if (!body.ok || !("hints" in body)) return null;
    return body.hints;
  } catch {
    return null;
  }
}

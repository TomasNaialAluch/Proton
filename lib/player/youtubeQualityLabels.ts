/** Valores devueltos por la IFrame API de YouTube para calidad de reproducción. */
export const YOUTUBE_QUALITY_ORDER = [
  "highres",
  "hd1080",
  "hd720",
  "large",
  "medium",
  "small",
  "tiny",
] as const;

export type YoutubeQualityId = (typeof YOUTUBE_QUALITY_ORDER)[number];

const ORDER_INDEX: Record<string, number> = Object.fromEntries(
  YOUTUBE_QUALITY_ORDER.map((q, i) => [q, i])
);

export function isKnownYoutubeQualityId(id: string): boolean {
  return id in ORDER_INDEX;
}

/** Orden descendente (mejor primero). */
export function sortYoutubeQualityIds(ids: string[]): string[] {
  return [...ids].sort(
    (a, b) => (ORDER_INDEX[b] ?? -1) - (ORDER_INDEX[a] ?? -1)
  );
}

/** Etiqueta corta en inglés (producto Proton en inglés). */
export function youtubeQualityLabel(id: string): string {
  switch (id) {
    case "highres":
      return "Max";
    case "hd1080":
      return "1080p";
    case "hd720":
      return "720p";
    case "large":
      return "480p";
    case "medium":
      return "360p";
    case "small":
      return "240p";
    case "tiny":
      return "144p";
    default:
      if (id === "unknown") return "—";
      return id || "—";
  }
}

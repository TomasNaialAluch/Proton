const STORAGE_KEY = "proton-youtube-video-quality";

/** Cadena vacía = automático (sin forzar rango). */
export function readYoutubeVideoQualityPreference(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function writeYoutubeVideoQualityPreference(qualityId: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!qualityId) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, qualityId);
  } catch {
    /* ignore */
  }
}

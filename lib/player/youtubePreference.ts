export type YoutubePlaybackPreference = "tab" | "mini";

const STORAGE_KEY = "proton-youtube-playback-pref";

export function readYoutubePlaybackPreference(): YoutubePlaybackPreference | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "tab" || raw === "mini") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeYoutubePlaybackPreference(pref: YoutubePlaybackPreference): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
}

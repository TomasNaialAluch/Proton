/**
 * Carga la IFrame API de YouTube una sola vez.
 */
export function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const w = window as Window & {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YtPlayerLite };
    onYouTubeIframeAPIReady?: () => void;
  };

  if (w.YT?.Player) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const tryResolve = () => {
      if (w.YT?.Player) resolve();
    };

    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      try {
        prev?.();
      } catch {
        /* ignore */
      }
      tryResolve();
    };

    const iv = window.setInterval(() => {
      if (w.YT?.Player) {
        window.clearInterval(iv);
        resolve();
      }
    }, 50);
    window.setTimeout(() => window.clearInterval(iv), 20000);

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    } else {
      tryResolve();
    }
  });
}

export type YtPlayerLite = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (s: number, a: boolean) => void;
  setVolume: (v: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  /** @see https://developers.google.com/youtube/iframe_api_reference#Playback_status */
  getPlayerState?: () => number;
  getPlaybackQuality: () => string;
  getAvailableQualityLevels: () => string[];
  setPlaybackQualityRange: (suggestedMin: string, suggestedMax: string) => void;
  destroy: () => void;
};

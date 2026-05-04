/** Estado del vídeo según YouTube Data API v3 (`videos.list`). */

export type YoutubeLiveBroadcast = "none" | "upcoming" | "live";

export type YoutubeVideoHints = {
  videoId: string;
  /** `items` vacío: privado, borrado o ID inválido (sin OAuth no hay detalle). */
  notFound: boolean;
  liveBroadcastContent: YoutubeLiveBroadcast;
  scheduledStartTime: string | null;
  privacyStatus: "public" | "unlisted" | "private" | null;
  embeddable: boolean | null;
  ageRestricted: boolean;
};

export function hintsNotFound(videoId: string): YoutubeVideoHints {
  return {
    videoId,
    notFound: true,
    liveBroadcastContent: "none",
    scheduledStartTime: null,
    privacyStatus: null,
    embeddable: null,
    ageRestricted: false,
  };
}

export type YoutubeApiVideoItem = {
  snippet?: { liveBroadcastContent?: string };
  status?: {
    privacyStatus?: string;
    embeddable?: boolean;
  };
  contentDetails?: { contentRating?: { ytRating?: string } };
  liveStreamingDetails?: { scheduledStartTime?: string };
};

function asPrivacy(
  s: string | undefined
): YoutubeVideoHints["privacyStatus"] {
  if (s === "public" || s === "unlisted" || s === "private") return s;
  return null;
}

export function hintsFromApiItem(
  videoId: string,
  item: YoutubeApiVideoItem
): YoutubeVideoHints {
  const raw = item.snippet?.liveBroadcastContent;
  const liveBroadcastContent: YoutubeLiveBroadcast =
    raw === "live" || raw === "upcoming" ? raw : "none";
  return {
    videoId,
    notFound: false,
    liveBroadcastContent,
    scheduledStartTime: item.liveStreamingDetails?.scheduledStartTime ?? null,
    privacyStatus: asPrivacy(item.status?.privacyStatus),
    embeddable:
      typeof item.status?.embeddable === "boolean"
        ? item.status.embeddable
        : null,
    ageRestricted:
      item.contentDetails?.contentRating?.ytRating === "ytAgeRestricted",
  };
}

export function shouldBlockMiniPlayer(h: YoutubeVideoHints): boolean {
  if (h.notFound) return true;
  if (h.privacyStatus === "private") return true;
  if (h.embeddable === false) return true;
  return false;
}

/**
 * Textos informativos (inglés, producto unificado) para UI.
 * Vacío si no hay nada que comunicar.
 */
export function noticeLines(h: YoutubeVideoHints): string[] {
  const lines: string[] = [];
  if (h.notFound) {
    lines.push(
      "This video isn’t available through the API. It may be private, removed, or the ID may be wrong. Try opening it on YouTube."
    );
    return lines;
  }
  if (h.liveBroadcastContent === "upcoming") {
    if (h.scheduledStartTime) {
      const d = new Date(h.scheduledStartTime);
      lines.push(
        `Scheduled start: ${d.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}. The embedded player may show a countdown until then.`
      );
    } else {
      lines.push(
        "This premiere isn’t available for playback yet; the embed may show a waiting screen."
      );
    }
  }
  if (h.liveBroadcastContent === "live") {
    lines.push("This stream is live.");
  }
  if (h.privacyStatus === "private") {
    lines.push(
      "Private video — sign in on YouTube with an account that has access."
    );
  }
  if (h.privacyStatus === "unlisted") {
    lines.push("Unlisted — only people with the link can watch.");
  }
  if (h.embeddable === false) {
    lines.push("The owner has disabled playback on external sites.");
  }
  if (h.ageRestricted) {
    lines.push(
      "Age-restricted: embedded playback may require signing in on YouTube."
    );
  }
  return lines;
}

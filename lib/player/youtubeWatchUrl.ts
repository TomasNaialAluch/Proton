/** URL de visionado estándar para un `videoId` de YouTube. */
export function youtubeWatchUrl(videoId: string): string {
  const id = videoId.trim();
  return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
}

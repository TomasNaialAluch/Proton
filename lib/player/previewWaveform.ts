/**
 * Deterministic pseudo-waveform so the same track always renders the same
 * bars without needing real audio analysis (no waveform data in the mock
 * catalog). Shared by `PreviewDockedBar` and `PreviewInlinePanel` so the two
 * skins of the same preview engine look consistent.
 */
export function waveformBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return Array.from({ length: count }, () => {
    h = (h * 1103515245 + 12345) % 2147483648;
    return 0.25 + (h / 2147483648) * 0.75;
  });
}

/**
 * The playable preview clip only covers the middle slice of the track —
 * same convention as Beatport's own preview player (a lit/audible middle
 * section, dimmed start and end that aren't part of the clip). Purely
 * visual today, same as the rest of this waveform (no real audio behind
 * it), but marks the shape a real preview clip would take.
 */
export const PREVIEW_CLIP_RATIO = { start: 0.3, end: 0.75 };

export function isWithinPreviewClip(index: number, total: number): boolean {
  const ratio = index / total;
  return ratio >= PREVIEW_CLIP_RATIO.start && ratio <= PREVIEW_CLIP_RATIO.end;
}

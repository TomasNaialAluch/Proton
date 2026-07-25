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

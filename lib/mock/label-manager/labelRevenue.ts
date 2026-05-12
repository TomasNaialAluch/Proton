import type { LabelCatalogRelease } from "@/lib/mock/label-manager/labelCatalog";

export type RevenuePoint = { month: string; streams: number; revenue: number };
export type BreakdownPoint = { name: string; value: number };

function hashToNumber(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Derive mock revenue metrics from a set of scoped releases.
 * KISS: deterministic values (stable across reloads) without external APIs.
 */
export function buildMockRevenue(releases: LabelCatalogRelease[]): {
  trend: RevenuePoint[];
  dsp: BreakdownPoint[];
  territories: BreakdownPoint[];
} {
  const base = releases.reduce((s, r) => s + r.tracks.length, 0);
  const seed = hashToNumber(releases.map((r) => r.id).sort().join("|") || "empty");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const trend: RevenuePoint[] = months.map((m, idx) => {
    const wobble = (seed % 97) * (idx + 1);
    const streams = clamp(Math.round((base * 2200 + wobble * 13) * (0.72 + idx * 0.08)), 0, 2_000_000);
    const revenue = Math.round(streams * (0.0028 + ((seed % 7) * 0.0001)));
    return { month: m, streams, revenue };
  });

  const dspNames = ["Spotify", "Apple Music", "Beatport", "YouTube Music", "Deezer"];
  const dsp: BreakdownPoint[] = dspNames.map((name, i) => {
    const v = clamp(((seed >> (i * 3)) % 100) + 20, 10, 120);
    return { name, value: v };
  });
  const dspTotal = dsp.reduce((s, d) => s + d.value, 0) || 1;
  dsp.forEach((d) => (d.value = Math.round((d.value / dspTotal) * 100)));

  const terrNames = ["US", "UK", "DE", "AR", "AU", "FR"];
  const territories: BreakdownPoint[] = terrNames.map((name, i) => {
    const v = clamp(((seed >> (i * 2)) % 90) + 15, 10, 120);
    return { name, value: v };
  });
  const terrTotal = territories.reduce((s, d) => s + d.value, 0) || 1;
  territories.forEach((d) => (d.value = Math.round((d.value / terrTotal) * 100)));

  return {
    trend,
    dsp: dsp.sort((a, b) => b.value - a.value),
    territories: territories.sort((a, b) => b.value - a.value),
  };
}

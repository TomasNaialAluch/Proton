"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import type { LabelWidgetProps } from "./types";

function hashToNumber(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

export function RisingTracksWidget({ activeLabelId }: LabelWidgetProps) {
  const rows = useMemo(() => {
    const tracks = mockLabelCatalog.filter((r) => r.labelId === activeLabelId).flatMap((r) =>
      r.tracks.map((t) => ({ ...t, artist: mockRosterArtists.find((a) => a.id === r.artistId)?.name ?? "Unknown" }))
    );
    return tracks
      .map((t) => ({ ...t, growthPct: 5 + (hashToNumber(t.id) % 60) }))
      .sort((a, b) => b.growthPct - a.growthPct)
      .slice(0, 5);
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Rising tracks</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-text-secondary">No tracks for this label yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="truncate font-medium text-text-primary">{t.title}</p>
                <p className="truncate text-text-secondary">{t.artist}</p>
              </div>
              <span className="shrink-0 font-medium text-emerald-500">+{t.growthPct}%</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

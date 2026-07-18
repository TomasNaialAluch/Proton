"use client";

import { useMemo } from "react";
import { Radio } from "lucide-react";
import type { LabelWidgetProps } from "./types";

function hashToNumber(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

const SOURCES = ["Playlists", "Artist profile", "Search", "Radio"];

/** No dedicated play-source mock exists for labels yet — same deterministic-
 *  hash approach `buildMockRevenue` already uses elsewhere in this file set,
 *  so the split is at least stable across reloads instead of random noise. */
export function PlaySourcesWidget({ activeLabelId }: LabelWidgetProps) {
  const rows = useMemo(() => {
    const seed = hashToNumber(activeLabelId);
    const raw = SOURCES.map((name, i) => ({ name, value: 15 + ((seed >> (i * 4)) % 60) }));
    const total = raw.reduce((s, r) => s + r.value, 0) || 1;
    return raw
      .map((r) => ({ ...r, pct: Math.round((r.value / total) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Radio size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Play sources</h2>
      </div>
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li key={r.name}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-text-primary">{r.name}</span>
              <span className="tabular-nums text-text-secondary">{r.pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-border)]">
              <div className="h-full rounded-full bg-accent" style={{ width: `${r.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import type { LabelWidgetProps } from "./types";

function hashToNumber(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

export function StreamsByReleaseWidget({ activeLabelId }: LabelWidgetProps) {
  const rows = useMemo(() => {
    const releases = mockLabelCatalog.filter((r) => r.labelId === activeLabelId);
    const withStreams = releases.map((r) => ({
      title: r.title,
      streams: 8_000 + (hashToNumber(r.id) % 42_000),
    }));
    const max = Math.max(1, ...withStreams.map((r) => r.streams));
    return withStreams
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 5)
      .map((r) => ({ ...r, pct: Math.round((r.streams / max) * 100) }));
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <h2 className="mb-3 text-sm font-medium text-text-primary">Streams by release</h2>
      {rows.length === 0 ? (
        <p className="text-xs text-text-secondary">No releases for this label yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.title}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="truncate text-text-primary">{r.title}</span>
                <span className="shrink-0 tabular-nums text-text-secondary">{r.streams.toLocaleString("en-US")}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--color-border)]">
                <div className="h-full rounded-full bg-accent" style={{ width: `${r.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

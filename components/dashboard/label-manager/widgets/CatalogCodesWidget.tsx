"use client";

import { useMemo } from "react";
import { Hash } from "lucide-react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import type { LabelWidgetProps } from "./types";

export function CatalogCodesWidget({ activeLabelId }: LabelWidgetProps) {
  const rows = useMemo(() => {
    return mockLabelCatalog
      .filter((r) => r.labelId === activeLabelId)
      .flatMap((r) => r.tracks.map((t) => ({ title: t.title, isrc: t.isrc, upc: r.upc })))
      .slice(0, 5);
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Hash size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Catalog codes</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-text-secondary">No tracks for this label yet.</p>
      ) : (
        <ul className="space-y-2 text-xs">
          {rows.map((r) => (
            <li key={r.isrc} className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-text-primary">{r.title}</span>
              <span className="shrink-0 font-mono tabular-nums text-text-secondary">{r.isrc}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

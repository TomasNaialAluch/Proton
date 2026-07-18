"use client";

import { useMemo } from "react";
import { AudioLines } from "lucide-react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import type { LabelWidgetProps } from "./types";

export function AudioMetadataWidget({ activeLabelId }: LabelWidgetProps) {
  const flagged = useMemo(() => {
    return mockLabelCatalog
      .filter((r) => r.labelId === activeLabelId)
      .flatMap((r) => r.issues.filter((i) => i.code === "metadata_error" || i.code === "missing_assets").map((i) => ({ ...i, title: r.title })));
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <AudioLines size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Audio &amp; metadata</h2>
      </div>
      {flagged.length === 0 ? (
        <p className="text-xs text-text-secondary">Nothing flagged.</p>
      ) : (
        <ul className="space-y-2 text-xs">
          {flagged.map((f, idx) => (
            <li key={idx} className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-text-primary">{f.title}</span>
              <span className="shrink-0 text-text-secondary">{f.label}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

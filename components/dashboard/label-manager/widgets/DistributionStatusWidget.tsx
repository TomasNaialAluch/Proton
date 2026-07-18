"use client";

import { useMemo } from "react";
import { mockLabelCatalog, type LabelReleaseStatus } from "@/lib/mock/label-manager/labelCatalog";
import type { LabelWidgetProps } from "./types";

const ORDER: LabelReleaseStatus[] = ["draft", "qa", "scheduled", "delivered", "live"];
const LABELS: Record<LabelReleaseStatus, string> = {
  draft: "Draft",
  qa: "QA",
  scheduled: "Scheduled",
  delivered: "Delivered",
  live: "Live",
};
const TONE: Record<LabelReleaseStatus, string> = {
  draft: "bg-text-secondary/40",
  qa: "bg-amber-500",
  scheduled: "bg-blue-500",
  delivered: "bg-violet-500",
  live: "bg-emerald-500",
};

export function DistributionStatusWidget({ activeLabelId }: LabelWidgetProps) {
  const counts = useMemo(() => {
    const releases = mockLabelCatalog.filter((r) => r.labelId === activeLabelId);
    const out: Record<LabelReleaseStatus, number> = { draft: 0, qa: 0, scheduled: 0, delivered: 0, live: 0 };
    releases.forEach((r) => out[r.status]++);
    return out;
  }, [activeLabelId]);

  const total = ORDER.reduce((s, k) => s + counts[k], 0) || 1;

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <h2 className="mb-3 text-sm font-medium text-text-primary">Distribution</h2>
      <div className="mb-3 flex h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        {ORDER.map((k) => (
          <div key={k} className={`h-full ${TONE[k]}`} style={{ width: `${(counts[k] / total) * 100}%` }} />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-1.5 text-xs">
        {ORDER.map((k) => (
          <li key={k} className="flex items-center gap-1.5 text-text-secondary">
            <span className={`size-2 rounded-full ${TONE[k]}`} />
            {LABELS[k]} <span className="ml-auto tabular-nums text-text-primary">{counts[k]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

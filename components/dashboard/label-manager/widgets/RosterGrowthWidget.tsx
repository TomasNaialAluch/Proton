"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import type { LabelWidgetProps } from "./types";

/** New framing vs. the producer side's "Listeners growth" — a label cares
 *  about artists gained, not individual listeners. Derived from how many
 *  distinct artists have a release in the catalog, no new mock data. */
export function RosterGrowthWidget({ activeLabelId }: LabelWidgetProps) {
  const artistCount = useMemo(() => {
    const ids = new Set(mockLabelCatalog.filter((r) => r.labelId === activeLabelId).map((r) => r.artistId));
    return ids.size;
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Users size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Roster growth</h2>
      </div>
      <p className="text-2xl font-medium tabular-nums text-text-primary">{artistCount}</p>
      <p className="mt-1 text-xs text-text-secondary">artists with a release on this label</p>
    </section>
  );
}

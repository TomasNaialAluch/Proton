"use client";

import { useMemo } from "react";
import LabelBreakdownBars from "@/components/dashboard/label-manager/LabelBreakdownBars";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { buildMockRevenue } from "@/lib/mock/label-manager/labelRevenue";
import type { LabelWidgetProps } from "./types";

export function TopTerritoriesWidget({ activeLabelId }: LabelWidgetProps) {
  const territories = useMemo(() => {
    const releases = mockLabelCatalog.filter((r) => r.labelId === activeLabelId);
    return buildMockRevenue(releases).territories;
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <LabelBreakdownBars data={territories} label="Top territories" />
    </section>
  );
}

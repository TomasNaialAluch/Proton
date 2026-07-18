"use client";

import { useMemo } from "react";
import LabelBreakdownBars from "@/components/dashboard/label-manager/LabelBreakdownBars";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { buildMockRevenue } from "@/lib/mock/label-manager/labelRevenue";
import type { LabelWidgetProps } from "./types";

export function RoyaltiesByStoreWidget({ activeLabelId }: LabelWidgetProps) {
  const dsp = useMemo(() => {
    const releases = mockLabelCatalog.filter((r) => r.labelId === activeLabelId);
    return buildMockRevenue(releases).dsp;
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <LabelBreakdownBars data={dsp} label="Royalties by store" />
    </section>
  );
}

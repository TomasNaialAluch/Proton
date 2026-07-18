"use client";

import { useMemo } from "react";
import LabelRevenueTrendChart from "@/components/dashboard/label-manager/LabelRevenueTrendChart";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { buildMockRevenue } from "@/lib/mock/label-manager/labelRevenue";
import type { LabelWidgetProps } from "./types";

export function RevenueTrendWidget({ activeLabelId }: LabelWidgetProps) {
  const revenue = useMemo(() => {
    const releases = mockLabelCatalog.filter((r) => r.labelId === activeLabelId);
    return buildMockRevenue(releases);
  }, [activeLabelId]);

  const totalRevenue = revenue.trend.reduce((s, p) => s + p.revenue, 0);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-text-primary">Revenue trend</h2>
          <p className="mt-0.5 text-xs text-text-secondary">Last 6 months</p>
        </div>
        <span className="text-xs font-medium text-accent">${totalRevenue.toLocaleString("en-US")}</span>
      </div>
      <LabelRevenueTrendChart data={revenue.trend} />
    </section>
  );
}

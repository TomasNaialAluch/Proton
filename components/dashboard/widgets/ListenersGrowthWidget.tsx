"use client";

import { Users } from "lucide-react";
import { mockListenersStats } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function ListenersGrowthWidget(_props: DashboardWidgetProps) {
  const { total, delta7d, delta28d, series7 } = mockListenersStats;
  const max = Math.max(...series7);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Listeners</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <p className="text-2xl font-semibold tabular-nums text-text-primary">
        {total.toLocaleString("en-US")}
      </p>
      <p className="mt-1 text-xs text-text-secondary">Monthly listeners · sample data</p>
      <div className="mt-3 flex gap-3 text-xs">
        <span className="rounded-lg bg-accent/10 px-2 py-1 font-medium text-accent">7d {delta7d}</span>
        <span className="rounded-lg bg-[var(--color-border)] px-2 py-1 font-medium text-text-secondary">
          28d {delta28d}
        </span>
      </div>
      <div className="mt-4 flex h-12 items-end gap-1">
        {series7.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-accent/40 transition-colors hover:bg-accent/60"
            style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
            title={v.toLocaleString()}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-text-secondary">Last 7 data points (mock)</p>
    </section>
  );
}

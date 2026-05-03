"use client";

import { Globe2 } from "lucide-react";
import { mockTopTerritories } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function TopTerritoriesWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Top territories</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-3">
        {mockTopTerritories.map((row) => (
          <li key={row.code}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-text-primary">
                {row.code} · {row.name}
              </span>
              <span className="tabular-nums text-text-secondary">{row.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
              <div className="h-full rounded-full bg-accent" style={{ width: `${row.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

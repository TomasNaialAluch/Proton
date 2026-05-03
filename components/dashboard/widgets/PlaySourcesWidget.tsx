"use client";

import { PieChart } from "lucide-react";
import { mockPlaySources } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function PlaySourcesWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Play sources</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <div className="mb-3 flex h-3 overflow-hidden rounded-full">
        {mockPlaySources.map((s) => (
          <div key={s.label} className={`${s.color}`} style={{ width: `${s.pct}%` }} title={`${s.label} ${s.pct}%`} />
        ))}
      </div>
      <ul className="space-y-2 text-xs">
        {mockPlaySources.map((s) => (
          <li key={s.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-text-primary">
              <span className={`size-2 shrink-0 rounded-full ${s.color}`} />
              {s.label}
            </span>
            <span className="tabular-nums text-text-secondary">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

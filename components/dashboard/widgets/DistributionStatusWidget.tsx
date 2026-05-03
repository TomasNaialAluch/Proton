"use client";

import { Truck } from "lucide-react";
import { mockDistributionRows } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

const badge: Record<(typeof mockDistributionRows)[number]["state"], string> = {
  "In review": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Live: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Rejected: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export function DistributionStatusWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Distribution</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-2">
        {mockDistributionRows.map((row) => (
          <li
            key={row.name}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] px-2.5 py-2 text-xs"
          >
            <div className="min-w-0">
              <p className="font-medium text-text-primary">{row.name}</p>
              <p className="text-text-secondary">{row.store}</p>
            </div>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge[row.state]}`}>
              {row.state}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

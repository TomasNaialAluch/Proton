"use client";

import { Store } from "lucide-react";
import { mockRoyaltiesByStore } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function RoyaltiesByStoreWidget(_props: DashboardWidgetProps) {
  const max = Math.max(...mockRoyaltiesByStore.map((r) => r.amount));

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Royalties by store</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-3">
        {mockRoyaltiesByStore.map((row) => (
          <li key={row.store}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-text-primary">{row.store}</span>
              <span className="tabular-nums font-medium text-text-primary">${row.amount.toFixed(2)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
              <div
                className="h-full rounded-full bg-accent/80"
                style={{ width: `${(row.amount / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

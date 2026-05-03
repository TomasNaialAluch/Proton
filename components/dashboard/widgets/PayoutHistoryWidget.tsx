"use client";

import { Banknote } from "lucide-react";
import { mockPayoutHistory } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function PayoutHistoryWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Banknote size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Payout history</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {mockPayoutHistory.map((row) => (
          <li key={row.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm text-text-primary">{row.date}</p>
              <p className="text-[10px] uppercase tracking-wide text-text-secondary">{row.status}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-accent">${row.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

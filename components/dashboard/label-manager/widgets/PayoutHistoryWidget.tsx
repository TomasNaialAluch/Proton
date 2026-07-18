"use client";

import { CreditCard } from "lucide-react";
import { mockLabelStatementRuns } from "@/lib/mock/label-manager/labelStatements";
import type { LabelWidgetProps } from "./types";

/** Statement runs aren't per-label in the mock yet — see the same note on
 *  `StatementsProgressWidget`. Shows the last 3 runs' totals. */
export function PayoutHistoryWidget(_props: LabelWidgetProps) {
  const runs = mockLabelStatementRuns.map((run) => ({
    period: run.period,
    total: run.lines.reduce((s, l) => s + l.netUsd, 0),
  }));

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <CreditCard size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Payout history</h2>
      </div>
      <ul className="space-y-2 text-xs">
        {runs.map((r) => (
          <li key={r.period} className="flex items-center justify-between">
            <span className="text-text-primary">{r.period}</span>
            <span className="tabular-nums text-text-secondary">
              ${r.total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

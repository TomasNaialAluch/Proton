"use client";

import { useMemo } from "react";
import { mockLabelStatementRuns } from "@/lib/mock/label-manager/labelStatements";
import type { LabelWidgetProps } from "./types";

/** `activeLabelId` unused today — statement runs aren't per-label in the
 *  mock yet (see mockLabelStatementRuns), only per-artist. Kept in the
 *  prop signature for consistency with every other widget, and so this
 *  is trivial to scope once that data exists. */
export function StatementsProgressWidget(_props: LabelWidgetProps) {
  const run = mockLabelStatementRuns[0];

  const byStatus = useMemo(() => {
    const totals: Record<string, number> = { pending: 0, approved: 0, paid: 0 };
    run.lines.forEach((l) => {
      totals[l.status] += l.netUsd;
    });
    return totals;
  }, [run]);

  const total = byStatus.pending + byStatus.approved + byStatus.paid || 1;

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-primary">Statements</h2>
        <span className="text-xs text-text-secondary">{run.period}</span>
      </div>
      <div className="mb-3 flex h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <div className="h-full bg-amber-500" style={{ width: `${(byStatus.pending / total) * 100}%` }} />
        <div className="h-full bg-blue-500" style={{ width: `${(byStatus.approved / total) * 100}%` }} />
        <div className="h-full bg-emerald-500" style={{ width: `${(byStatus.paid / total) * 100}%` }} />
      </div>
      <ul className="space-y-1.5 text-xs">
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-secondary"><span className="size-2 rounded-full bg-amber-500" />Pending</span>
          <span className="tabular-nums text-text-primary">${byStatus.pending.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-secondary"><span className="size-2 rounded-full bg-blue-500" />Approved</span>
          <span className="tabular-nums text-text-primary">${byStatus.approved.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-secondary"><span className="size-2 rounded-full bg-emerald-500" />Paid</span>
          <span className="tabular-nums text-text-primary">${byStatus.paid.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        </li>
      </ul>
    </section>
  );
}

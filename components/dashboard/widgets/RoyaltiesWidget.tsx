"use client";

import Link from "next/link";
import { DollarSign, ChevronRight } from "lucide-react";
import { mockRoyaltySummary, payoutConfig } from "@/lib/mock/royalties";
import type { DashboardWidgetProps } from "./types";

/** Widget de regalías (mock). Acepta `DashboardWidgetProps` por uniformidad del registro; no los usa. */
export default function RoyaltiesWidget(_props: DashboardWidgetProps) {
  const { totalAccumulated, currency } = mockRoyaltySummary;
  const { threshold, nextStatementDate, nextStatementPeriod, paymentMethod, token } = payoutConfig;

  const pct = Math.min((totalAccumulated / threshold) * 100, 100);
  const remaining = (threshold - totalAccumulated).toFixed(2);

  const nextDate = new Date(nextStatementDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Royalties</h2>
        </div>
        <Link
          href="/dashboard/royalties"
          className="flex items-center gap-0.5 text-xs text-accent transition-opacity hover:opacity-80"
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums text-text-primary">
            ${totalAccumulated.toFixed(2)}
          </span>
          <span className="text-xs text-text-secondary">{currency}</span>
        </div>
        <p className="mt-0.5 text-xs text-text-secondary">Accumulated · All withheld</p>
      </div>

      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-text-secondary">Progress to payout</span>
          <span className="text-xs font-medium text-text-primary">{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] tabular-nums text-text-secondary">${totalAccumulated.toFixed(2)}</span>
          <span className="text-[10px] tabular-nums text-text-secondary">${threshold.toFixed(2)} threshold</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-secondary">Next statement</p>
          <p className="mt-0.5 text-xs text-text-primary">
            {nextDate} · {nextStatementPeriod}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary">Payout via</p>
          <p className="mt-0.5 text-xs font-medium text-accent">
            {paymentMethod} · {token}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-3 py-2">
        <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-400">
          <span className="font-semibold">${remaining} more needed</span> to reach the $100 payout threshold.
          Payments are manual — check your email when the statement arrives.
        </p>
      </div>
    </section>
  );
}

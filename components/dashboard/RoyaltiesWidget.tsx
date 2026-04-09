import Link from "next/link";
import { DollarSign, ChevronRight } from "lucide-react";
import { mockRoyaltySummary, payoutConfig } from "@/lib/mock/royalties";

export default function RoyaltiesWidget() {
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
    <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Royalties</h2>
        </div>
        <Link
          href="/dashboard/royalties"
          className="text-xs text-accent flex items-center gap-0.5 hover:opacity-80 transition-opacity"
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>

      {/* Amount + currency */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold text-text-primary tabular-nums">
            ${totalAccumulated.toFixed(2)}
          </span>
          <span className="text-xs text-text-secondary">{currency}</span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5">Accumulated · All withheld</p>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-secondary">Progress to payout</span>
          <span className="text-xs font-medium text-text-primary">{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-text-secondary tabular-nums">
            ${totalAccumulated.toFixed(2)}
          </span>
          <span className="text-[10px] text-text-secondary tabular-nums">
            ${threshold.toFixed(2)} threshold
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <div>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider">Next statement</p>
          <p className="text-xs text-text-primary mt-0.5">{nextDate} · {nextStatementPeriod}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-secondary uppercase tracking-wider">Payout via</p>
          <p className="text-xs font-medium text-accent mt-0.5">{paymentMethod} · {token}</p>
        </div>
      </div>

      {/* Warning: still needs $X.XX */}
      <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/20">
        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          <span className="font-semibold">${remaining} more needed</span> to reach the $100 payout threshold.
          Payments are manual — check your email when the statement arrives.
        </p>
      </div>

    </section>
  );
}

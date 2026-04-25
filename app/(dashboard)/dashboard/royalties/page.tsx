"use client";

import Link from "next/link";
import {
  DollarSign, ChevronRight, Clock, Wallet,
  TrendingUp, FileText, Download,
} from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { mockRoyalties, mockRoyaltySummary, payoutConfig } from "@/lib/mock/royalties";

const PRO_USER_ID = 67325;

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RoyaltiesPage() {
  const { totalAccumulated, currency } = mockRoyaltySummary;
  const { threshold, nextStatementDate, nextStatementPeriod, paymentMethod, token, network } = payoutConfig;

  const pct = Math.min((totalAccumulated / threshold) * 100, 100);
  const remaining = threshold - totalAccumulated;

  const nextDate = new Date(nextStatementDate).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const totalStreamed = mockRoyalties.reduce((s, r) => s + r.amount, 0);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Royalties" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Royalties</h1>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

        {/* Accumulated */}
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={14} className="text-text-secondary" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Total accumulated</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-text-primary tabular-nums">${fmt(totalAccumulated)}</span>
            <span className="text-sm text-text-secondary">{currency}</span>
          </div>
          <p className="text-xs text-text-secondary mb-4">All quarters · Withheld</p>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-text-secondary mb-1.5">
              <span>Payment progress</span>
              <span className="font-medium text-text-primary">{pct.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-[var(--color-border)] overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-text-secondary mt-1.5">
              <span>${fmt(totalAccumulated)}</span>
              <span>${fmt(threshold)} threshold</span>
            </div>
          </div>

          <p className="text-xs text-amber-500 dark:text-amber-400 mt-3">
            <span className="font-semibold">${fmt(remaining)}</span> remaining to reach the payment threshold
          </p>
        </div>

        {/* Payout config */}
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 flex flex-col gap-4">

          <div className="flex items-center gap-2">
            <Clock size={14} className="text-text-secondary" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Next statement</span>
          </div>

          <div>
            <p className="text-lg font-semibold text-text-primary">{nextDate}</p>
            <p className="text-sm text-text-secondary mt-0.5">Period {nextStatementPeriod}</p>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={13} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">Payment method</span>
              </div>
              <span className="text-xs font-medium text-accent">{paymentMethod} · {token}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Network</span>
              <span className="text-xs font-medium text-text-primary">{network}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Payment threshold</span>
              <span className="text-xs font-medium text-text-primary">${fmt(threshold)} USD</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <TrendingUp size={13} className="text-accent" />
            <span className="text-xs text-text-secondary">
              Statements are sent by email when the threshold is reached
            </span>
          </div>
        </div>
      </div>

      {/* ── Statement history ── */}
      <div className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Statement history</h2>
          </div>
          <span className="text-xs text-text-secondary">{mockRoyalties.length} quarters · ${fmt(totalStreamed)} USD</span>
        </div>

        {/* Table header */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2.5
          border-b border-[var(--color-border)] bg-[var(--color-border)]/30">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Period</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary text-right">Amount</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Status</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Actions</span>
        </div>

        {/* Rows */}
        <ul className="divide-y divide-[var(--color-border)]">
          {mockRoyalties.map((r) => (
            <li key={r.id}>
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-border)]/30 transition-colors">

                {/* Period info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{r.period}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{r.dateRange}</p>
                </div>

                {/* Amount */}
                <span className="text-sm font-semibold text-text-primary tabular-nums shrink-0">
                  ${fmt(r.amount)}
                </span>

                {/* Status badge */}
                <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                  bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  WITHHELD
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/dashboard/royalties/${r.qid}`}
                    className="flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity px-2.5 py-1.5 rounded-lg hover:bg-accent/10"
                  >
                    Ver <ChevronRight size={12} />
                  </Link>
                  <a
                    href={`https://soundsystem.protonradio.com/statementCSVDownload.php?id=${PRO_USER_ID}&qid=${r.qid}&type=rev_report`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-7 flex items-center justify-center rounded-lg
                      text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
                      transition-colors"
                    title="Download CSV"
                  >
                    <Download size={13} />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-border)]/20">
          <p className="text-xs text-text-secondary text-center">
            Payments are processed manually when your balance reaches the $100 USD threshold · Quarters are issued quarterly
          </p>
        </div>
      </div>
    </main>
  );
}

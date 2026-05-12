"use client";

import { useMemo, useState } from "react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ArtistScopeFilter from "@/components/dashboard/label-manager/ArtistScopeFilter";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import LabelStatementRunPanel from "@/components/dashboard/label-manager/LabelStatementRunPanel";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import {
  mockLabelStatementRuns,
  type StatementPeriod,
} from "@/lib/mock/label-manager/labelStatements";
import StatusBadge from "@/components/ui/StatusBadge";

export default function LabelStatementsPage() {
  const view = usePrototypeViewStore((s) => s.view);
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);
  const [period, setPeriod] = useState<StatementPeriod>("2026 Q2");

  const balances = useMemo(() => {
    const run = mockLabelStatementRuns.find((r) => r.period === period) ?? mockLabelStatementRuns[0];
    const lines = activeArtistId ? run.lines.filter((l) => l.artistId === activeArtistId) : run.lines;
    const total = lines.reduce((s, l) => s + l.netUsd, 0);
    return { lines: lines.sort((a, b) => b.netUsd - a.netUsd), total };
  }, [period, activeArtistId]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Statements" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Statements</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Royalty runs, approvals, and payouts.
        </p>
      </header>

      {view === "label_manager" && (
        <section className="mb-4">
          <ArtistScopeFilter />
          <div className="mt-3">
            <ScopeFilterChips />
          </div>
        </section>
      )}

      {view !== "label_manager" ? (
        <section className="rounded-2xl border border-[var(--color-border)] bg-surface p-4">
          <p className="text-sm text-text-secondary">
            Producer Statements is not implemented in this prototype yet.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          <LabelStatementRunPanel
            runs={mockLabelStatementRuns}
            activePeriod={period}
            onPeriodChange={setPeriod}
            scopedArtistId={activeArtistId}
          />

          <section className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
            <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
              <div className="min-w-0">
                <h2 className="text-sm font-medium text-text-primary">Balances</h2>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Net balances per artist (mock). Use Artist focus to zoom.
                </p>
              </div>
              <StatusBadge tone="info">${balances.total.toLocaleString("en-US")}</StatusBadge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Artist
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {balances.lines.map((l) => (
                    <tr key={l.artistId} className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">
                        {l.artistName}
                      </td>
                      <td className="px-2 py-3">
                        <StatusBadge
                          tone={l.status === "paid" ? "success" : l.status === "approved" ? "info" : "warning"}
                        >
                          {l.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-text-primary">
                        ${l.netUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[var(--color-border)]">
              <p className="text-xs text-text-secondary">
                Payouts are mocked. In a real build this would connect to payment rails and audit logs.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}


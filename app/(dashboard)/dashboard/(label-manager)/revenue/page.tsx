"use client";

import { useMemo } from "react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ArtistScopeFilter from "@/components/dashboard/label-manager/ArtistScopeFilter";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import LabelRevenueTrendChart from "@/components/dashboard/label-manager/LabelRevenueTrendChart";
import LabelBreakdownBars from "@/components/dashboard/label-manager/LabelBreakdownBars";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { buildMockRevenue } from "@/lib/mock/label-manager/labelRevenue";
import StatusBadge from "@/components/ui/StatusBadge";

export default function LabelRevenuePage() {
  const view = usePrototypeViewStore((s) => s.view);
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);

  const scopedReleases = useMemo(() => {
    return mockLabelCatalog.filter((r) => {
      if (mode === "label" && activeLabelId && r.labelId !== activeLabelId) return false;
      if (activeArtistId && r.artistId !== activeArtistId) return false;
      return true;
    });
  }, [mode, activeLabelId, activeArtistId]);

  const revenue = useMemo(() => buildMockRevenue(scopedReleases), [scopedReleases]);
  const kpis = useMemo(() => {
    const streams = revenue.trend.reduce((s, p) => s + p.streams, 0);
    const dollars = revenue.trend.reduce((s, p) => s + p.revenue, 0);
    return { streams, dollars };
  }, [revenue.trend]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Revenue" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Revenue</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Label-wide streams and income reporting.
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
            Producer Revenue is not implemented in this prototype yet.
          </p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
            <KpiCard label="Scoped releases" value={scopedReleases.length.toString()} tone="info" />
            <KpiCard label="Streams (6m)" value={kpis.streams.toLocaleString("en-US")} tone="neutral" />
            <KpiCard label="Revenue (6m)" value={`$${kpis.dollars.toLocaleString("en-US")}`} tone="success" />
            <KpiCard label="Reports" value="Mock" tone="neutral" />
          </section>

          <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0 mb-6">
            <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-text-primary">Revenue trend</h2>
                <StatusBadge tone="info">Last 6 months</StatusBadge>
              </div>
              <LabelRevenueTrendChart data={revenue.trend} />
            </section>

            <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">
              <LabelBreakdownBars data={revenue.dsp} label="Top DSPs" />
            </section>
          </div>

          <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">
            <LabelBreakdownBars data={revenue.territories} label="Top territories" />
          </section>
        </>
      )}
    </main>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "info";
}) {
  const badgeTone =
    tone === "info" ? "info" : tone === "success" ? "success" : tone === "warning" ? "warning" : "neutral";
  return (
    <div className="bg-surface rounded-xl border border-[var(--color-border)] px-3 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <StatusBadge tone={badgeTone}>{tone}</StatusBadge>
      </div>
      <span className="text-2xl font-medium tabular-nums text-text-primary truncate">{value}</span>
    </div>
  );
}


"use client";

import { Suspense } from "react";
import StreamsChart from "../StreamsChart";
import type { DashboardWidgetProps } from "./types";

export function StreamsWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-text-primary">Streams</h2>
          <p className="mt-0.5 text-xs text-text-secondary">Last 6 months</p>
        </div>
        <span className="text-xs font-medium text-accent">+37% ↑</span>
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-[var(--color-border)]" />}>
        <StreamsChart />
      </Suspense>
    </section>
  );
}

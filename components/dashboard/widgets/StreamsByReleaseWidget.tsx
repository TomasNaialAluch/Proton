"use client";

import { Suspense } from "react";
import ReleasesChart from "../ReleasesChart";
import type { DashboardWidgetProps } from "./types";

export function StreamsByReleaseWidget({ tracks, isLoading }: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-text-primary">Streams by Release</h2>
          <p className="mt-0.5 text-xs text-text-secondary">All time</p>
        </div>
      </div>
      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-[var(--color-border)]" />
      ) : (
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-[var(--color-border)]" />}>
          <ReleasesChart tracks={tracks} />
        </Suspense>
      )}
    </section>
  );
}

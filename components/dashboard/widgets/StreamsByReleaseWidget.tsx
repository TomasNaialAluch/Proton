"use client";

import { Suspense } from "react";
import ReleasesChart from "../ReleasesChart";
import Skeleton from "@/components/ui/Skeleton";
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
        <Skeleton className="h-48" />
      ) : (
        <Suspense fallback={<Skeleton className="h-48" />}>
          <ReleasesChart tracks={tracks} />
        </Suspense>
      )}
    </section>
  );
}

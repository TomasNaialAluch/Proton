"use client";

import { Flame } from "lucide-react";
import { mockRisingTracks } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function RisingTracksWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-accent" />
          <h2 className="text-sm font-medium text-text-primary">Rising tracks</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {mockRisingTracks.map((row) => (
          <li key={row.title} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="truncate text-sm text-text-primary">{row.title}</span>
            <span className="shrink-0 text-xs font-semibold text-accent">{row.delta}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-text-secondary">vs previous period · sample</p>
    </section>
  );
}

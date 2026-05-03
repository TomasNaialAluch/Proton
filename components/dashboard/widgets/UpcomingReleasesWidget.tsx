"use client";

import { CalendarDays } from "lucide-react";
import { mockUpcomingReleases } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function UpcomingReleasesWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Upcoming releases</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-3">
        {mockUpcomingReleases.map((r) => (
          <li
            key={r.title}
            className="rounded-xl border border-[var(--color-border)] px-3 py-2.5 transition-colors hover:bg-[var(--color-border)]/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{r.title}</p>
                <p className="text-xs text-text-secondary">
                  {r.type} · {r.date}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                {r.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

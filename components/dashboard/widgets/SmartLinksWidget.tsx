"use client";

import { Link2 } from "lucide-react";
import { mockSmartLinks } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function SmartLinksWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Smart links</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-3">
        {mockSmartLinks.map((row) => (
          <li
            key={row.label}
            className="rounded-xl border border-[var(--color-border)] px-3 py-2.5 transition-colors hover:bg-[var(--color-border)]/30"
          >
            <p className="text-sm font-medium text-text-primary">{row.label}</p>
            <div className="mt-1 flex gap-4 text-xs text-text-secondary">
              <span>{row.clicks.toLocaleString()} clicks</span>
              <span>CTR {row.ctr}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

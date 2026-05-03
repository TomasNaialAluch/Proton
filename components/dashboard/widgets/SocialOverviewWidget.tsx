"use client";

import { Share2 } from "lucide-react";
import { mockSocialOverview } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function SocialOverviewWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Social</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-2">
        {mockSocialOverview.map((row) => (
          <li
            key={row.platform}
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs"
          >
            <span className="font-medium text-text-primary">{row.platform}</span>
            <span className="text-text-secondary">
              {row.posts} posts · {row.scheduled} scheduled
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

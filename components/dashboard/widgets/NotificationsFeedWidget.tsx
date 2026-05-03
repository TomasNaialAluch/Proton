"use client";

import { Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { mockNotifications } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

const icon = {
  payment: CheckCircle2,
  strike: AlertTriangle,
  approval: Bell,
} as const;

export function NotificationsFeedWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Notifications</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-3">
        {mockNotifications.map((n) => {
          const Icon = icon[n.kind];
          return (
            <li key={n.id} className="flex gap-2">
              <Icon size={14} className="mt-0.5 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="text-xs leading-snug text-text-primary">{n.text}</p>
                <p className="mt-0.5 text-[10px] text-text-secondary">{n.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

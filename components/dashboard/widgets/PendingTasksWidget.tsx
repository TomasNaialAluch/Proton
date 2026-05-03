"use client";

import { ListTodo } from "lucide-react";
import { mockPendingTasks } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function PendingTasksWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Pending tasks</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-2">
        {mockPendingTasks.map((t) => (
          <li
            key={t.id}
            className="flex items-start justify-between gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs"
          >
            <span className="text-text-primary">{t.label}</span>
            <span className="shrink-0 tabular-nums text-text-secondary">{t.due}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

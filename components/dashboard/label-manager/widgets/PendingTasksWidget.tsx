"use client";

import { useMemo } from "react";
import { ListTodo } from "lucide-react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import type { LabelWidgetProps } from "./types";

export function PendingTasksWidget({ activeLabelId }: LabelWidgetProps) {
  const issues = useMemo(() => {
    return mockLabelCatalog
      .filter((r) => r.labelId === activeLabelId)
      .flatMap((r) => r.issues.map((i) => ({ ...i, releaseTitle: r.title })));
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Pending tasks</h2>
        </div>
        {issues.length > 0 && (
          <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
            {issues.length}
          </span>
        )}
      </div>
      {issues.length === 0 ? (
        <p className="text-xs text-text-secondary">No open issues.</p>
      ) : (
        <ul className="space-y-2">
          {issues.map((i, idx) => (
            <li
              key={`${i.releaseTitle}-${idx}`}
              className="flex items-start justify-between gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs"
            >
              <span className="text-text-primary">{i.label}</span>
              <span
                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  i.severity === "blocker" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"
                }`}
              >
                {i.releaseTitle}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import { Volume2 } from "lucide-react";
import { mockAudioMetadata } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function AudioMetadataWidget(_props: DashboardWidgetProps) {
  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Audio & metadata</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <ul className="space-y-2">
        {mockAudioMetadata.map((row) => (
          <li
            key={row.track}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-text-primary">{row.track}</span>
              <span className="shrink-0 font-mono tabular-nums text-text-secondary">{row.lufs} LUFS</span>
            </div>
            {row.issue ? (
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">{row.issue}</p>
            ) : (
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">Within target</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

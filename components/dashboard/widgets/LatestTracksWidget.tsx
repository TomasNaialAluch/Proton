"use client";

import { ChevronRight, Play } from "lucide-react";
import type { DashboardWidgetProps } from "./types";

export function LatestTracksWidget({ isLoading, topTracks }: DashboardWidgetProps) {
  return (
    <section className="h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-surface">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h2 className="text-sm font-medium text-text-primary">Latest Tracks</h2>
        <button
          type="button"
          className="flex items-center gap-0.5 text-xs text-accent transition-opacity hover:opacity-80"
        >
          See all <ChevronRight size={12} />
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-3 px-4 pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--color-border)]" />
          ))}
        </div>
      ) : (
        <ul>
          {topTracks.map((track, index) => (
            <li
              key={track.id}
              className="flex items-center gap-3 border-t border-[var(--color-border)] px-4 py-3 transition-colors hover:bg-[var(--color-border)]"
            >
              <span className="w-5 shrink-0 text-center text-xs font-medium text-text-secondary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm leading-snug text-text-primary">{track.title}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{track.release.label.name}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="tabular-nums text-xs text-text-secondary">
                  {track.release.date.slice(0, 4)}
                </span>
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-full bg-accent/10 transition-colors hover:bg-accent/20"
                >
                  <Play size={12} className="translate-x-px text-accent" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

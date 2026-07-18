"use client";

import { useMemo } from "react";
import { CalendarClock } from "lucide-react";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import type { LabelWidgetProps } from "./types";

export function UpcomingReleasesWidget({ activeLabelId }: LabelWidgetProps) {
  const upcoming = useMemo(() => {
    const now = Date.now();
    return mockLabelCatalog
      .filter((r) => r.labelId === activeLabelId && r.status !== "live")
      .filter((r) => new Date(r.releaseDate).getTime() >= now || r.status === "scheduled" || r.status === "draft" || r.status === "qa")
      .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
      .slice(0, 5);
  }, [activeLabelId]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarClock size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Upcoming releases</h2>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-xs text-text-secondary">Nothing scheduled.</p>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((r) => {
            const artist = mockRosterArtists.find((a) => a.id === r.artistId)?.name ?? "Unknown artist";
            return (
              <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">{r.title}</p>
                  <p className="truncate text-text-secondary">{artist}</p>
                </div>
                <span className="shrink-0 tabular-nums text-text-secondary">
                  {new Date(r.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

"use client";

import { Play } from "lucide-react";
import type { ChartEntry } from "@/lib/api/charts";

interface ChartRowProps {
  entry: ChartEntry;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ChartRow({ entry }: ChartRowProps) {
  const { position, track } = entry;

  return (
    <div
      className="group flex items-center gap-4 px-3 py-3 rounded-lg transition-colors cursor-default"
      style={{ borderBottom: "1px solid var(--color-border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Position */}
      <div className="w-7 shrink-0 text-right">
        <span
          className="text-sm font-medium tabular-nums group-hover:hidden"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {position}
        </span>
        <span className="hidden group-hover:inline" style={{ color: "var(--color-accent)" }}>
          <Play size={14} fill="currentColor" />
        </span>
      </div>

      {/* Artwork placeholder */}
      <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ background: "var(--color-border)" }}>
        {track.artwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={track.artwork} alt="" className="w-full h-full object-cover rounded" />
        ) : (
          <span className="text-[10px] font-bold" style={{ color: "var(--color-text-secondary)" }}>
            {position}
          </span>
        )}
      </div>

      {/* Title + Artist */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {track.title}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
          {track.artist.name}
        </p>
      </div>

      {/* Label — hidden on small screens */}
      <span
        className="hidden md:block text-xs truncate max-w-[120px]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {track.label.name}
      </span>

      {/* Date */}
      <span
        className="hidden sm:block text-xs tabular-nums shrink-0"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {formatDate(track.release.date)}
      </span>

      {/* Duration */}
      <span
        className="text-xs tabular-nums shrink-0"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {track.duration}
      </span>
    </div>
  );
}

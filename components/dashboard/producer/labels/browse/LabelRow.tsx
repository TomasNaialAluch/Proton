"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProtonLabel } from "@/types/label";

function activityScore(label: ProtonLabel): number {
  const daysSinceLast = label.lastReleaseDate
    ? (Date.now() - new Date(label.lastReleaseDate).getTime()) / 86_400_000
    : 999;
  const recency = Math.max(0, 1 - daysSinceLast / 365);
  const size = Math.log10(Math.max(1, label.releaseCount ?? 1)) / 4;
  return recency * 0.7 + size * 0.3;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function LabelRow({ label }: { label: ProtonLabel }) {
  const score = activityScore(label);
  const barColor = score > 0.6 ? "#1abc9c" : score > 0.3 ? "#f59e0b" : "#4b5563";

  return (
    <Link
      href={`/dashboard/labels/${label.slug}`}
      className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-border)]/30 transition-colors"
    >
      <div
        className="size-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
        style={{
          background: "rgba(26,188,156,0.10)",
          color: "#1ABC9C",
          border: "1px solid rgba(26,188,156,0.18)",
        }}
      >
        {label.name.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="text-sm font-semibold text-text-primary">{label.name}</p>
          {label.demoStatus === "open" && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
              Open
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          {label.releaseCount !== undefined && <span>{label.releaseCount} releases</span>}
          {label.lastReleaseDate && (
            <>
              <span className="opacity-30">·</span>
              <span>Last: {formatDate(label.lastReleaseDate)}</span>
            </>
          )}
        </div>

        <div className="mt-2 h-0.5 w-20 rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.round(score * 100)}%`, background: barColor }}
          />
        </div>
      </div>

      <ChevronRight size={14} className="shrink-0 text-text-secondary" />
    </Link>
  );
}

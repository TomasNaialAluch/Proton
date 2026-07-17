import type { ReactNode } from "react";
import Skeleton from "@/components/ui/Skeleton";

/** Shared by the dashboard home (`DashboardContent.tsx`) and Performance —
 *  those used to be two near-identical components (`StatCard` / `KpiCard`)
 *  copy-pasted from each other. See docs/README-codebase-architecture-review.md. */
export default function KpiCard({
  icon,
  label,
  value,
  accent = false,
  small = false,
  isLoading = false,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  accent?: boolean;
  small?: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl border border-[var(--color-border)] px-3 py-4 flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${accent ? "text-accent" : "text-text-secondary"}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      {isLoading ? (
        <Skeleton className={small ? "h-5 w-16" : "h-7 w-16"} />
      ) : (
        <span
          className={`font-semibold tabular-nums truncate ${small ? "text-base" : "text-2xl"} ${
            accent ? "text-accent" : "text-text-primary"
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}

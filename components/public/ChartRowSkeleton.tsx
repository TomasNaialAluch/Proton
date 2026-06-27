"use client";

import Skeleton from "@/components/ui/Skeleton";

/** Matches ChartRow's column layout (position, artwork, title/artist, label, date, time). */
export default function ChartRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 px-3 py-3"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <span className="w-7 shrink-0" />
      <Skeleton className="w-9 h-9 shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="hidden md:block h-3 w-[80px] shrink-0" />
      <Skeleton className="hidden sm:block h-3 w-10 shrink-0" />
      <Skeleton className="h-3 w-8 shrink-0" />
    </div>
  );
}

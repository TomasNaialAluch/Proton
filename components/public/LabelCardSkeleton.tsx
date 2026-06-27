"use client";

import Skeleton from "@/components/ui/Skeleton";

/** Matches LabelCard's layout (logo square + name line + genres line). */
export default function LabelCardSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-3 p-5 rounded-xl border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <Skeleton circle={false} className="w-16 h-16 rounded-lg" />
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-3 w-14" />
    </div>
  );
}

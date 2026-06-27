"use client";

import Skeleton from "@/components/ui/Skeleton";

/** Matches MixCard's layout (aspect-video artwork + title line + meta line). */
export default function MixCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-col gap-1.5 px-0.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

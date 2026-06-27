"use client";

import Skeleton from "@/components/ui/Skeleton";

/**
 * Matches the card markup in discover/page.tsx's grid (CoverArt-sized square
 * + title line + producer/genre line). Not wired in yet — mockDiscoverTracks
 * is synchronous, ready for when Discover moves to a real paginated fetch.
 */
export default function DiscoverCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-surface p-3">
      <Skeleton className="aspect-square mb-3" />
      <Skeleton className="h-3.5 w-full mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

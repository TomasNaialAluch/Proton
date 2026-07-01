"use client";

import Skeleton from "@/components/ui/Skeleton";

/**
 * Matches the row layout shared by the Suggestions and Messages tabs in
 * connections/page.tsx. Not wired in yet — mockConnectionSuggestions /
 * mockConversations are synchronous, ready for when suggestions come from a
 * real matching backend.
 */
export default function ConnectionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-surface px-4 py-3">
      <Skeleton circle className="size-9 shrink-0" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

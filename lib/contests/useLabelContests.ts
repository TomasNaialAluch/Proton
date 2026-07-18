"use client";

import { useContestsStore } from "@/lib/store/label-manager/contestsStore";
import type { ProtonLabel } from "@/types/label";

/**
 * A label's contests, merging the mock-seeded ones (`label.activeContests`)
 * with any created live via the label-manager's contest-creation form
 * (`useContestsStore`). Every producer-facing read site (`ActiveContests`,
 * `ContestDetailClient`, `TrackRemixCard`) should go through this instead
 * of reading `label.activeContests` directly, so a contest the label
 * manager just created shows up immediately. See
 * docs/feature-label-manager-toolkit.md, "3. Contest creation".
 */
export function useLabelContests(label: Pick<ProtonLabel, "id" | "activeContests">) {
  const extra = useContestsStore((s) =>
    s.extraContests.filter((e) => e.labelId === label.id).map((e) => e.contest)
  );
  return [...(label.activeContests ?? []), ...extra];
}

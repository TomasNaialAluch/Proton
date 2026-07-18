"use client";

import { useDemoPolicyStore } from "@/lib/store/label-manager/demoPolicyStore";
import type { ProtonLabel } from "@/types/label";

/**
 * A label with any live demo-policy edits applied on top of the
 * mock-seeded fields. `LabelProfileClient` is the single place that
 * resolves a `ProtonLabel` and passes it down to `LabelDetailHeader`,
 * `DemoPolicyCard`, and the submit-demo gating logic — merging here means
 * none of those components need to change. See
 * docs/feature-label-manager-toolkit.md, "4. Demo policy management".
 */
export function useEffectiveLabel(label: ProtonLabel): ProtonLabel {
  const override = useDemoPolicyStore((s) => s.overrides[label.id]);
  if (!override) return label;
  return {
    ...label,
    ...(override.demoStatus !== undefined ? { demoStatus: override.demoStatus } : {}),
    ...(override.demoGenres !== undefined ? { demoGenres: override.demoGenres } : {}),
    ...(override.demoPolicy !== undefined ? { demoPolicy: override.demoPolicy } : {}),
  };
}

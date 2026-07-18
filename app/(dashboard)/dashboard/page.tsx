"use client";

import DashboardContent from "@/components/dashboard/DashboardContent";
import LabelDashboardHome from "@/components/dashboard/label-manager/LabelDashboardHome";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";

/**
 * Shared `/dashboard` route — branches by shell, same pattern as
 * `app/(dashboard)/dashboard/releases/page.tsx`. Was previously only
 * `(producer)/page.tsx`, which meant label-manager had no Home at all and
 * landed on Roster instead (`LABEL_MANAGER_ENTRY` pointed there). See
 * docs/README-label-manager-rebuild-plan.md, section 6.
 */
export default function DashboardPage() {
  const view = usePrototypeViewStore((s) => s.view);
  return view === "label_manager" ? <LabelDashboardHome /> : <DashboardContent />;
}

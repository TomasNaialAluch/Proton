"use client";

import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import {
  LABEL_MANAGER_ENTRY,
  PRODUCER_ENTRY,
  isLabelShellPath,
  isProducerShellPath,
} from "@/lib/dashboard/dashboardShellRouting";

/**
 * Keeps URL aligned with the active prototype shell: label manager vs producer.
 * Runs after layout paint to avoid a long blank frame before PrototypePersistGate opens.
 */
export default function DashboardShellRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const view = usePrototypeViewStore((s) => s.view);

  useLayoutEffect(() => {
    if (!pathname.startsWith("/dashboard")) return;

    if (view === "label_manager" && isProducerShellPath(pathname)) {
      router.replace(LABEL_MANAGER_ENTRY);
      return;
    }

    if (view === "producer" && isLabelShellPath(pathname)) {
      router.replace(PRODUCER_ENTRY);
    }
  }, [view, pathname, router]);

  return null;
}

"use client";

import type { ReactNode } from "react";
import { usePlayerBottomPaddingClass } from "@/components/player/global-player/usePlayerBottomPaddingClass";
import DashboardPersonaChip from "@/components/dashboard/DashboardPersonaChip";
import DashboardShellRedirect from "@/components/dashboard/DashboardShellRedirect";
import PrototypePersistGate from "@/components/dashboard/PrototypePersistGate";

/**
 * Columna de contenido del dashboard con el mismo padding inferior que el área
 * pública cuando el reproductor global está visible.
 */
export default function DashboardMainArea({ children }: { children: ReactNode }) {
  const bottomPad = usePlayerBottomPaddingClass();
  return (
    <div className={`relative flex-1 min-w-0 flex flex-col min-h-screen ${bottomPad}`}>
      <PrototypePersistGate>
        <DashboardShellRedirect />
        <DashboardPersonaChip />
        {children}
      </PrototypePersistGate>
    </div>
  );
}

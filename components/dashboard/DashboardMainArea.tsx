"use client";

import type { ReactNode } from "react";
import { usePlayerBottomPaddingClass } from "@/components/player/global-player/usePlayerBottomPaddingClass";

/**
 * Columna de contenido del dashboard con el mismo padding inferior que el área
 * pública cuando el reproductor global está visible.
 */
export default function DashboardMainArea({ children }: { children: ReactNode }) {
  const bottomPad = usePlayerBottomPaddingClass();
  return (
    <div className={`flex-1 min-w-0 flex flex-col min-h-screen ${bottomPad}`}>{children}</div>
  );
}

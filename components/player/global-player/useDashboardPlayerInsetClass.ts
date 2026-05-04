"use client";

import { usePathname } from "next/navigation";
import { useDashboardSidebarStore } from "@/lib/store/dashboardSidebarStore";

/**
 * Offset izquierdo del reproductor en dashboard desktop para no tapar el sidebar.
 * En público y en móvil: ancho completo (`left-0`).
 */
export function useDashboardPlayerInsetClass(): string {
  const pathname = usePathname();
  const collapsed = useDashboardSidebarStore((s) => s.collapsed);

  if (!pathname.startsWith("/dashboard")) {
    return "left-0";
  }

  return collapsed ? "left-0 lg:left-16" : "left-0 lg:left-64";
}

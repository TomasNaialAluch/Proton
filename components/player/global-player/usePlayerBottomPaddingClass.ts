"use client";

import { usePathname } from "next/navigation";
import { usePlayerStore } from "@/lib/store/playerStore";

/** Padding inferior cuando el reproductor global está activo (barra, FAB o strip dashboard móvil). */
export function usePlayerBottomPaddingClass(): string {
  const pathname = usePathname();
  const currentMix = usePlayerStore((s) => s.currentMix);
  const playerChrome = usePlayerStore((s) => s.playerChrome);

  if (!currentMix) return "pb-6";

  const dashboard = pathname.startsWith("/dashboard");

  if (dashboard) {
    // Móvil: mini reproductor (~bottom-16) + strip — margen extra; desktop lg+: barra/FAB global
    return playerChrome === "expanded"
      ? "pb-44 max-lg:pb-48 lg:pb-36"
      : "pb-28 max-lg:pb-36 lg:pb-6";
  }

  return playerChrome === "expanded" ? "pb-36" : "pb-6";
}

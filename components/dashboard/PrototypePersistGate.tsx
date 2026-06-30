"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Zustand `persist` rehydrates from localStorage asynchronously. Until then, the
 * store still has its initial defaults (e.g. `view: "producer"`), so pages that
 * branch on `view` would briefly show the wrong shell after a full load or hard refresh.
 *
 * Also handles the race where hydration finishes before `onFinishHydration` subscribes.
 *
 * `ready` MUST start `false` unconditionally — reading `persist.hasHydrated()` in the
 * initializer let the very first client render (used to match the SSR output) see a
 * different value than the server (which is always `false`, since there's no
 * `localStorage` there). That mismatch threw a hydration error on every load.
 */
export default function PrototypePersistGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (usePrototypeViewStore.persist.hasHydrated()) setReady(true);
  }, []);

  useEffect(() => {
    const persist = usePrototypeViewStore.persist;
    if (persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = persist.onFinishHydration(() => setReady(true));
    const t = window.setTimeout(() => {
      if (persist.hasHydrated()) setReady(true);
    }, 0);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex flex-1" aria-busy="true" aria-label="Loading dashboard">
        {/* Sidebar shell — mirrors AppSidebar's structure so the real one mounts without a jump. */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen border-r border-[var(--color-border)] bg-surface px-5 py-4 gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-28" />
            <Skeleton circle className="size-6" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </aside>

        {/* Content shell — generic page shape, not route-specific. */}
        <div className="flex-1 max-w-lg mx-auto px-5 pt-8 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10 w-full">
          <Skeleton className="h-7 w-40 mb-6" />
          <div className="grid grid-cols-1 gap-3 mb-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

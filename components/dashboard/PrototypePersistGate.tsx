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
 */
export default function PrototypePersistGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && usePrototypeViewStore.persist.hasHydrated()
  );

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
    /** AppSidebar renders outside this gate (it's SSR'd as a layout sibling),
     * so only the content column needs a skeleton — a fake sidebar here
     * would duplicate the real one already on screen. */
    return (
      <div className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10 w-full">
        <Skeleton className="h-4 w-40 mb-6" />
        <Skeleton className="h-7 w-56 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

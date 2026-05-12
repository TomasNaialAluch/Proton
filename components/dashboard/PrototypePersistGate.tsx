"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";

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
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10">
        <p className="text-sm text-text-secondary">Loading dashboard…</p>
      </div>
    );
  }

  return <>{children}</>;
}

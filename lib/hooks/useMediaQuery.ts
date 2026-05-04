"use client";

import { useSyncExternalStore } from "react";

function subscribeMaxMd(onStoreChange: () => void) {
  const mq = window.matchMedia("(max-width: 1023px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMaxMdSnapshot() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

/** true cuando viewport es menor que breakpoint `lg` de Tailwind. SSR: false (evita flash en desktop). */
export function useIsMaxLg(): boolean {
  return useSyncExternalStore(
    subscribeMaxMd,
    getMaxMdSnapshot,
    () => false
  );
}

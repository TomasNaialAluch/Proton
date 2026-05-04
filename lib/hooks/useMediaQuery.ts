"use client";

import { useSyncExternalStore } from "react";

function subscribeMaxMd(onStoreChange: () => void) {
  const mq = window.matchMedia("(max-width: 1023px)");
  const listener = () => {
    onStoreChange();
  };
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
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

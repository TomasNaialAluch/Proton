"use client";

import type { ReactNode } from "react";
import { usePlayerBottomPaddingClass } from "./usePlayerBottomPaddingClass";

/**
 * `<main>` del área pública con padding inferior según el reproductor global.
 */
export default function PublicMain({ children }: { children: ReactNode }) {
  const bottomPad = usePlayerBottomPaddingClass();
  return <main className={bottomPad}>{children}</main>;
}

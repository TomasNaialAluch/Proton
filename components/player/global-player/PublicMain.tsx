"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { PUBLIC_NAV_CONDENSE_EVENT } from "@/lib/publicNavCondense";
import { usePlayerBottomPaddingClass } from "./usePlayerBottomPaddingClass";

function NavScrollSentinel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const emit = (condensed: boolean) => {
      window.dispatchEvent(
        new CustomEvent(PUBLIC_NAV_CONDENSE_EVENT, {
          detail: { condensed },
        })
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        emit(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-64px 0px 0px 0px",
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none h-px w-full shrink-0"
      aria-hidden
    />
  );
}

/**
 * `<main>` del área pública con padding inferior según el reproductor global.
 */
export default function PublicMain({ children }: { children: ReactNode }) {
  const bottomPad = usePlayerBottomPaddingClass();
  return (
    <main className={bottomPad}>
      <NavScrollSentinel />
      {children}
    </main>
  );
}

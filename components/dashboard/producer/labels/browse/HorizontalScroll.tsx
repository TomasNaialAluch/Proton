"use client";

import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: ReactNode;
  gap?: string;
}

export default function HorizontalScroll({ children, gap = "gap-3" }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  // Drag-to-scroll with momentum (inertia on release)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let momentumId = 0;

    const stopMomentum = () => {
      if (momentumId) {
        cancelAnimationFrame(momentumId);
        momentumId = 0;
      }
    };

    const runMomentum = () => {
      // decelerate: friction each frame
      velocity *= 0.94;
      el.scrollLeft -= velocity;
      if (Math.abs(velocity) > 0.4) {
        momentumId = requestAnimationFrame(runMomentum);
      } else {
        momentumId = 0;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // only primary button, and ignore clicks that start on the arrow buttons
      if (e.button !== 0) return;
      stopMomentum();
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      lastX = e.clientX;
      lastT = e.timeStamp;
      velocity = 0;
    };

    const DRAG_THRESHOLD = 6;

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;

      // don't touch scrollLeft until the gesture proves itself a drag —
      // this is what kept plain clicks from "snapping" the strip by a few px.
      if (!moved) {
        if (Math.abs(dx) <= DRAG_THRESHOLD) return;
        moved = true;
        el.style.cursor = "grabbing";
      }

      const dragDx = dx - Math.sign(dx) * DRAG_THRESHOLD;
      el.scrollLeft = startScrollLeft - dragDx;

      // track instantaneous velocity for the momentum handoff
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = (e.clientX - lastX) / dt * 16; // px per frame (~16ms)
      lastX = e.clientX;
      lastT = e.timeStamp;
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "grab";
      if (Math.abs(velocity) > 1) {
        momentumId = requestAnimationFrame(runMomentum);
      }
    };

    // suppress the click that follows a real drag, so cards don't navigate
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      stopMomentum();
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <div className="relative group/hscroll">
      {/* Left arrow + fade */}
      {canScrollLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-12 z-[5]
            bg-gradient-to-r from-[var(--color-background)] to-transparent
            opacity-0 group-hover/hscroll:opacity-100 transition-opacity" />
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10
              size-8 rounded-full border border-[var(--color-border)] bg-surface shadow-lg
              flex items-center justify-center text-text-secondary hover:text-text-primary hover:scale-105
              opacity-0 group-hover/hscroll:opacity-100 transition-all"
          >
            <ChevronLeft size={15} />
          </button>
        </>
      )}

      <div
        ref={ref}
        className={`flex ${gap} overflow-x-auto pb-1`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-y" }}
      >
        {children}
      </div>

      {/* Right arrow + fade */}
      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-12 z-[5]
            bg-gradient-to-l from-[var(--color-background)] to-transparent
            opacity-0 group-hover/hscroll:opacity-100 transition-opacity" />
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10
              size-8 rounded-full border border-[var(--color-border)] bg-surface shadow-lg
              flex items-center justify-center text-text-secondary hover:text-text-primary hover:scale-105
              opacity-0 group-hover/hscroll:opacity-100 transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </>
      )}
    </div>
  );
}

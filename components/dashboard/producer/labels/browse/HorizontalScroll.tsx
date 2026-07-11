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

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <div className="relative group/hscroll">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10
            size-8 rounded-full border border-[var(--color-border)] bg-surface shadow-lg
            flex items-center justify-center text-text-secondary hover:text-text-primary
            opacity-0 group-hover/hscroll:opacity-100 transition-opacity"
        >
          <ChevronLeft size={15} />
        </button>
      )}

      <div
        ref={ref}
        className={`flex ${gap} overflow-x-auto pb-1`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10
            size-8 rounded-full border border-[var(--color-border)] bg-surface shadow-lg
            flex items-center justify-center text-text-secondary hover:text-text-primary
            opacity-0 group-hover/hscroll:opacity-100 transition-opacity"
        >
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

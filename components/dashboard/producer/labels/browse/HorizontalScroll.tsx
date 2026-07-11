"use client";

import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: ReactNode;
  gap?: string;
  /** Section heading rendered to the left of the arrow controls, Beatport-style. */
  title?: ReactNode;
}

export default function HorizontalScroll({ children, gap = "gap-3", title }: HorizontalScrollProps) {
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

  const hasControls = canScrollLeft || canScrollRight;

  return (
    <div>
      {(title || hasControls) && (
        <div className="flex items-center justify-between mb-3">
          <div>{title}</div>
          {hasControls && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="size-6 rounded-full flex items-center justify-center transition-colors
                  text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]/60
                  disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="size-6 rounded-full flex items-center justify-center transition-colors
                  text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]/60
                  disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div
        ref={ref}
        className={`flex ${gap} overflow-x-auto pb-1`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}

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

  // Mouse drag-to-scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startScrollLeft = 0;
    let dragging = false;
    let moved = false;

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      moved = false;
      startX = e.pageX - el.offsetLeft;
      startScrollLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const x = e.pageX - el.offsetLeft;
      const delta = (x - startX) * 1.2;
      if (Math.abs(delta) > 4) moved = true;
      el.scrollLeft = startScrollLeft - delta;
    };

    const stop = () => {
      dragging = false;
      el.style.cursor = "grab";
      el.style.userSelect = "";
    };

    // cancel click on child links if we actually dragged
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    el.addEventListener("mouseleave", stop);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      el.removeEventListener("mouseleave", stop);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="relative group/hscroll">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
            size-7 rounded-full border border-[var(--color-border)] bg-surface shadow-md
            flex items-center justify-center text-text-secondary hover:text-text-primary
            opacity-0 group-hover/hscroll:opacity-100 transition-opacity"
        >
          <ChevronLeft size={13} />
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
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
            size-7 rounded-full border border-[var(--color-border)] bg-surface shadow-md
            flex items-center justify-center text-text-secondary hover:text-text-primary
            opacity-0 group-hover/hscroll:opacity-100 transition-opacity"
        >
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

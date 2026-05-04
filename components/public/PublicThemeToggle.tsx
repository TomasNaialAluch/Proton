"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/lib/store/themeStore";

type Variant = "compact" | "labeled";

/**
 * Mismo patrón que el sidebar del dashboard (`AppSidebar`): sol / interruptor / luna.
 */
export default function PublicThemeToggle({
  variant = "compact",
}: {
  variant?: Variant;
}) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const isDark = theme === "dark";

  const switchBtn = (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`relative h-6 w-12 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isDark ? "bg-accent" : "bg-text-secondary/25"
      }`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full shadow-md transition-all duration-300 ${
          isDark ? "left-7 bg-background" : "left-1 bg-white"
        }`}
      />
    </button>
  );

  if (variant === "labeled") {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="text-xs font-medium text-text-primary">Dark mode</span>
        <div className="flex items-center gap-2 shrink-0">
          <Sun size={14} className="text-text-secondary" aria-hidden />
          {switchBtn}
          <Moon
            size={14}
            className={isDark ? "text-accent" : "text-text-secondary"}
            aria-hidden
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Sun size={14} className="text-text-secondary" aria-hidden />
      {switchBtn}
      <Moon
        size={14}
        className={isDark ? "text-accent" : "text-text-secondary"}
        aria-hidden
      />
    </div>
  );
}

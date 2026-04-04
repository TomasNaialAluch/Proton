"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  // Keeps the data-theme attribute in sync when the user toggles
  // (the initial value is already set by the blocking script in layout.tsx)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

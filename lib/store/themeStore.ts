import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light", // default — always light unless user toggled
      toggle: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        document.documentElement.setAttribute("data-theme", next);
      },
      setTheme: (t) => {
        set({ theme: t });
        document.documentElement.setAttribute("data-theme", t);
      },
    }),
    {
      name: "proton-theme",
      // Clear any old stored value that might have been "dark"
      version: 2,
      migrate: () => ({ theme: "light" }),
    }
  )
);

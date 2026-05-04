import { create } from "zustand";

/** Estado del sidebar del dashboard (colapsado) para alinear UI global (p. ej. reproductor). */
interface DashboardSidebarState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const useDashboardSidebarStore = create<DashboardSidebarState>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_WIDGET_ORDER = [
  "streams",
  "latest-tracks",
  "streams-by-release",
  "royalties",
] as const;

export type WidgetId = (typeof DEFAULT_WIDGET_ORDER)[number];

interface DashboardState {
  widgetOrder: WidgetId[];
  hiddenWidgets: WidgetId[];
  setWidgetOrder: (order: WidgetId[]) => void;
  hideWidget: (id: WidgetId) => void;
  showWidget: (id: WidgetId) => void;
  resetLayout: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgetOrder: [...DEFAULT_WIDGET_ORDER],
      hiddenWidgets: [],
      setWidgetOrder: (order) => set({ widgetOrder: order }),
      hideWidget: (id) =>
        set((state) => ({
          hiddenWidgets: state.hiddenWidgets.includes(id)
            ? state.hiddenWidgets
            : [...state.hiddenWidgets, id],
        })),
      showWidget: (id) =>
        set((state) => ({
          hiddenWidgets: state.hiddenWidgets.filter((w) => w !== id),
        })),
      resetLayout: () =>
        set({ widgetOrder: [...DEFAULT_WIDGET_ORDER], hiddenWidgets: [] }),
    }),
    { name: "proton-dashboard-layout", version: 1 }
  )
);

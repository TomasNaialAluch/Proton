import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Same shape as `lib/store/dashboardStore.ts` (producer Home), independent
 *  persisted state — the two boards are customized separately. See
 *  docs/README-label-manager-rebuild-plan.md, section 6. */
export const DEFAULT_LABEL_WIDGET_ORDER = [
  "revenue-trend",
  "latest-releases",
  "activity-feed",
  "pending-tasks",
  "streams-by-release",
  "statements-progress",
  "roster-growth",
  "top-territories",
  "play-sources",
  "rising-tracks",
  "upcoming-releases",
  "distribution-status",
  "catalog-codes",
  "royalties-by-store",
  "payout-history",
  "audio-metadata",
] as const;

export type LabelWidgetId = (typeof DEFAULT_LABEL_WIDGET_ORDER)[number];

/** Visible on a freshly-created board / after Reset. */
export const DEFAULT_VISIBLE_LABEL_WIDGET_IDS: readonly LabelWidgetId[] = [
  "revenue-trend",
  "latest-releases",
  "activity-feed",
  "pending-tasks",
];

const visibleByDefault = new Set(DEFAULT_VISIBLE_LABEL_WIDGET_IDS);

export function defaultHiddenLabelWidgets(): LabelWidgetId[] {
  return (DEFAULT_LABEL_WIDGET_ORDER as readonly LabelWidgetId[]).filter(
    (id) => !visibleByDefault.has(id)
  );
}

interface LabelDashboardState {
  widgetOrder: LabelWidgetId[];
  hiddenWidgets: LabelWidgetId[];
  setWidgetOrder: (order: LabelWidgetId[]) => void;
  hideWidget: (id: LabelWidgetId) => void;
  showWidget: (id: LabelWidgetId) => void;
  resetLayout: () => void;
}

export const useLabelDashboardStore = create<LabelDashboardState>()(
  persist(
    (set) => ({
      widgetOrder: [...DEFAULT_LABEL_WIDGET_ORDER],
      hiddenWidgets: defaultHiddenLabelWidgets(),
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
        set({
          widgetOrder: [...DEFAULT_LABEL_WIDGET_ORDER],
          hiddenWidgets: defaultHiddenLabelWidgets(),
        }),
    }),
    { name: "proton-label-dashboard-layout", version: 1 }
  )
);

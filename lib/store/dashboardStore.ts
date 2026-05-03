import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_WIDGET_ORDER = [
  "streams",
  "latest-tracks",
  "streams-by-release",
  "royalties",
  "listeners-growth",
  "top-territories",
  "play-sources",
  "rising-tracks",
  "upcoming-releases",
  "distribution-status",
  "catalog-codes",
  "royalties-by-store",
  "payout-history",
  "pending-tasks",
  "notifications-feed",
  "smart-links",
  "social-overview",
  "audio-metadata",
] as const;

export type WidgetId = (typeof DEFAULT_WIDGET_ORDER)[number];

/** Cuadros visibles en un tablero “recién creado” o tras Reset (los cuatro originales). */
export const DEFAULT_VISIBLE_WIDGET_IDS: readonly WidgetId[] = [
  "streams",
  "latest-tracks",
  "streams-by-release",
  "royalties",
];

const visibleByDefault = new Set(DEFAULT_VISIBLE_WIDGET_IDS);

/** Ids ocultos por defecto: todo el catálogo excepto `DEFAULT_VISIBLE_WIDGET_IDS`. */
export function defaultHiddenWidgets(): WidgetId[] {
  return (DEFAULT_WIDGET_ORDER as readonly WidgetId[]).filter((id) => !visibleByDefault.has(id));
}

interface DashboardState {
  widgetOrder: WidgetId[];
  hiddenWidgets: WidgetId[];
  setWidgetOrder: (order: WidgetId[]) => void;
  hideWidget: (id: WidgetId) => void;
  showWidget: (id: WidgetId) => void;
  resetLayout: () => void;
}

function mergeWidgetOrder(stored: WidgetId[] | undefined): WidgetId[] {
  const allowed = DEFAULT_WIDGET_ORDER as readonly WidgetId[];
  const setAllowed = new Set(allowed);
  const fromStored = (stored ?? []).filter((id): id is WidgetId => setAllowed.has(id));
  const out: WidgetId[] = [];
  for (const id of fromStored) {
    if (!out.includes(id)) out.push(id);
  }
  for (const id of allowed) {
    if (!out.includes(id)) out.push(id);
  }
  return out;
}

function sliceFromPersist(persistedState: unknown): { widgetOrder?: WidgetId[]; hiddenWidgets?: WidgetId[] } | undefined {
  if (!persistedState || typeof persistedState !== "object") return undefined;
  const o = persistedState as Record<string, unknown>;
  if ("state" in o && o.state && typeof o.state === "object") {
    return o.state as { widgetOrder?: WidgetId[]; hiddenWidgets?: WidgetId[] };
  }
  return persistedState as { widgetOrder?: WidgetId[]; hiddenWidgets?: WidgetId[] };
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgetOrder: [...DEFAULT_WIDGET_ORDER],
      hiddenWidgets: defaultHiddenWidgets(),
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
          widgetOrder: [...DEFAULT_WIDGET_ORDER],
          hiddenWidgets: defaultHiddenWidgets(),
        }),
    }),
    {
      name: "proton-dashboard-layout",
      version: 1,
      merge: (persistedState, currentState) => {
        const slice = sliceFromPersist(persistedState);
        if (!slice) return currentState;
        const allowed = new Set(DEFAULT_WIDGET_ORDER as readonly WidgetId[]);
        const mergedOrder = mergeWidgetOrder(slice.widgetOrder);

        const rawStoredOrder = (slice.widgetOrder ?? []).filter((id): id is WidgetId => allowed.has(id));
        const idsUserHadInOrder = new Set(rawStoredOrder);

        const persistedHidden = (slice.hiddenWidgets ?? []).filter((id): id is WidgetId => allowed.has(id));
        const hidden = new Set<WidgetId>(persistedHidden);

        for (const id of mergedOrder) {
          if (!idsUserHadInOrder.has(id) && !visibleByDefault.has(id)) {
            hidden.add(id);
          }
        }

        return {
          ...currentState,
          widgetOrder: mergedOrder,
          hiddenWidgets: Array.from(hidden),
        };
      },
    }
  )
);

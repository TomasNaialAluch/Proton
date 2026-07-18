"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlidersHorizontal, LayoutGrid, X, GripVertical, Check, RotateCcw } from "lucide-react";
import {
  useLabelDashboardStore,
  DEFAULT_LABEL_WIDGET_ORDER,
  type LabelWidgetId,
} from "@/lib/store/label-manager/labelDashboardStore";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { LABEL_DASHBOARD_WIDGETS } from "./widgets/registry";
import { LABEL_WIDGET_META } from "./widgets/meta";
import type { LabelWidgetProps } from "./widgets/types";
import LabelHomeHero from "./LabelHomeHero";
import LabelHomeKpis from "./LabelHomeKpis";

// ── Manage widgets modal — same shape as the producer one ───────────────────

function WidgetManageModal({
  open,
  onClose,
  hiddenWidgets,
  hideWidget,
  showWidget,
}: {
  open: boolean;
  onClose: () => void;
  hiddenWidgets: LabelWidgetId[];
  hideWidget: (id: LabelWidgetId) => void;
  showWidget: (id: LabelWidgetId) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const isOnBoard = (id: LabelWidgetId) => !hiddenWidgets.includes(id);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="label-dashboard-widget-modal-title"
        className="relative z-[1] flex max-h-[min(90dvh,40rem)] w-full flex-col rounded-t-2xl border border-[var(--color-border)] bg-background shadow-2xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 id="label-dashboard-widget-modal-title" className="font-display text-lg font-bold tracking-tight text-text-primary">
              Manage widgets
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              All sections are listed below. A check means the widget is on your board.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3">
          {(DEFAULT_LABEL_WIDGET_ORDER as readonly LabelWidgetId[]).map((id) => {
            const on = isOnBoard(id);
            const meta = LABEL_WIDGET_META[id];
            return (
              <li key={id} className="mb-2 last:mb-0">
                <button
                  type="button"
                  onClick={() => (on ? hideWidget(id) : showWidget(id))}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                    on
                      ? "border-accent/40 bg-accent/[0.06] shadow-[inset_3px_0_0_0_var(--color-accent)]"
                      : "border-[var(--color-border)] bg-surface/80 hover:bg-surface"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${
                      on ? "bg-accent/20 text-accent" : "bg-[var(--color-border)] text-text-secondary"
                    }`}
                    aria-hidden
                  >
                    {on ? <Check size={20} strokeWidth={2.5} /> : <span className="size-2.5 rounded-full bg-text-secondary/40" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{meta.label}</span>
                      {on ? (
                        <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                          On board
                        </span>
                      ) : (
                        <span className="rounded-md bg-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                          Hidden
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-secondary">{meta.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-[var(--color-border)] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-accent/10 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Sortable wrapper — identical pattern to the producer one ────────────────

function SortableWidget({
  id,
  editMode,
  onRemove,
  children,
}: {
  id: LabelWidgetId;
  editMode: boolean;
  onRemove: (id: LabelWidgetId) => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`relative ${isDragging ? "opacity-40 z-50" : ""}`}>
      {editMode && (
        <>
          <div className="absolute inset-0 rounded-2xl ring-2 ring-accent/40 pointer-events-none z-10" />
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
            <button
              {...attributes}
              {...listeners}
              className="size-7 rounded-lg flex items-center justify-center bg-surface/90 border border-[var(--color-border)] text-text-secondary hover:text-text-primary cursor-grab active:cursor-grabbing transition-colors"
              aria-label="Drag widget"
            >
              <GripVertical size={13} />
            </button>
            <button
              onClick={() => onRemove(id)}
              className="size-7 rounded-lg flex items-center justify-center bg-surface/90 border border-[var(--color-border)] text-text-secondary hover:text-red-500 transition-colors"
              aria-label="Remove widget"
            >
              <X size={13} />
            </button>
          </div>
        </>
      )}
      {children}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function LabelDashboardHome() {
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const { widgetOrder, hiddenWidgets, setWidgetOrder, hideWidget, showWidget, resetLayout } = useLabelDashboardStore();

  const [editMode, setEditMode] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [activeId, setActiveId] = useState<LabelWidgetId | null>(null);

  const visibleWidgets = widgetOrder.filter((id) => !hiddenWidgets.includes(id));
  const hiddenCount = hiddenWidgets.length;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as LabelWidgetId);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = visibleWidgets.indexOf(active.id as LabelWidgetId);
    const newIndex = visibleWidgets.indexOf(over.id as LabelWidgetId);
    const reordered = arrayMove(visibleWidgets, oldIndex, newIndex);
    const nextOrder = [...widgetOrder];
    let ri = 0;
    for (let i = 0; i < nextOrder.length; i++) {
      if (!hiddenWidgets.includes(nextOrder[i])) {
        nextOrder[i] = reordered[ri++];
      }
    }
    setWidgetOrder(nextOrder);
  }

  function handleRemove(id: LabelWidgetId) {
    hideWidget(id);
  }

  function handleReset() {
    resetLayout();
    setShowWidgetModal(false);
  }

  const widgetProps: LabelWidgetProps = useMemo(() => ({ activeLabelId }), [activeLabelId]);

  function renderWidgetContent(id: LabelWidgetId) {
    const Comp = LABEL_DASHBOARD_WIDGETS[id];
    return <Comp {...widgetProps} />;
  }

  return (
    <main className="max-w-lg mx-auto px-5 pt-0 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <LabelHomeHero />
      <LabelHomeKpis activeLabelId={activeLabelId} />

      <div
        className={
          editMode
            ? "sticky top-0 z-20 -mx-5 mb-4 border-b border-[var(--color-border)] bg-background/95 px-5 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/85"
            : "mb-4"
        }
      >
        {editMode ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary leading-relaxed sm:max-w-[min(100%,22rem)]">
              Drag cards to reorder. Tap <X size={11} className="inline align-text-bottom" aria-hidden /> on a card to hide it — use{" "}
              <span className="font-medium text-text-primary">Manage widgets</span> to see every section.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowWidgetModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <LayoutGrid size={13} className="text-accent shrink-0" />
                <span>Manage widgets</span>
                {hiddenCount > 0 && (
                  <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-accent">{hiddenCount} hidden</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setShowWidgetModal(false);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
              >
                <Check size={13} /> Done
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
            >
              <SlidersHorizontal size={13} /> Customize
            </button>
          </div>
        )}
      </div>

      {visibleWidgets.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleWidgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
              {visibleWidgets.map((id) => (
                <SortableWidget key={id} id={id} editMode={editMode} onRemove={handleRemove}>
                  {renderWidgetContent(id)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? <div className="rotate-1 scale-105 rounded-2xl opacity-90 shadow-2xl">{renderWidgetContent(activeId)}</div> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-surface/50 px-4 py-12 text-center">
          <LayoutGrid className="mb-3 text-text-secondary" size={28} strokeWidth={1.5} aria-hidden />
          <p className="text-sm font-medium text-text-primary">No widgets on your board</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-text-secondary">
            Open Manage widgets to choose which sections stay visible.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowWidgetModal(true)}
              className="rounded-xl bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Manage widgets
            </button>
          </div>
        </div>
      )}

      <WidgetManageModal open={showWidgetModal} onClose={() => setShowWidgetModal(false)} hiddenWidgets={hiddenWidgets} hideWidget={hideWidget} showWidget={showWidget} />
    </main>
  );
}

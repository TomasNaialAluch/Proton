"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
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
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TrendingUp,
  Music2,
  Disc3,
  Camera,
  Pencil,
  SlidersHorizontal,
  LayoutGrid,
  X,
  GripVertical,
  Check,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchArtistWithTracks } from "@/lib/api/artist";
import { mockArtist } from "@/lib/mock/artist";
import { useDashboardStore, WidgetId, DEFAULT_WIDGET_ORDER } from "@/lib/store/dashboardStore";
import { DASHBOARD_WIDGETS, WIDGET_META, type DashboardWidgetProps } from "./widgets";

// ── Manage widgets modal (full catalog + on-board feedback) ─────────────────

function WidgetManageModal({
  open,
  onClose,
  hiddenWidgets,
  hideWidget,
  showWidget,
}: {
  open: boolean;
  onClose: () => void;
  hiddenWidgets: WidgetId[];
  hideWidget: (id: WidgetId) => void;
  showWidget: (id: WidgetId) => void;
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

  const isOnBoard = (id: WidgetId) => !hiddenWidgets.includes(id);

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
        aria-labelledby="dashboard-widget-modal-title"
        className="relative z-[1] flex max-h-[min(90dvh,40rem)] w-full flex-col rounded-t-2xl border border-[var(--color-border)] bg-background shadow-2xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2
              id="dashboard-widget-modal-title"
              className="font-display text-lg font-bold tracking-tight text-text-primary"
            >
              Manage widgets
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              All sections are listed below. A check means the widget is on your board and available
              in the layout.
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
          {(DEFAULT_WIDGET_ORDER as readonly WidgetId[]).map((id) => {
            const on = isOnBoard(id);
            const meta = WIDGET_META[id];
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
                    {on ? (
                      <Check size={20} strokeWidth={2.5} />
                    ) : (
                      <span className="size-2.5 rounded-full bg-text-secondary/40" />
                    )}
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
                    <span className="mt-1 block text-[11px] text-text-secondary/90">
                      {on ? "Tap to hide from your board." : "Tap to add back to your board."}
                    </span>
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

// ── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableWidget({
  id,
  editMode,
  onRemove,
  children,
}: {
  id: WidgetId;
  editMode: boolean;
  onRemove: (id: WidgetId) => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? "opacity-40 z-50" : ""}`}
    >
      {editMode && (
        <>
          {/* Highlight ring */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-accent/40 pointer-events-none z-10" />

          {/* Controls */}
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
            {/* Drag handle */}
            <button
              {...attributes}
              {...listeners}
              className="size-7 rounded-lg flex items-center justify-center
                bg-surface/90 border border-[var(--color-border)]
                text-text-secondary hover:text-text-primary
                cursor-grab active:cursor-grabbing transition-colors"
              aria-label="Drag widget"
            >
              <GripVertical size={13} />
            </button>

            {/* Remove */}
            <button
              onClick={() => onRemove(id)}
              className="size-7 rounded-lg flex items-center justify-center
                bg-surface/90 border border-[var(--color-border)]
                text-text-secondary hover:text-red-500 transition-colors"
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

export default function DashboardContent() {
  const { data: artist, isLoading } = useQuery({
    queryKey: ["artist", "88457"],
    queryFn: () => fetchArtistWithTracks("88457"),
  });

  const { widgetOrder, hiddenWidgets, setWidgetOrder, hideWidget, showWidget, resetLayout } =
    useDashboardStore();

  const [editMode, setEditMode] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  const tracks       = artist?.tracks ?? [];
  const totalTracks  = tracks.length;
  const topTracks    = [...tracks]
    .sort((a, b) => new Date(b.release.date).getTime() - new Date(a.release.date).getTime())
    .slice(0, 5);

  const artistName = artist?.name  ?? mockArtist.name;
  const avatarUrl  = artist?.image?.url ?? null;

  // Visible widgets in order
  const visibleWidgets = widgetOrder.filter((id) => !hiddenWidgets.includes(id));
  const hiddenCount = hiddenWidgets.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as WidgetId);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = visibleWidgets.indexOf(active.id as WidgetId);
    const newIndex = visibleWidgets.indexOf(over.id as WidgetId);
    const reordered = arrayMove(visibleWidgets, oldIndex, newIndex);
    // Rebuild full order preserving hidden widgets' relative positions
    const nextOrder = [...widgetOrder];
    let ri = 0;
    for (let i = 0; i < nextOrder.length; i++) {
      if (!hiddenWidgets.includes(nextOrder[i])) {
        nextOrder[i] = reordered[ri++];
      }
    }
    setWidgetOrder(nextOrder);
  }

  function handleRemove(id: WidgetId) {
    hideWidget(id);
  }

  function handleReset() {
    resetLayout();
    setShowWidgetModal(false);
  }

  const widgetProps: DashboardWidgetProps = { tracks, isLoading, topTracks };

  function renderWidgetContent(id: WidgetId) {
    const Comp = DASHBOARD_WIDGETS[id];
    return <Comp {...widgetProps} />;
  }

  return (
    <main className="max-w-lg mx-auto px-5 pt-0 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">

      {/* ── Artist Hero ── */}
      <section className="flex items-center gap-5 pt-8 pb-6 lg:pt-10 lg:gap-7">
        <Link href="/dashboard/settings/profile" className="relative shrink-0 group">
          <div
            className="size-20 rounded-full p-[2px] lg:size-24"
            style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)" }}
          >
            <div className="size-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={artistName}
                  width={96}
                  height={96}
                  className="size-full object-cover rounded-full"
                  priority
                />
              ) : (
                <span className="font-display font-bold text-2xl text-accent">
                  {artistName.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="absolute inset-[2px] rounded-full bg-black/50 flex items-center justify-center
            opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
            <Camera size={18} className="text-white" />
          </div>
          <span className="absolute bottom-1 right-1 size-3 rounded-full bg-accent border-2 border-background" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold italic text-3xl text-text-primary leading-tight truncate lg:text-4xl">
              {artistName}
            </h1>
            <Link
              href="/dashboard/settings/profile"
              className="shrink-0 size-7 rounded-full flex items-center justify-center
                bg-[var(--color-border)] hover:bg-accent/20 transition-colors"
              aria-label="Edit profile"
            >
              <Pencil size={13} className="text-text-secondary" />
            </Link>
          </div>
          <p className="text-text-secondary text-sm mt-0.5">{mockArtist.genres.join(" · ")}</p>
          <p className="text-text-secondary text-xs mt-0.5">{mockArtist.country}</p>
        </div>
      </section>

      {/* ── Stat cards (fixed, no customizable) ── */}
      <section className="grid grid-cols-3 gap-3 mb-6 lg:gap-4">
        <StatCard icon={<Music2 size={14} />}    label="Tracks"   value={isLoading ? "—" : totalTracks} />
        <StatCard icon={<TrendingUp size={14} />} label="Releases" value={isLoading ? "—" : new Set(tracks.map((t) => t.release.id)).size} accent />
        <StatCard icon={<Disc3 size={14} />}      label="Labels"   value={isLoading ? "—" : new Set(tracks.map((t) => t.release.label.id)).size} />
      </section>

      {/* ── Toolbar (sticky in edit mode so Add / Done stay visible while scrolling) ── */}
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
              Drag cards to reorder. Tap{" "}
              <X size={11} className="inline align-text-bottom" aria-hidden /> on a card to hide it — use{" "}
              <span className="font-medium text-text-primary">Manage widgets</span> to see every section and
              turn them on or off.
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
                  <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-accent">
                    {hiddenCount} hidden
                  </span>
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

      {/* ── Widget grid ── */}
      {visibleWidgets.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleWidgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
              {visibleWidgets.map((id) => (
                <SortableWidget
                  key={id}
                  id={id}
                  editMode={editMode}
                  onRemove={handleRemove}
                >
                  {renderWidgetContent(id)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="rotate-1 scale-105 rounded-2xl opacity-90 shadow-2xl">
                {renderWidgetContent(activeId)}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-surface/50 px-4 py-12 text-center">
          <LayoutGrid className="mb-3 text-text-secondary" size={28} strokeWidth={1.5} aria-hidden />
          <p className="text-sm font-medium text-text-primary">No widgets on your board</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-text-secondary">
            Open Manage widgets to choose which sections stay visible. You can still reorder them after
            you turn Customize on.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowWidgetModal(true)}
              className="rounded-xl bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Manage widgets
            </button>
            {!editMode && (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-[var(--color-border)]/40"
              >
                Customize
              </button>
            )}
          </div>
        </div>
      )}

      <WidgetManageModal
        open={showWidgetModal}
        onClose={() => setShowWidgetModal(false)}
        hiddenWidgets={hiddenWidgets}
        hideWidget={hideWidget}
        showWidget={showWidget}
      />

    </main>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl border border-[var(--color-border)] px-3 py-4 flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${accent ? "text-accent" : "text-text-secondary"}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={`text-2xl font-medium tabular-nums ${accent ? "text-accent" : "text-text-primary"}`}>
        {value}
      </span>
    </div>
  );
}

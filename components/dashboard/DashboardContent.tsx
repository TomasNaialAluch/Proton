"use client";

import { useState, Suspense } from "react";
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
  ChevronRight,
  Play,
  Camera,
  Pencil,
  SlidersHorizontal,
  X,
  Plus,
  GripVertical,
  Check,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StreamsChart from "./StreamsChart";
import ReleasesChart from "./ReleasesChart";
import RoyaltiesWidget from "./RoyaltiesWidget";
import { fetchArtistWithTracks } from "@/lib/api/artist";
import { mockArtist } from "@/lib/mock/artist";
import { useDashboardStore, WidgetId, DEFAULT_WIDGET_ORDER } from "@/lib/store/dashboardStore";

// ── Widget metadata ──────────────────────────────────────────────────────────

const WIDGET_META: Record<WidgetId, { label: string; description: string }> = {
  streams:             { label: "Streams",             description: "Stream evolution (last 6 months)" },
  "latest-tracks":     { label: "Latest Tracks",       description: "Your most recent tracks" },
  "streams-by-release":{ label: "Streams by Release",  description: "Comparison by release" },
  royalties:           { label: "Royalties",            description: "Progress toward next payment" },
};

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

  const [editMode, setEditMode]         = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [activeId, setActiveId]         = useState<WidgetId | null>(null);

  const tracks       = artist?.tracks ?? [];
  const totalTracks  = tracks.length;
  const topTracks    = [...tracks]
    .sort((a, b) => new Date(b.release.date).getTime() - new Date(a.release.date).getTime())
    .slice(0, 5);

  const artistName = artist?.name  ?? mockArtist.name;
  const avatarUrl  = artist?.image?.url ?? null;

  // Visible widgets in order
  const visibleWidgets = widgetOrder.filter((id) => !hiddenWidgets.includes(id));
  // Widgets that can be re-added
  const addableWidgets = (DEFAULT_WIDGET_ORDER as readonly WidgetId[]).filter((id) =>
    hiddenWidgets.includes(id)
  );

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

  function handleAdd(id: WidgetId) {
    showWidget(id);
    setShowAddPanel(false);
  }

  function handleReset() {
    resetLayout();
    setShowAddPanel(false);
  }

  function renderWidgetContent(id: WidgetId) {
    switch (id) {
      case "streams":
        return (
          <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-text-primary">Streams</h2>
                <p className="text-xs text-text-secondary mt-0.5">Last 6 months</p>
              </div>
              <span className="text-xs text-accent font-medium">+37% ↑</span>
            </div>
            <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-[var(--color-border)]" />}>
              <StreamsChart />
            </Suspense>
          </section>
        );

      case "latest-tracks":
        return (
          <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <h2 className="text-sm font-medium text-text-primary">Latest Tracks</h2>
              <button className="text-xs text-accent flex items-center gap-0.5 hover:opacity-80 transition-opacity">
                See all <ChevronRight size={12} />
              </button>
            </div>
            {isLoading ? (
              <div className="px-4 pb-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg animate-pulse bg-[var(--color-border)]" />
                ))}
              </div>
            ) : (
              <ul>
                {topTracks.map((track, index) => (
                  <li
                    key={track.id}
                    className="flex items-center gap-3 px-4 py-3 border-t border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    <span className="w-5 text-center text-xs font-medium text-text-secondary shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate leading-snug">{track.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{track.release.label.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-text-secondary tabular-nums">
                        {track.release.date.slice(0, 4)}
                      </span>
                      <button className="size-7 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
                        <Play size={12} className="text-accent translate-x-px" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );

      case "streams-by-release":
        return (
          <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-text-primary">Streams by Release</h2>
                <p className="text-xs text-text-secondary mt-0.5">All time</p>
              </div>
            </div>
            {isLoading ? (
              <div className="h-48 animate-pulse rounded-lg bg-[var(--color-border)]" />
            ) : (
              <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-[var(--color-border)]" />}>
                <ReleasesChart tracks={tracks} />
              </Suspense>
            )}
          </section>
        );

      case "royalties":
        return <RoyaltiesWidget />;
    }
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

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-4">
        {editMode ? (
          <>
            <span className="text-xs text-text-secondary">
              Drag to reorder · tap <X size={11} className="inline" /> to hide
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                onClick={() => { setEditMode(false); setShowAddPanel(false); }}
                className="flex items-center gap-1.5 text-xs font-medium text-accent
                  bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Check size={13} /> Done
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="ml-auto flex items-center gap-1.5 text-xs text-text-secondary
              hover:text-text-primary transition-colors"
          >
            <SlidersHorizontal size={13} /> Customize
          </button>
        )}
      </div>

      {/* ── Widget grid ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleWidgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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

        {/* Drag overlay — renders the dragged item on top */}
        <DragOverlay>
          {activeId ? (
            <div className="opacity-90 rotate-1 scale-105 shadow-2xl rounded-2xl">
              {renderWidgetContent(activeId)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ── Add widget panel (edit mode only) ── */}
      {editMode && (
        <div className="mb-6">
          {addableWidgets.length > 0 ? (
            <>
              <button
                onClick={() => setShowAddPanel((p) => !p)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                  border-2 border-dashed border-[var(--color-border)]
                  text-sm text-text-secondary hover:text-text-primary hover:border-accent/40
                  transition-colors"
              >
                <Plus size={15} />
                Add widget
              </button>

              {showAddPanel && (
                <div className="mt-2 bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
                  {addableWidgets.map((id) => (
                    <button
                      key={id}
                      onClick={() => handleAdd(id)}
                      className="w-full flex items-center justify-between px-4 py-3
                        hover:bg-[var(--color-border)] transition-colors
                        border-b border-[var(--color-border)] last:border-0"
                    >
                      <div className="text-left">
                        <p className="text-sm text-text-primary">{WIDGET_META[id].label}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{WIDGET_META[id].description}</p>
                      </div>
                      <Plus size={15} className="text-accent shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-xs text-text-secondary py-2">
              All widgets are visible
            </p>
          )}
        </div>
      )}

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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Compass, Tag, Play, Pause } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FilterDropdown from "@/components/dashboard/discover/FilterDropdown";
import CoverArt, { genreColor, genreColorBg } from "@/components/dashboard/discover/CoverArt";
import { mockDiscoverTracks, discoverGenres, discoverLabels, type DiscoverTrack } from "@/lib/mock/discover";
import { usePreviewStore } from "@/lib/store/previewStore";

const PAGE_SIZE = 12;

export default function DiscoverPage() {
  const genres = discoverGenres();
  const labels = discoverLabels();
  const [genre, setGenre] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /** Only one card preview plays at a time, via a single shared <audio>. */
  const audioRef = useRef<HTMLAudioElement>(null);
  const previewingId = usePreviewStore((s) => s.activePreviewId);
  const startPreview = usePreviewStore((s) => s.startPreview);
  const stopPreview = usePreviewStore((s) => s.stopPreview);

  /** Preview is page-scoped: leaving Discover stops it and resumes the global player. */
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      stopPreview();
    };
  }, [stopPreview]);

  const togglePreview = (e: React.MouseEvent, track: DiscoverTrack) => {
    e.preventDefault();
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (previewingId === track.id) {
      audio.pause();
      stopPreview();
      return;
    }

    audio.pause();
    audio.src = track.audioUrl || "";
    audio.currentTime = 0;
    startPreview(track.id); // pauses the global radio player if it was playing
    if (track.audioUrl) audio.play().catch(() => {});
  };

  const filtered = useMemo(() => {
    return mockDiscoverTracks.filter(
      (t) => (!genre || t.genre === genre) && (!label || t.label === label)
    );
  }, [genre, label]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resetPaging = () => setVisibleCount(PAGE_SIZE);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-5xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discover" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Discover</h1>
      <p className="text-sm text-text-secondary mb-6">
        Tracks other producers opened up for feedback — across every label, not just yours.
      </p>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-border)]
        bg-surface px-4 py-3 mb-6">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Compass size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
        </div>
        <FilterDropdown
          label="Genre"
          options={genres}
          value={genre}
          onChange={(v) => { setGenre(v); resetPaging(); }}
        />
        <FilterDropdown
          label="Label"
          options={labels}
          value={label}
          onChange={(v) => { setLabel(v); resetPaging(); }}
        />
        <span className="ml-auto text-xs text-text-secondary">
          {filtered.length} {filtered.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      {/* Shared preview player — only one card plays at a time. */}
      <audio ref={audioRef} preload="none" onEnded={() => stopPreview()} />

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((track) => {
          const isPreviewing = previewingId === track.id;
          return (
          <Link
            key={track.id}
            href={`/dashboard/discover/${track.id}`}
            className="group rounded-xl border border-[var(--color-border)] bg-surface p-3
              hover:border-accent/50 transition-colors"
          >
            <div className="relative mb-3">
              <CoverArt seed={track.id} className="transition-transform group-hover:scale-[1.02]" />
              <button
                type="button"
                onClick={(e) => togglePreview(e, track)}
                aria-label={isPreviewing ? `Pause preview of ${track.title}` : `Preview ${track.title}`}
                className={`absolute inset-0 flex items-center justify-center transition-opacity
                  ${isPreviewing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                <span className="absolute inset-0 rounded-lg bg-black/40" />
                <span className="relative flex size-10 items-center justify-center rounded-full bg-white text-black shadow-lg">
                  {isPreviewing ? <Pause size={16} /> : <Play size={16} />}
                </span>
              </button>
            </div>
            <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
            <p className="text-xs text-text-secondary truncate mb-2">
              {track.producer.name} · {track.label}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium truncate"
                style={{ color: genreColor(track.genre), backgroundColor: genreColorBg(track.genre) }}
              >
                <Tag size={9} className="shrink-0" />
                <span className="truncate">{track.genre}</span>
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-text-secondary tabular-nums">
                {track.bpm} BPM
              </span>
            </div>
          </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-text-secondary py-8 text-center">
            No open tracks match these filters.
          </p>
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="mt-6 w-full rounded-lg border border-[var(--color-border)] bg-surface py-2.5
            text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]/40
            transition-colors"
        >
          Load more ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </main>
  );
}

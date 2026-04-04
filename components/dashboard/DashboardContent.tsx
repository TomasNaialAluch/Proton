"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { TrendingUp, Music2, ShoppingCart, ChevronRight, Play, Camera, Pencil } from "lucide-react";
import Link from "next/link";
import StreamsChart from "./StreamsChart";
import { fetchTracksSummary, fetchTracks } from "@/lib/api/tracks";
import { mockArtist } from "@/lib/mock/artist";

export default function DashboardContent() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["tracks-summary"],
    queryFn: fetchTracksSummary,
  });

  const { data: tracks, isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
  });

  const topTracks = tracks
    ? [...tracks].sort((a, b) => b.streams - a.streams).slice(0, 5)
    : [];

  return (
    <main className="max-w-lg mx-auto px-5 pt-0 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">

      {/* ── Artist Hero ── */}
      <section className="flex items-center gap-5 pt-8 pb-6 lg:pt-10 lg:gap-7">

        {/* Avatar — tap to edit artist profile */}
        <Link href="/dashboard/settings/profile" className="relative shrink-0 group">
          <div
            className="size-20 rounded-full p-[2px] lg:size-24"
            style={{
              background: "linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)",
            }}
          >
            <div className="size-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
              <span className="font-display font-bold text-2xl text-accent">
                {mockArtist.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Camera overlay */}
          <div className="absolute inset-[2px] rounded-full bg-black/50 flex items-center justify-center
            opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
            <Camera size={18} className="text-white" />
          </div>

          <span className="absolute bottom-1 right-1 size-3 rounded-full bg-accent border-2 border-background" />
        </Link>

        {/* Name + meta + edit button */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold italic text-3xl text-text-primary leading-tight truncate lg:text-4xl">
              {mockArtist.name}
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
          <p className="text-text-secondary text-sm mt-0.5">
            {mockArtist.genres.join(" · ")}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">{mockArtist.country}</p>
        </div>
      </section>

      {/* ── Stat cards ── */}
      <section className="grid grid-cols-3 gap-3 mb-6 lg:gap-4">
        <StatCard
          icon={<Music2 size={14} />}
          label="Tracks"
          value={summaryLoading ? "—" : summary?.totalTracks ?? 0}
        />
        <StatCard
          icon={<TrendingUp size={14} />}
          label="Streams"
          value={summaryLoading ? "—" : summary?.totalStreams ?? 0}
          accent
        />
        <StatCard
          icon={<ShoppingCart size={14} />}
          label="Sales"
          value={summaryLoading ? "—" : summary?.totalSales ?? 0}
        />
      </section>

      {/* ── Chart + Tracks: stack on mobile, side-by-side on desktop ── */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0 mb-6">

      {/* ── Streams chart ── */}
      <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">
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

      {/* ── Top Tracks ── */}
      <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h2 className="text-sm font-medium text-text-primary">Top Tracks</h2>
          <button className="text-xs text-accent flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            See all <ChevronRight size={12} />
          </button>
        </div>

        {tracksLoading ? (
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
                  <p className="text-xs text-text-secondary mt-0.5">{track.genre}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-text-primary tabular-nums">
                    {track.streams}
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

      </div> {/* end desktop grid */}

    </main>
  );
}

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

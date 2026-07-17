"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, ChevronRight, Clock } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import Skeleton from "@/components/ui/Skeleton";
import { fetchReceivedFeedback, fetchPendingToReview } from "@/lib/api/feedback";
import { fetchTracks } from "@/lib/api/tracks";
import { PEER_TRACKS } from "@/lib/mock/peerTracks";
import { FEEDBACK_CATEGORIES } from "@/types/feedback";
import type { Track } from "@/types/track";

function trackTitle(tracks: Track[], trackId: string) {
  return tracks.find((t) => t.id === trackId)?.title ?? "Unknown track";
}

function averageScore(scores: Record<string, number | undefined>) {
  const values = FEEDBACK_CATEGORIES.map((c) => scores[c.key]).filter(
    (v): v is number => v !== undefined
  );
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function FeedbackPage() {
  // Real fetchers behind lib/api/, not mock arrays imported straight into
  // the page — see docs/feature-peer-feedback-tracks.md. `myTracks` covers
  // "Received" (feedback on tracks I own); `PEER_TRACKS` covers "Pending
  // to review" (other producers' tracks) — a real API would resolve both
  // through one `GET /tracks/:id`-style lookup regardless of owner.
  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["feedback", "pending"],
    queryFn: fetchPendingToReview,
  });
  const { data: received, isLoading: receivedLoading } = useQuery({
    queryKey: ["feedback", "received"],
    queryFn: fetchReceivedFeedback,
  });
  const { data: myTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
  });

  const isLoading = pendingLoading || receivedLoading || tracksLoading;
  const allTracks = [...(myTracks ?? []), ...PEER_TRACKS];

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Feedback" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Feedback</h1>

      {/* ── Pending to review ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Pending to review {!isLoading && `(${pending?.length ?? 0})`}
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : !pending || pending.length === 0 ? (
          <p className="text-sm text-text-secondary">Nothing assigned to you right now.</p>
        ) : (
          <ul className="space-y-2">
            {pending.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/dashboard/feedback/${req.id}?mode=give`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                    bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {trackTitle(allTracks, req.trackId)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Requested by {req.fromProducer.name} · {timeAgo(req.requestedAt)}
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Received ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Received {!isLoading && `(${received?.length ?? 0})`}
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : !received || received.length === 0 ? (
          <p className="text-sm text-text-secondary">No feedback yet on your tracks.</p>
        ) : (
          <ul className="space-y-2">
            {received.map((fb) => {
              const avg = averageScore(fb.scores);
              return (
                <li key={fb.id}>
                  <Link
                    href={`/dashboard/feedback/${fb.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                      bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <MessageSquareText size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {trackTitle(allTracks, fb.trackId)}
                        </p>
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                          {fb.fromProducer.name}
                          {!fb.read && <span className="size-1.5 rounded-full bg-accent" />}
                          <Clock size={10} className="ml-1 opacity-60" /> {timeAgo(fb.createdAt)}
                        </p>
                      </div>
                    </div>
                    {avg !== null && (
                      <span className="shrink-0 text-sm font-semibold text-text-primary tabular-nums">
                        {avg.toFixed(1)}
                        <span className="text-text-secondary text-xs">/10</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

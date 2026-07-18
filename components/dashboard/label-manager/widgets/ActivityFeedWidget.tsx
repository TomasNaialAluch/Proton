"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Activity, Trophy, Disc3, Radar } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockLabels } from "@/lib/mock/labels";
import type { LabelWidgetProps } from "./types";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Genuinely label-specific — not a mirror of a producer widget. Pulls the
 *  same live conversations Requests/Scouting already write to, filtered to
 *  this label, newest first. See docs/README-label-manager-rebuild-plan.md,
 *  section 6.2. */
export function ActivityFeedWidget({ activeLabelId }: LabelWidgetProps) {
  const conversations = useLabelInboxStore((s) => s.conversations);
  const label = mockLabels.find((l) => l.id === activeLabelId) ?? null;

  const activity = useMemo(() => {
    if (!label) return [];
    return conversations
      .filter((c) => c.peer.type === "label" && c.peer.slug === label.slug && c.origin.type === "producer_request")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [conversations, label]);

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity size={14} className="text-text-secondary" />
        <h2 className="text-sm font-medium text-text-primary">Activity</h2>
      </div>
      {activity.length === 0 ? (
        <p className="text-xs text-text-secondary">Nothing new yet.</p>
      ) : (
        <ul className="space-y-2">
          {activity.map((c) => {
            if (c.origin.type !== "producer_request") return null;
            const Icon = c.origin.kind === "contest" ? Trophy : c.origin.kind === "remix" ? Disc3 : Radar;
            return (
              <li key={c.id}>
                <Link
                  href={`/dashboard/requests/chat/${c.id}`}
                  className="flex items-center gap-2 rounded-lg px-1 py-1 text-xs hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <Icon size={12} className="shrink-0 text-accent" />
                  <span className="min-w-0 flex-1 truncate text-text-primary capitalize">{c.origin.kind} request</span>
                  <span className="shrink-0 text-text-secondary">{timeAgo(c.createdAt)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

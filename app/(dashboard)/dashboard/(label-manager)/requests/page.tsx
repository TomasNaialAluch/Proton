"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Inbox, Disc3, Trophy, Clock } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { mockArtist } from "@/lib/mock/artist";
import { mockLabels } from "@/lib/mock/labels";
import { mockTracks } from "@/lib/mock/tracks";
import { PEER_TRACKS } from "@/lib/mock/peerTracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { useContestsStore } from "@/lib/store/label-manager/contestsStore";
import type { Conversation } from "@/types/message";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function trackTitle(trackId: string) {
  return [...mockTracks, ...PEER_TRACKS, ...LABEL_SAMPLE_TRACKS].find((t) => t.id === trackId)?.title ?? "Untitled track";
}

/**
 * Requests inbox — label-manager's view of incoming remix/contest requests.
 * These conversations are already written by `sendLabelRequest` (producer
 * side); this is purely a filtered read over the same live data, scoped to
 * the active label. See docs/feature-label-manager-toolkit.md, "2. Remix
 * requests inbox". `peer.name` on these threads is the *label's own* name
 * (the conversation is modeled from the producer's point of view), so this
 * page shows `mockArtist.name` as the sender instead — accurate here since
 * the prototype has exactly one producer identity.
 */
export default function RequestsPage() {
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const conversations = useLabelInboxStore((s) => s.conversations);
  const messages = useLabelInboxStore((s) => s.messages);
  const extraContests = useContestsStore((s) => s.extraContests);

  const activeLabel = useMemo(
    () => mockLabels.find((l) => l.id === activeLabelId) ?? null,
    [activeLabelId]
  );

  const requests = useMemo(() => {
    return conversations
      .filter((c): c is Conversation & { peer: { type: "label"; id: string; name: string; slug: string } } => {
        if (c.peer.type !== "label") return false;
        if (c.origin.type !== "producer_request") return false;
        if (c.origin.kind !== "remix" && c.origin.kind !== "contest") return false;
        if (c.peer.id !== activeLabelId) return false;
        return true;
      })
      .map((c) => {
        const convoMessages = messages.filter((m) => m.conversationId === c.id);
        const entry = convoMessages.find((m) => m.attachment?.type === "contest_entry")?.attachment;
        const label = mockLabels.find((l) => l.slug === c.peer.slug);
        const contest =
          entry?.type === "contest_entry"
            ? label?.activeContests?.find((k) => k.id === entry.contestId) ??
              extraContests.find((e) => e.labelId === label?.id && e.contest.id === entry.contestId)?.contest
            : null;
        return { conversation: c, lastMessage: convoMessages[convoMessages.length - 1], entry, contest };
      })
      .sort((a, b) => new Date(b.conversation.createdAt).getTime() - new Date(a.conversation.createdAt).getTime());
  }, [conversations, messages, activeLabelId, extraContests]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Requests" },
      ]} />

      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <Inbox size={18} className="text-accent" /> Requests
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Remix and contest entries sent to {activeLabel?.name ?? "this label"}.
        </p>
      </header>

      <ScopeFilterChips />

      {requests.length === 0 ? (
        <p className="text-sm text-text-secondary py-8 text-center">
          No requests for this scope right now.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(({ conversation, lastMessage, entry, contest }) => (
            <Link
              key={conversation.id}
              href={`/dashboard/requests/chat/${conversation.id}?from=${encodeURIComponent("/dashboard/requests")}`}
              className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-surface p-4 hover:bg-[var(--color-border)]/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    {conversation.origin.type === "producer_request" && conversation.origin.kind === "contest" ? (
                      <Trophy size={13} />
                    ) : (
                      <Disc3 size={13} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{mockArtist.name}</p>
                    <p className="text-xs text-text-secondary truncate">
                      {entry?.type === "contest_entry" ? `Contest entry — ${trackTitle(entry.trackId)}` : "Remix request"}
                      {contest ? ` · ${contest.title}` : ""}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-text-secondary shrink-0">
                  <Clock size={10} /> {timeAgo(conversation.createdAt)}
                </span>
              </div>
              {lastMessage && (
                <p className="text-xs text-text-secondary truncate pl-10">{lastMessage.text}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

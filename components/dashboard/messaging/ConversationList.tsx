"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { MessageCircle, ChevronRight, Clock } from "lucide-react";
import FilterDropdown from "@/components/dashboard/discover/FilterDropdown";
import { conversationTag, ALL_CONVERSATION_TAGS } from "@/lib/messaging/conversationTag";
import type { Conversation, ChatMessage } from "@/types/message";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** `from` is this list page's own path — so leaving a chat returns here
 *  instead of forcing a trip through Dashboard. See
 *  docs/README-navigation-back-flow.md. */
function chatHref(conversation: Conversation, from: string) {
  const base = conversation.peer.type === "producer"
    ? `/dashboard/connections/chat/${conversation.id}`
    : `/dashboard/labels/chat/${conversation.id}`;
  return `${base}?from=${encodeURIComponent(from)}`;
}

/**
 * Shared conversation list — used by both Connections' Messages tab and
 * Labels > Messages, each passing a different default `peerType` filter
 * but reading the exact same live data, so a conversation created by any
 * request flow (remix, contest, collab, intro, outreach) shows up
 * correctly regardless of which entry point the producer used to get
 * here. See docs/feature-unified-chat-inbox.md.
 */
export default function ConversationList({
  conversations,
  messages,
  defaultPeerType,
  emptyMessage,
}: {
  conversations: Conversation[];
  messages: ChatMessage[];
  defaultPeerType: "producer" | "label" | "all";
  emptyMessage: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Includes `?tab=messages` when present (Connections syncs its tab to
  // the URL for exactly this reason) so a chat's Back button restores the
  // right tab, not just the right page.
  const listUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
  const [peerType, setPeerType] = useState<"producer" | "label" | "all">(defaultPeerType);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const withTags = conversations.map((c) => ({ conversation: c, tag: conversationTag(c, messages) }));

  const filtered = withTags.filter(({ conversation, tag }) => {
    if (peerType !== "all" && conversation.peer.type !== peerType) return false;
    if (tagFilter && tag.label !== tagFilter) return false;
    return true;
  });

  const lastMessagePreview = (conversationId: string) => {
    const msgs = messages.filter((m) => m.conversationId === conversationId);
    return msgs[msgs.length - 1]?.text ?? "No messages yet.";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-1 rounded-lg border border-[var(--color-border)] bg-surface p-1">
          {(["producer", "label", "all"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setPeerType(opt)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors
                ${peerType === opt ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
            >
              {opt === "producer" ? "People" : opt === "label" ? "Labels" : "All"}
            </button>
          ))}
        </div>
        <FilterDropdown label="Type" options={[...ALL_CONVERSATION_TAGS]} value={tagFilter} onChange={setTagFilter} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-secondary">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map(({ conversation: c, tag }) => (
            <li key={c.id}>
              <Link
                href={chatHref(c, listUrl)}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                  bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <MessageCircle size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-text-primary truncate">{c.peer.name}</p>
                      <span
                        role="link"
                        tabIndex={0}
                        onClick={(e) => {
                          if (!tag.href) return;
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(tag.href);
                        }}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${tag.colorClass} ${tag.href ? "hover:underline underline-offset-2" : ""}`}
                      >
                        <tag.icon size={10} />
                        {tag.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate max-w-[16rem] flex items-center gap-1 mt-0.5">
                      {lastMessagePreview(c.id)}
                      <Clock size={10} className="ml-1 opacity-60 shrink-0" /> {timeAgo(c.createdAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="shrink-0 text-text-secondary" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

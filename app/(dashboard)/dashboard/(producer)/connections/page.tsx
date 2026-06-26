"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ChevronRight, Clock } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import { mockConnectionSuggestions } from "@/lib/mock/connections";
import { mockConversations, mockMessages } from "@/lib/mock/messages";

type Tab = "suggestions" | "messages";

const TYPE_BADGE: Record<string, string> = {
  similar: "Similar profile",
  complementary: "Complementary profile",
};

function lastMessagePreview(conversationId: string) {
  const msgs = mockMessages.filter((m) => m.conversationId === conversationId);
  return msgs[msgs.length - 1]?.text ?? "No messages yet.";
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ConnectionsPage() {
  const [tab, setTab] = useState<Tab>("suggestions");

  // Only suggestions still awaiting your answer belong in the inbox.
  const pendingSuggestions = mockConnectionSuggestions.filter((s) => s.status === "pending");

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Connections" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Connections</h1>
      <p className="text-sm text-text-secondary mb-6">
        Collaboration matches suggested from your feedback history — accept from both sides to start talking.
      </p>

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-surface p-1 mb-6">
        <button
          type="button"
          onClick={() => setTab("suggestions")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors
            ${tab === "suggestions"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
            }`}
        >
          <Sparkles size={14} />
          Suggestions
          {pendingSuggestions.length > 0 && (
            <span className={`flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold
              ${tab === "suggestions" ? "bg-white/25 text-white" : "bg-accent/15 text-accent"}`}>
              {pendingSuggestions.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("messages")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors
            ${tab === "messages"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
            }`}
        >
          <MessageCircle size={14} />
          Messages
        </button>
      </div>

      {/* ── Suggestions tab ── */}
      {tab === "suggestions" && (
        pendingSuggestions.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No suggestions right now — they show up as the platform finds producers you'd click with.
          </p>
        ) : (
          <ul className="space-y-2">
            {pendingSuggestions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/connections/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                    bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                      {s.peer.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{s.peer.name}</p>
                      <p className="text-xs text-text-secondary truncate">
                        {TYPE_BADGE[s.reason.type]} · {s.peer.genres[0]}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        )
      )}

      {/* ── Messages tab ── */}
      {tab === "messages" && (
        mockConversations.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No conversations yet — they open up once you and another producer both accept.
          </p>
        ) : (
          <ul className="space-y-2">
            {mockConversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/connections/chat/${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                    bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <MessageCircle size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{c.peer.name}</p>
                      <p className="text-xs text-text-secondary truncate max-w-[16rem] flex items-center gap-1">
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
        )
      )}
    </main>
  );
}

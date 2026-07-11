"use client";

import Link from "next/link";
import { MessageCircle, ChevronRight, Clock } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import { mockConversations, mockMessages } from "@/lib/mock/messages";

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

export default function LabelsMessagesPage() {
  const conversations = mockConversations.filter((c) => c.peer.type === "label");

  return (
    <>
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: "Messages" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Labels</h1>
      <p className="text-sm text-text-secondary mb-6">
        Conversations with labels — after an accepted demo, or when a label reaches out directly.
      </p>

      {conversations.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No conversations yet — they open up once a label accepts a demo, or reaches out to you directly.
        </p>
      ) : (
        <ul className="space-y-2">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/dashboard/labels/chat/${c.id}`}
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
      )}
    </>
  );
}

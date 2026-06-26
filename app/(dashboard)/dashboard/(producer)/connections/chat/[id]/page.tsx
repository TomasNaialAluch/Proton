"use client";

import { useState } from "react";
import { notFound, usePathname } from "next/navigation";
import { Send } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import { mockConversations, mockMessages } from "@/lib/mock/messages";
import { mockConnectionSuggestions } from "@/lib/mock/connections";
import type { ChatMessage } from "@/types/message";

/** Same convention as feedback/[id] and connections/[id]: derive id from pathname, not useParams(). */
function conversationIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/connections\/chat\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function ConversationPage() {
  const pathname = usePathname();
  const id = conversationIdFromPath(pathname);

  // A real conversation (seeded), or one just opened from a match — in which case
  // the id is the suggestion id and the chat starts empty (no prior history).
  const existing = mockConversations.find((c) => c.id === id);
  const fromSuggestion = mockConnectionSuggestions.find((s) => s.id === id);
  const conversation = existing ?? (fromSuggestion ? { peer: fromSuggestion.peer } : null);
  if (!conversation) notFound();

  const [messages, setMessages] = useState<ChatMessage[]>(
    existing ? mockMessages.filter((m) => m.conversationId === id) : []
  );
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        conversationId: id,
        fromMe: true,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10 flex flex-col h-[calc(100vh-2rem)]">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Connections", href: "/dashboard/connections" },
        { label: conversation.peer.name },
      ]} />

      <h1 className="text-xl font-bold text-text-primary mb-4">{conversation.peer.name}</h1>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                ${m.fromMe
                  ? "bg-accent text-white"
                  : "bg-surface border border-[var(--color-border)] text-text-primary"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Message ${conversation.peer.name}...`}
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-background
            px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60
            focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-white
            disabled:opacity-40 transition-opacity"
        >
          <Send size={15} />
        </button>
      </div>
    </main>
  );
}

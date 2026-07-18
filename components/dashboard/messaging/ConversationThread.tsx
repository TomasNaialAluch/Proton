"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, FileText, FileAudio, ChevronRight } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import type { ChatMessage } from "@/types/message";

/**
 * Shared 1:1 chat thread — used both for producer↔producer (Connections) and
 * producer↔label (Label Deals) conversations, since they share the same
 * underlying data model (see types/message.ts).
 *
 * Deliberately has no "seen"/read-receipt indicator and no "online now"
 * presence dot — see "Resolviendo las 4 preguntas" in
 * docs/label-contracts/contracts-rebuild-plan.md for why: those signals
 * turn every message into a monitored, urgent exchange instead of a
 * relaxed, asynchronous one.
 */
export default function ConversationThread({
  conversationId,
  peerName,
  breadcrumbItems,
  initialMessages,
  backHref,
  backFallback,
}: {
  conversationId: string;
  peerName: string;
  breadcrumbItems: { label: string; href?: string }[];
  initialMessages: ChatMessage[];
  /** Where "back" should go — set by whoever linked here (the messages
   *  list), so leaving a chat returns to that list instead of forcing a
   *  trip through Dashboard. See docs/README-navigation-back-flow.md. */
  backHref?: string;
  backFallback: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        conversationId,
        fromMe: true,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10 flex flex-col h-[calc(100vh-2rem)]">
      <BackButton href={backHref} fallbackHref={backFallback} label="Back" />

      <DashboardBreadcrumb items={breadcrumbItems} />

      <h1 className="text-xl font-bold text-text-primary mb-4">{peerName}</h1>

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
              <p>{m.text}</p>
              {m.attachment?.type === "contract" && (
                <Link
                  href={`/dashboard/contracts/${m.attachment.contractId}`}
                  className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors
                    ${m.fromMe
                      ? "bg-white/15 hover:bg-white/25 text-white"
                      : "bg-[var(--color-border)]/60 hover:bg-[var(--color-border)] text-text-primary"
                    }`}
                >
                  <FileText size={14} className="shrink-0" />
                  <span className="flex-1 truncate">{m.attachment.contractLabel}</span>
                  <ChevronRight size={12} className="shrink-0" />
                </Link>
              )}
              {m.attachment?.type === "contest_entry" && (
                <div
                  className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium
                    ${m.fromMe
                      ? "bg-white/15 text-white"
                      : "bg-[var(--color-border)]/60 text-text-primary"
                    }`}
                >
                  <FileAudio size={14} className="shrink-0" />
                  <span className="flex-1 truncate">{m.attachment.fileName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Message ${peerName}...`}
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

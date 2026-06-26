"use client";

import { useState } from "react";
import { useRouter, notFound, usePathname } from "next/navigation";
import { MessageCircle, Check, X, Clock3 } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import MatchReasonCard from "@/components/dashboard/connections/MatchReasonCard";
import { mockConnectionSuggestions } from "@/lib/mock/connections";
import { mockConversations } from "@/lib/mock/messages";
import type { ConnectionStatus } from "@/types/connection";

/** Same convention as feedback/[id] and discover/[trackId]: derive id from pathname, not useParams(). */
function connectionIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/connections\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function ConnectionSuggestionPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = connectionIdFromPath(pathname);

  const suggestion = mockConnectionSuggestions.find((c) => c.id === id);
  if (!suggestion) notFound();

  const [status, setStatus] = useState<ConnectionStatus>(suggestion.status);

  const conversation = mockConversations.find((c) => c.connectionId === suggestion.id);

  const accept = () => {
    // The other side's answer is never visible until both have said yes — this just
    // resolves what the prototype already seeded as their (hidden) answer.
    setStatus(suggestion.peerAlreadyAccepted ? "matched" : "accepted_by_me");
  };

  const decline = () => setStatus("declined");

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Connections", href: "/dashboard/connections" },
        { label: suggestion.peer.name },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">
        Connect with {suggestion.peer.name}?
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        Suggested based on your feedback history — not a request from {suggestion.peer.name} themselves.
      </p>

      {/* ── Peer card ── */}
      <div className="flex items-center gap-3 bg-surface rounded-2xl border border-[var(--color-border)] p-5 mb-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
          {suggestion.peer.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary">{suggestion.peer.name}</p>
          <p className="text-xs text-text-secondary">{suggestion.peer.label}</p>
          <p className="text-xs text-text-secondary mt-0.5">{suggestion.peer.genres.join(" · ")}</p>
        </div>
      </div>

      <div className="mb-6">
        <MatchReasonCard reason={suggestion.reason} />
      </div>

      {/* ── Action / status ── */}
      {status === "pending" && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={decline}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)]
              py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]/40
              transition-colors"
          >
            <X size={15} />
            No, thanks
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent py-3
              text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Check size={15} />
            Connect
          </button>
        </div>
      )}

      {status === "accepted_by_me" && (
        <div className="flex flex-col items-center gap-3 text-center py-10 bg-surface rounded-2xl border border-[var(--color-border)]">
          <Clock3 size={28} className="text-text-secondary" />
          <p className="text-sm font-medium text-text-primary">You said yes</p>
          <p className="text-xs text-text-secondary max-w-xs">
            We'll let you know if {suggestion.peer.name} accepts too — they won't be notified that you did.
          </p>
        </div>
      )}

      {status === "matched" && (
        <div className="flex flex-col items-center gap-3 text-center py-10 bg-surface rounded-2xl border border-[var(--color-border)]">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <MessageCircle size={20} />
          </div>
          <p className="text-sm font-medium text-text-primary">
            You and {suggestion.peer.name} are connected
          </p>
          <p className="text-xs text-text-secondary max-w-xs">
            Both of you said yes. You can now message each other directly.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/connections/chat/${conversation?.id ?? suggestion.id}`)}
            className="mt-1 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white
              transition-opacity hover:opacity-90"
          >
            Send a message
          </button>
        </div>
      )}

      {status === "declined" && (
        <div className="flex flex-col items-center gap-2 text-center py-10 bg-surface rounded-2xl border border-[var(--color-border)]">
          <p className="text-sm text-text-secondary">Got it — you won't be matched with them.</p>
        </div>
      )}
    </main>
  );
}

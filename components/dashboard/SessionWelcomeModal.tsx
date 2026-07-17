"use client";

import { useEffect, useId, useState, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { FileText, Users, MessageSquareText, Building2, X } from "lucide-react";
import { useContractsStore } from "@/lib/store/contractsStore";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { mockConnectionSuggestions } from "@/lib/mock/connections";
import { mockConversations, mockMessages } from "@/lib/mock/messages";
import { mockReceivedFeedback } from "@/lib/mock/feedback";
import type { Contract } from "@/types/contract";

/** Reset on tab close — "you just sat down to use the app," not "once ever." See docs/feature-session-welcome-modal.md. */
const SESSION_KEY = "proton-session-welcome-shown";

interface WelcomeItem {
  id: string;
  icon: ElementType;
  iconColor: string;
  title: string;
  description: string;
  href: string;
}

/**
 * Four categories, all backed by real (mock) data, no threshold — any
 * pending item is worth a row. Deliberately open-ended: more "needs your
 * attention" moments (a label review, a milestone) can be added here as
 * they're identified, same shape each time. See
 * docs/feature-session-welcome-modal.md.
 */
function producerWelcomeItems(contracts: Contract[]): WelcomeItem[] {
  const items: WelcomeItem[] = [];

  for (const c of contracts) {
    if (c.status !== "pending_signature") continue;
    items.push({
      id: `contract-${c.id}`,
      icon: FileText,
      iconColor: "#F59E0B",
      title: "Contract awaiting your signature",
      description: `${c.label} — ${c.release}`,
      href: `/dashboard/contracts/${c.id}`,
    });
  }

  for (const s of mockConnectionSuggestions) {
    if (s.status !== "pending") continue;
    items.push({
      id: `connection-${s.id}`,
      icon: Users,
      iconColor: "#9B59B6",
      title: s.peerAlreadyAccepted ? `${s.peer.name} already said yes` : "New connection suggested",
      description: s.peerAlreadyAccepted
        ? `Accept to match with ${s.peer.name} instantly.`
        : `We think you and ${s.peer.name} would make a great pair.`,
      href: `/dashboard/connections/${s.id}`,
    });
  }

  // A label reached out directly and is still waiting on a reply — see
  // convo-hope-outreach in lib/mock/messages.ts.
  for (const convo of mockConversations) {
    if (convo.origin.type !== "label_outreach" || convo.peer.type !== "label") continue;
    const thread = mockMessages.filter((m) => m.conversationId === convo.id);
    const last = thread[thread.length - 1];
    if (!last || last.fromMe) continue;
    items.push({
      id: `outreach-${convo.id}`,
      icon: Building2,
      iconColor: "#1ABC9C",
      title: `${convo.peer.name} reached out directly`,
      description: "Waiting on your reply.",
      href: `/dashboard/connections/chat/${convo.id}`,
    });
  }

  for (const f of mockReceivedFeedback) {
    if (f.read) continue;
    items.push({
      id: `feedback-${f.id}`,
      icon: MessageSquareText,
      iconColor: "#E67E22",
      title: "New feedback received",
      description: `${f.fromProducer.name} left feedback on one of your tracks.`,
      href: `/dashboard/feedback/${f.id}`,
    });
  }

  return items;
}

/**
 * Label-manager has no equivalent "needs your attention" data model yet
 * (no review queue, no pending-anything on that side of the mock data) —
 * see docs/feature-session-welcome-modal.md. Same mechanism as the
 * producer side, deliberately thin content for now rather than invented.
 */
function labelManagerWelcomeItems(): WelcomeItem[] {
  return [];
}

export default function SessionWelcomeModal() {
  const router = useRouter();
  const titleId = useId();
  const view = usePrototypeViewStore((s) => s.view);
  const contracts = useContractsStore((s) => s.contracts);
  const [open, setOpen] = useState(false);

  const items = view === "label_manager" ? labelManagerWelcomeItems() : producerWelcomeItems(contracts);

  useEffect(() => {
    // `view` is persisted (zustand+persist), so the very first client render
    // reads the pre-hydration default ("producer") before localStorage loads
    // — deciding whether to open on that first render would open the modal
    // with a wrong/empty item list for a label-manager session (the default
    // producer items) that then goes stale to 0 once hydration flips `view`.
    // Wait for hydration to actually finish before deciding anything.
    const decide = () => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "true");
      const currentItems = usePrototypeViewStore.getState().view === "label_manager"
        ? labelManagerWelcomeItems()
        : producerWelcomeItems(useContractsStore.getState().contracts);
      if (currentItems.length > 0) setOpen(true);
    };

    if (usePrototypeViewStore.persist.hasHydrated()) {
      decide();
      return;
    }
    const unsub = usePrototypeViewStore.persist.onFinishHydration(decide);
    return unsub;
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  const goTo = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold text-text-primary">
            Welcome back
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          {items.length === 1
            ? "There's one thing worth a look before you dive in:"
            : `${items.length} things worth a look before you dive in:`}
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {items.map(({ id, icon: Icon, iconColor, title, description, href }) => (
            <li key={id}>
              <button
                onClick={() => goTo(href)}
                className="flex w-full items-start gap-3 rounded-xl border border-[var(--color-border)]
                  px-3.5 py-3 text-left transition-colors hover:bg-[var(--color-border)]/40"
              >
                <span
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <Icon size={14} style={{ color: iconColor }} />
                </span>
                <span className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary leading-snug">{title}</p>
                  <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{description}</p>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full rounded-lg py-2.5 text-sm font-medium text-text-secondary
            hover:bg-[var(--color-border)] hover:text-text-primary transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

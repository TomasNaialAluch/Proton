"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import ConversationThread from "@/components/dashboard/messaging/ConversationThread";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockConnectionSuggestions } from "@/lib/mock/connections";

/** Same convention as feedback/[id] and connections/[id]: derive id from pathname, not useParams(). */
function conversationIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/connections\/chat\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function ConnectionsConversationPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = conversationIdFromPath(pathname);
  const from = searchParams.get("from");

  // Live store, not a frozen mock import — see docs/feature-unified-chat-inbox.md.
  const conversations = useLabelInboxStore((s) => s.conversations);
  const messages = useLabelInboxStore((s) => s.messages);

  // A real conversation (seeded), or one just opened from a match — in which case
  // the id is the suggestion id and the chat starts empty (no prior history).
  const existing = conversations.find((c) => c.id === id);
  const fromSuggestion = mockConnectionSuggestions.find((s) => s.id === id);
  const peerName = existing?.peer.name ?? fromSuggestion?.peer.name;
  if (!peerName) notFound();

  return (
    <ConversationThread
      conversationId={id}
      peerName={peerName}
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Connections", href: "/dashboard/connections" },
        { label: peerName },
      ]}
      initialMessages={existing ? messages.filter((m) => m.conversationId === id) : []}
      backHref={from ?? undefined}
      backFallback="/dashboard/connections"
    />
  );
}

"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import ConversationThread from "@/components/dashboard/messaging/ConversationThread";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockArtist } from "@/lib/mock/artist";

/** Same convention as connections/chat/[id] and labels/chat/[id]: derive id from pathname. */
function conversationIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/requests\/chat\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

/**
 * Label-manager's side of a remix/contest request thread — same underlying
 * conversation the producer sees under Labels > Messages, just reached from
 * the Requests inbox instead. `peerName` here is `mockArtist.name`, not
 * `conversation.peer.name` (which is the label's own name, since the thread
 * is modeled from the producer's point of view) — see comment in
 * app/(dashboard)/dashboard/(label-manager)/requests/page.tsx.
 */
export default function LabelManagerRequestChatPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = conversationIdFromPath(pathname);
  const from = searchParams.get("from");

  const conversations = useLabelInboxStore((s) => s.conversations);
  const messages = useLabelInboxStore((s) => s.messages);

  const existing = conversations.find((c) => c.id === id);
  if (!existing) notFound();

  return (
    <ConversationThread
      conversationId={id}
      peerName={mockArtist.name}
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Requests", href: "/dashboard/requests" },
        { label: mockArtist.name },
      ]}
      initialMessages={messages.filter((m) => m.conversationId === id)}
      backHref={from ?? undefined}
      backFallback="/dashboard/requests"
    />
  );
}

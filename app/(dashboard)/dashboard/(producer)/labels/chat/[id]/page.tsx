"use client";

import { notFound, usePathname } from "next/navigation";
import ConversationThread from "@/components/dashboard/messaging/ConversationThread";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockLabelSubmissions } from "@/lib/mock/labelSubmissions";
import { mockLabels } from "@/lib/mock/labels";

/** Same convention as connections/chat/[id]: derive id from pathname, not useParams(). */
function conversationIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/labels\/chat\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function LabelConversationPage() {
  const pathname = usePathname();
  const id = conversationIdFromPath(pathname);

  const conversations = useLabelInboxStore((s) => s.conversations);
  const messages = useLabelInboxStore((s) => s.messages);

  // A real conversation (seeded or producer-initiated), or one just opened from
  // an accepted/listening submission with no prior history yet — same fallback
  // pattern as connections/chat/[id].
  const existing = conversations.find((c) => c.id === id);
  const fromSubmission = mockLabelSubmissions.find(
    (s) => s.id === id && (s.status === "accepted" || s.status === "listening")
  );
  const labelFromSubmission = fromSubmission
    ? mockLabels.find((l) => l.slug === fromSubmission.labelSlug)
    : null;
  const peerName = existing?.peer.name ?? labelFromSubmission?.name;
  if (!peerName) notFound();

  return (
    <ConversationThread
      conversationId={id}
      peerName={peerName}
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: peerName },
      ]}
      initialMessages={existing ? messages.filter((m) => m.conversationId === id) : []}
    />
  );
}

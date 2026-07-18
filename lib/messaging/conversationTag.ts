import { Users, Send, Building2, UserPlus, Repeat, Trophy, type LucideIcon } from "lucide-react";
import type { Conversation, ChatMessage } from "@/types/message";

export interface ConversationTag {
  label: string;
  icon: LucideIcon;
  colorClass: string;
  /** Where clicking the tag itself goes — separate from the row's own
   *  click target, which always opens the chat. Absent when there's
   *  nothing more specific to link to (e.g. a producer-to-producer
   *  connection — the peer's name already identifies it). See
   *  docs/feature-unified-chat-inbox.md. */
  href?: string;
}

/** Every tag a conversation can carry, for the filter dropdown's option list. */
export const ALL_CONVERSATION_TAGS = [
  "Connection",
  "Demo submission",
  "Label reached out",
  "Intro request",
  "Collab request",
  "Remix request",
  "Contest entry",
] as const;

/**
 * Derives the origin tag (label, icon, color, click-through destination)
 * for a conversation — reuses the same colors each origin's *source*
 * feature already established elsewhere (remix = violet, contest = amber,
 * label reached out = teal, matching the "Labels" platform dot color).
 * See docs/feature-unified-chat-inbox.md, "Resolved decisions".
 */
export function conversationTag(conversation: Conversation, messages: ChatMessage[]): ConversationTag {
  const labelHref = conversation.peer.type === "label" ? `/dashboard/labels/${conversation.peer.slug}` : undefined;

  switch (conversation.origin.type) {
    case "connection":
      return { label: "Connection", icon: Users, colorClass: "text-accent bg-accent/10" };

    case "submission":
      return { label: "Demo submission", icon: Send, colorClass: "text-accent bg-accent/10", href: labelHref };

    case "label_outreach":
      return { label: "Label reached out", icon: Building2, colorClass: "text-teal-500 bg-teal-500/10", href: labelHref };

    case "producer_request":
      switch (conversation.origin.kind) {
        case "intro":
          return { label: "Intro request", icon: Send, colorClass: "text-accent bg-accent/10", href: labelHref };
        case "collab": {
          const artistId = conversation.origin.artistId;
          return {
            label: "Collab request",
            icon: UserPlus,
            colorClass: "text-accent bg-accent/10",
            href: artistId ? `/dashboard/artists/${artistId}` : labelHref,
          };
        }
        case "remix":
          return { label: "Remix request", icon: Repeat, colorClass: "text-violet-500 bg-violet-500/10", href: labelHref };
        case "contest": {
          const entry = messages.find(
            (m) => m.conversationId === conversation.id && m.attachment?.type === "contest_entry"
          );
          const contestHref =
            entry?.attachment?.type === "contest_entry" && conversation.peer.type === "label"
              ? `/dashboard/labels/${conversation.peer.slug}/contests/${entry.attachment.contestId}`
              : labelHref;
          return { label: "Contest entry", icon: Trophy, colorClass: "text-amber-500 bg-amber-500/10", href: contestHref };
        }
      }
  }
}

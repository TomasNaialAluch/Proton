import type { FeedbackProducer } from "@/types/feedback";

/** Who's on the other side of the thread — a fellow producer, or a label. */
export type ConversationPeer =
  | ({ type: "producer" } & FeedbackProducer)
  | { type: "label"; id: string; name: string; slug: string };

/**
 * What caused this thread to exist. `connection`: both sides accepted a
 * connection suggestion. `submission`: a label accepted/is listening to a
 * demo. `label_outreach`: the label reached out directly, no submission
 * involved — see "El otro caso: la label contacta primero" in
 * docs/label-contracts/contracts-rebuild-plan.md.
 */
export type ConversationOrigin =
  | { type: "connection"; connectionId: string }
  | { type: "submission"; submissionId: string }
  | { type: "label_outreach" }
  /** Producer-initiated, not tied to a track submission: an intro on a closed
   *  label, a request to collaborate with a roster artist, a remix request,
   *  or a contest entry. `kind` drives the icon/label shown in the inbox.
   *  `artistId` is only set for `kind: "collab"` — same caveat as `kind`
   *  itself: reflects the conversation's first message only, since
   *  `sendLabelRequest` reuses an existing conversation with that label
   *  rather than starting a fresh one per request. See
   *  docs/feature-unified-chat-inbox.md. */
  | { type: "producer_request"; kind: "intro" | "collab" | "remix" | "contest"; artistId?: string };

/** 1:1 thread — with a producer (post-match) or a label (post-submission or direct outreach). */
export interface Conversation {
  id: string;
  peer: ConversationPeer;
  origin: ConversationOrigin;
  createdAt: string;
}

/** A contract handed over inside a message, rendered as a card in the same bubble — not a system log line. */
export interface ContractAttachment {
  type: "contract";
  contractId: string;
  contractLabel: string;
}

/**
 * A remix file submitted against a specific contest, rendered as a card
 * in the same bubble. Carries `contestId` so a submission is identifiable
 * even when it lands inside a conversation that already existed for some
 * other reason (see "One more real gap" in docs/feature-contest-flow.md)
 * — `sendLabelRequest` reuses an existing conversation with a label
 * rather than always starting a fresh one.
 */
export interface ContestEntryAttachment {
  type: "contest_entry";
  contestId: string;
  trackId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export type MessageAttachment = ContractAttachment | ContestEntryAttachment;

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromMe: boolean;
  text: string;
  createdAt: string;
  attachment?: MessageAttachment;
}

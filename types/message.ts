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
  | { type: "label_outreach" };

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

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromMe: boolean;
  text: string;
  createdAt: string;
  attachment?: ContractAttachment;
}

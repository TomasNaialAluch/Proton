import type { FeedbackProducer } from "@/types/feedback";

/** Minimal 1:1 thread — created only after both sides accept a connection suggestion. */
export interface Conversation {
  id: string;
  peer: FeedbackProducer;
  connectionId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromMe: boolean;
  text: string;
  createdAt: string;
}

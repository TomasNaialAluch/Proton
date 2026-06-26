import type { Conversation, ChatMessage } from "@/types/message";

/** Seeded as a match that already completed before this session (Darko). */
export const mockConversations: Conversation[] = [
  {
    id: "convo-1",
    peer: { id: "darko", name: "Darko" },
    connectionId: "conn-darko-past",
    createdAt: "2026-06-21T10:00:00Z",
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: "convo-1",
    fromMe: false,
    text: "Hey! We just matched — been liking the percussion work on your tracks.",
    createdAt: "2026-06-21T10:01:00Z",
  },
  {
    id: "msg-2",
    conversationId: "convo-1",
    fromMe: true,
    text: "Thanks! I've been wanting to collab with someone stronger on arrangement than me, honestly.",
    createdAt: "2026-06-21T10:05:00Z",
  },
];

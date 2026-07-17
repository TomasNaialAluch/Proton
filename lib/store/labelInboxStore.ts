import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockConversations, mockMessages } from "@/lib/mock/messages";
import type { Conversation, ChatMessage } from "@/types/message";
import type { ProtonLabel } from "@/types/label";

type RequestKind = "intro" | "collab" | "remix" | "contest";

interface LabelInboxState {
  conversations: Conversation[];
  messages: ChatMessage[];
  /** Sends a producer-initiated message to a label — an intro, a collab
   *  request on a roster artist, a remix request, or a contest entry.
   *  Reuses the existing conversation with that label if one is already
   *  open, otherwise opens a new one. Returns the conversation id so the
   *  caller can link straight to it. */
  sendLabelRequest: (input: {
    label: ProtonLabel;
    kind: RequestKind;
    text: string;
    attachment?: ChatMessage["attachment"];
    /** Only meaningful for `kind: "collab"` — see `ConversationOrigin`. */
    artistId?: string;
  }) => string;
}

export const useLabelInboxStore = create<LabelInboxState>()(
  persist(
    (set, get) => ({
      conversations: mockConversations,
      messages: mockMessages,

      sendLabelRequest: ({ label, kind, text, attachment, artistId }) => {
        const { conversations, messages } = get();

        const existing = conversations.find(
          (c) => c.peer.type === "label" && c.peer.slug === label.slug
        );

        const conversationId = existing?.id ?? `convo-request-${label.slug}-${Date.now()}`;

        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          fromMe: true,
          text,
          createdAt: new Date().toISOString(),
          ...(attachment ? { attachment } : {}),
        };

        set({
          conversations: existing
            ? conversations
            : [
                {
                  id: conversationId,
                  peer: { type: "label", id: label.id, name: label.name, slug: label.slug },
                  origin: { type: "producer_request", kind, ...(artistId ? { artistId } : {}) },
                  createdAt: new Date().toISOString(),
                },
                ...conversations,
              ],
          messages: [...messages, newMessage],
        });

        return conversationId;
      },
    }),
    { name: "proton-label-inbox" }
  )
);

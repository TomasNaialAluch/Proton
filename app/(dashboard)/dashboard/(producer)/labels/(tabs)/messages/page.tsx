"use client";

import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ConversationList from "@/components/dashboard/messaging/ConversationList";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";

export default function LabelsMessagesPage() {
  const conversations = useLabelInboxStore((s) => s.conversations);
  const messages = useLabelInboxStore((s) => s.messages);

  return (
    <>
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: "Messages" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Labels</h1>
      <p className="text-sm text-text-secondary mb-6">
        Conversations with labels — after an accepted demo, a direct request, or when a label reaches out.
      </p>

      <ConversationList
        conversations={conversations}
        messages={messages}
        defaultPeerType="label"
        emptyMessage="No conversations yet — they open up once a label accepts a demo, you send a request, or a label reaches out directly."
      />
    </>
  );
}

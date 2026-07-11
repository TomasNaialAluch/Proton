"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Send, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import type { ProtonLabel } from "@/types/label";

export default function RosterArtistRow({ label, artistName }: { label: ProtonLabel; artistName: string }) {
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [open, setOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [sent, setSent] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const submit = () => {
    if (!pitch.trim()) return;
    const id = sendLabelRequest({
      label,
      kind: "collab",
      text: `Collab request re: ${artistName} — ${pitch.trim()}`,
    });
    setConversationId(id);
    setSent(true);
    setPitch("");
  };

  return (
    <div className="rounded-full border border-[var(--color-border)] bg-surface overflow-hidden" style={{ width: open ? "100%" : "auto" }}>
      <div className="flex items-center gap-2 pl-1.5 pr-1.5 py-1.5">
        <span className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-accent/10 text-accent shrink-0">
          {artistName.slice(0, 2).toUpperCase()}
        </span>
        <span className="text-xs font-medium text-text-primary shrink-0">{artistName}</span>

        {!open && !sent && (
          <button
            onClick={() => setOpen(true)}
            aria-label={`Request to collaborate with ${artistName}`}
            title="Request to collaborate"
            className="ml-0.5 flex size-5 items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors shrink-0"
          >
            <UserPlus size={12} />
          </button>
        )}

        {sent && (
          <span className="ml-0.5 flex items-center gap-1 text-[11px] text-emerald-500 shrink-0">
            <CheckCircle2 size={12} />
          </span>
        )}
      </div>

      {open && !sent && (
        <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            rows={2}
            autoFocus
            placeholder={`What kind of collaboration with ${artistName}? (co-production, remix trade, guest vocal…)`}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-xs text-text-primary placeholder:text-text-secondary/60"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={!pitch.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
            >
              <Send size={11} /> Send to {label.name}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {sent && conversationId && (
        <div className="px-3 pb-3 pt-1">
          <Link href={`/dashboard/labels/chat/${conversationId}`} className="text-[11px] font-semibold text-accent underline underline-offset-2">
            View conversation
          </Link>
        </div>
      )}
    </div>
  );
}

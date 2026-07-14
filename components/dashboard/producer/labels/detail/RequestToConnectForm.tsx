"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import type { ProtonLabel } from "@/types/label";

export default function RequestToConnectForm({ label }: { label: ProtonLabel }) {
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [intro, setIntro] = useState("");
  const [justSent, setJustSent] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intro.trim()) return;
    const id = sendLabelRequest({ label, kind: "intro", text: intro.trim() });
    setConversationId(id);
    setJustSent(true);
    setIntro("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-accent/25 bg-accent/5 p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">Request to connect with {label.name}</h2>
        <p className="mt-1 text-xs text-text-secondary leading-relaxed">
          {label.name} isn&apos;t reviewing unsolicited demos right now. Send a short introduction instead —
          this isn&apos;t a demo review request, just a way to get on their radar.
        </p>
      </div>

      <div>
        <label htmlFor="connect-intro" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Introduce yourself
        </label>
        <textarea
          id="connect-intro"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={4}
          placeholder={`Who you are, what you make, why ${label.name} fits…`}
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60"
        />
      </div>

      <button
        type="submit"
        disabled={!intro.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <Send size={14} /> Send introduction
      </button>

      {justSent && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} className="shrink-0" />
          Sent.{" "}
          {conversationId && (
            <Link href={`/dashboard/labels/chat/${conversationId}`} className="font-semibold underline underline-offset-2">
              Open conversation
            </Link>
          )}
        </div>
      )}
    </form>
  );
}

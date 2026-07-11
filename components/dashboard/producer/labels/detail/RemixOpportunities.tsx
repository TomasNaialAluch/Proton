"use client";

import { useState } from "react";
import Link from "next/link";
import { Repeat, Calendar, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import type { ProtonLabel } from "@/types/label";

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function RemixRow({ label, opportunity }: { label: ProtonLabel; opportunity: NonNullable<ProtonLabel["remixOpportunities"]>[number] }) {
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [requested, setRequested] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const request = () => {
    const id = sendLabelRequest({
      label,
      kind: "remix",
      text: `I'd like to remix "${opportunity.trackTitle}" by ${opportunity.originalArtist}.`,
    });
    setConversationId(id);
    setRequested(true);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-surface px-4 py-3">
      <div className="size-9 rounded-lg flex items-center justify-center shrink-0 bg-accent/10 text-accent">
        <Repeat size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{opportunity.trackTitle}</p>
        <p className="text-xs text-text-secondary truncate">{opportunity.originalArtist}</p>
        {opportunity.deadline && (
          <p className="flex items-center gap-1 text-[11px] text-text-secondary/70 mt-0.5">
            <Calendar size={9} /> Ends {formatDeadline(opportunity.deadline)}
          </p>
        )}
      </div>

      {requested ? (
        <div className="flex items-center gap-1 shrink-0 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} />
          {conversationId ? (
            <Link href={`/dashboard/labels/chat/${conversationId}`} className="font-semibold underline underline-offset-2">
              Sent
            </Link>
          ) : (
            "Sent"
          )}
        </div>
      ) : (
        <button
          onClick={request}
          className="shrink-0 rounded-lg border border-accent/40 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          Request to remix
        </button>
      )}
    </div>
  );
}

export default function RemixOpportunities({ label }: { label: ProtonLabel }) {
  const opportunities = label.remixOpportunities;
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-text-primary mb-3">Remix opportunities</h2>
      <div className="flex flex-col gap-2">
        {opportunities.map((o) => (
          <RemixRow key={o.id} label={label} opportunity={o} />
        ))}
      </div>
    </section>
  );
}

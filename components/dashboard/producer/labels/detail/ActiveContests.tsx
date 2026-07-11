"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Calendar, Gift, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import type { ProtonLabel } from "@/types/label";

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ContestEntry({ label, contest }: { label: ProtonLabel; contest: NonNullable<ProtonLabel["activeContests"]>[number] }) {
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [entered, setEntered] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const enter = () => {
    const id = sendLabelRequest({
      label,
      kind: "contest",
      text: `I'd like to enter "${contest.title}".`,
    });
    setConversationId(id);
    setEntered(true);
  };

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <div className="flex items-start gap-2">
        <Trophy size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">{contest.title}</p>
          <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{contest.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-text-secondary">
            {contest.deadline && (
              <span className="flex items-center gap-1">
                <Calendar size={10} /> Ends {formatDeadline(contest.deadline)}
              </span>
            )}
            {contest.prize && (
              <span className="flex items-center gap-1">
                <Gift size={10} /> {contest.prize}
              </span>
            )}
          </div>

          {entered ? (
            <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={13} className="shrink-0" />
              Entry sent.{" "}
              {conversationId && (
                <Link href={`/dashboard/labels/chat/${conversationId}`} className="font-semibold underline underline-offset-2">
                  View conversation
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={enter}
              className="mt-3 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Enter contest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActiveContests({ label }: { label: ProtonLabel }) {
  const contests = label.activeContests;
  if (!contests || contests.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-text-primary mb-3">Active contests</h2>
      <div className="flex flex-col gap-3">
        {contests.map((c) => (
          <ContestEntry key={c.id} label={label} contest={c} />
        ))}
      </div>
    </section>
  );
}

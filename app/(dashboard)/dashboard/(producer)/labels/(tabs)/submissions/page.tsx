"use client";

import Link from "next/link";
import { Inbox, FileAudio, MessageCircle, ChevronRight } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import SubmissionStatusBadge from "@/components/dashboard/producer/labels/SubmissionStatusBadge";
import { useLabelSubmissionsStore } from "@/lib/store/labelSubmissionsStore";
import { mockTracks } from "@/lib/mock/tracks";
import { mockLabels } from "@/lib/mock/labels";
import { mockConversations } from "@/lib/mock/messages";
import type { LabelSubmission } from "@/types/submission";

const CHATTABLE_STATUSES = ["accepted", "listening"] as const;

function chatIdFor(s: LabelSubmission): string | null {
  if (!CHATTABLE_STATUSES.includes(s.status as (typeof CHATTABLE_STATUSES)[number])) return null;
  const conversation = mockConversations.find(
    (c) => c.origin.type === "submission" && c.origin.submissionId === s.id
  );
  return conversation?.id ?? s.id;
}

function submissionTitle(s: LabelSubmission) {
  if (s.trackId) return mockTracks.find((t) => t.id === s.trackId)?.title ?? "Unknown track";
  return s.fileName ?? "Untitled demo";
}

function labelName(labelSlug: string) {
  return mockLabels.find((l) => l.slug === labelSlug)?.name ?? labelSlug;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LabelsSubmissionsPage() {
  const submissions = useLabelSubmissionsStore((s) => s.submissions);

  return (
    <>
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: "Submissions" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Labels</h1>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-12 text-center">
          <Inbox size={20} className="text-text-secondary" />
          <p className="text-sm text-text-secondary">No submissions yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
          {submissions.map((s) => {
            const chatId = chatIdFor(s);
            const content = (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary truncate">
                      {!s.trackId && <FileAudio size={12} className="text-accent shrink-0" />}
                      {submissionTitle(s)}
                    </p>
                    <SubmissionStatusBadge status={s.status} />
                  </div>
                  <p className="text-xs text-text-secondary">
                    {labelName(s.labelSlug)}
                    {s.genre && ` · ${s.genre}`}
                  </p>
                  {s.note && <p className="mt-1 text-xs text-text-secondary italic">&ldquo;{s.note}&rdquo;</p>}
                  <p className="text-xs text-text-secondary mt-1">Sent {formatDate(s.sentAt)}</p>
                  {chatId && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-accent">
                      <MessageCircle size={11} /> Open conversation with {labelName(s.labelSlug)}
                    </p>
                  )}
                </div>
                {chatId && <ChevronRight size={16} className="shrink-0 text-text-secondary mt-1" />}
              </>
            );

            return (
              <li key={s.id}>
                {chatId ? (
                  <Link
                    href={`/dashboard/labels/chat/${chatId}`}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-[var(--color-border)]/30 transition-colors"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-start gap-3 px-5 py-4">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

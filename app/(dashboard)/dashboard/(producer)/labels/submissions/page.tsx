"use client";

import { Inbox } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import LabelsTabs from "@/components/dashboard/producer/labels/LabelsTabs";
import SubmissionStatusBadge from "@/components/dashboard/producer/labels/SubmissionStatusBadge";
import { useLabelSubmissionsStore } from "@/lib/store/labelSubmissionsStore";
import { mockTracks } from "@/lib/mock/tracks";
import { mockLabels } from "@/lib/mock/labels";

function trackTitle(trackId: string) {
  return mockTracks.find((t) => t.id === trackId)?.title ?? "Unknown track";
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
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: "Submissions" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Labels</h1>

      <LabelsTabs />

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-12 text-center">
          <Inbox size={20} className="text-text-secondary" />
          <p className="text-sm text-text-secondary">No submissions yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
          {submissions.map((s) => (
            <li key={s.id} className="flex items-start gap-3 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-text-primary truncate">{trackTitle(s.trackId)}</p>
                  <SubmissionStatusBadge status={s.status} />
                </div>
                <p className="text-xs text-text-secondary">{labelName(s.labelSlug)}</p>
                {s.note && <p className="mt-1 text-xs text-text-secondary italic">&ldquo;{s.note}&rdquo;</p>}
                <p className="text-xs text-text-secondary mt-1">Sent {formatDate(s.sentAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

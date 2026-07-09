"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";
import { mockTracks } from "@/lib/mock/tracks";
import { mockArtist } from "@/lib/mock/artist";
import { useLabelSubmissionsStore } from "@/lib/store/labelSubmissionsStore";

const myTracks = mockTracks.filter((t) => t.artistId === mockArtist.id);

/** Demo submission form, scoped to a single label (its slug/name come from the label's profile page). */
export default function SubmitTrackForm({ labelSlug, labelName }: { labelSlug: string; labelName: string }) {
  const submitTrack = useLabelSubmissionsStore((s) => s.submitTrack);
  const [trackId, setTrackId] = useState(myTracks[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [justSent, setJustSent] = useState(false);

  const canSubmit = trackId !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    submitTrack({ trackId, labelSlug, note });
    setNote("");
    setJustSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 space-y-4">
      <h2 className="text-sm font-semibold text-text-primary">Send a demo to {labelName}</h2>

      <div>
        <label htmlFor="submit-track" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Track
        </label>
        <select
          id="submit-track"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2.5 text-sm text-text-primary"
        >
          {myTracks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="submit-note" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Note (optional)
        </label>
        <textarea
          id="submit-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={`Tell ${labelName} why this track fits their catalog…`}
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <Send size={14} /> Send to {labelName}
      </button>

      {justSent && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} className="shrink-0" />
          Sent. Track it under{" "}
          <Link href="/dashboard/labels/submissions" className="font-semibold underline underline-offset-2">
            Submissions
          </Link>.
        </div>
      )}
    </form>
  );
}

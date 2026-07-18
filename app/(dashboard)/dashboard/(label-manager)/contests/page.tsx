"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Trophy, Calendar, Gift, ChevronRight, Plus } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { useContestsStore } from "@/lib/store/label-manager/contestsStore";
import { mockLabels } from "@/lib/mock/labels";
import { mockTracks } from "@/lib/mock/tracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function eligibleTracks(labelSlug: string) {
  return [...mockTracks, ...LABEL_SAMPLE_TRACKS].filter((t) => t.labelSlug === labelSlug);
}

/**
 * Label-manager's contest authoring surface — item 3 of the toolkit
 * (docs/feature-label-manager-toolkit.md). Writes into `useContestsStore`,
 * which `useLabelContests` merges with the mock-seeded `activeContests` at
 * every producer-facing read site, so a newly created contest shows up on
 * the label's page and the track's remix card immediately, without
 * touching those already-working components.
 */
export default function ContestsPage() {
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const extraContests = useContestsStore((s) => s.extraContests);
  const createContest = useContestsStore((s) => s.createContest);

  const activeLabel = useMemo(
    () => mockLabels.find((l) => l.id === activeLabelId) ?? null,
    [activeLabelId]
  );

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trackId, setTrackId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [prize, setPrize] = useState("");

  const tracks = activeLabel ? eligibleTracks(activeLabel.slug) : [];

  const visibleContests = useMemo(() => {
    const labels = mode === "all_labels" ? mockLabels : mockLabels.filter((l) => l.id === activeLabelId);
    return labels.flatMap((label) => {
      const seeded = (label.activeContests ?? []).map((c) => ({ label, contest: c }));
      const extra = extraContests
        .filter((e) => e.labelId === label.id)
        .map((e) => ({ label, contest: e.contest }));
      return [...seeded, ...extra];
    });
  }, [mode, activeLabelId, extraContests]);

  const submit = () => {
    if (!activeLabel || !title.trim() || !description.trim() || !trackId) return;
    createContest({
      labelId: activeLabel.id,
      title: title.trim(),
      description: description.trim(),
      trackId,
      deadline: deadline || undefined,
      prize: prize.trim() || undefined,
    });
    setShowForm(false);
    setTitle("");
    setDescription("");
    setTrackId("");
    setDeadline("");
    setPrize("");
  };

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contests" },
      ]} />

      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <Trophy size={18} className="text-accent" /> Contests
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Remix calls open to producers, for tracks {mode === "all_labels" ? "your labels" : activeLabel?.name ?? "this label"} own.
        </p>
      </header>

      <ScopeFilterChips />

      {mode === "all_labels" ? (
        <p className="text-sm text-text-secondary py-2">
          Pick a specific label above to create a new contest.
        </p>
      ) : showForm ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-4 flex flex-col gap-3">
          {tracks.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No tracks found for {activeLabel?.name} to put up for remix in this prototype.
            </p>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-text-secondary">Track</label>
                <select
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select a track…</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weightless — Remix Call"
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What are you looking for in a remix of this track?"
                  className="mt-1 w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-text-secondary">Deadline (optional)</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-text-secondary">Prize (optional)</label>
                  <input
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="e.g. Possible release"
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={submit}
                  disabled={!title.trim() || !description.trim() || !trackId}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Create contest
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
        >
          <Plus size={14} /> New contest
        </button>
      )}

      {visibleContests.length === 0 ? (
        <p className="text-sm text-text-secondary py-8 text-center">
          No contests for this scope right now.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleContests.map(({ label, contest }) => (
            <Link
              key={contest.id}
              href={`/dashboard/labels/${label.slug}/contests/${contest.id}?from=${encodeURIComponent("/dashboard/contests")}`}
              className="flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-surface p-4 hover:border-accent/40 transition-colors"
            >
              <Trophy size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">{contest.title}</p>
                {mode === "all_labels" && (
                  <p className="text-xs text-accent">{label.name}</p>
                )}
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
              </div>
              <ChevronRight size={14} className="text-text-secondary/50 shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

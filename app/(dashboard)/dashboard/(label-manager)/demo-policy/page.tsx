"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { useDemoPolicyStore } from "@/lib/store/label-manager/demoPolicyStore";
import { useEffectiveLabel } from "@/lib/labels/useEffectiveLabel";
import { mockLabels } from "@/lib/mock/labels";
import type { ProtonLabel } from "@/types/label";

const STATUS_OPTIONS: { value: NonNullable<ProtonLabel["demoStatus"]>; label: string; hint: string }[] = [
  { value: "open", label: "Open", hint: "Producers can submit demos directly." },
  { value: "closed", label: "Closed", hint: "Producers can only request to connect." },
  { value: "unknown", label: "Unknown", hint: "Shown as unclear — same as closed for producers." },
];

const FORMAT_OPTIONS: { value: NonNullable<NonNullable<ProtonLabel["demoPolicy"]>["preferredFormat"]>; label: string }[] = [
  { value: "wav", label: "WAV" },
  { value: "mp3", label: "MP3" },
  { value: "either", label: "WAV or MP3" },
];

/**
 * Label-manager's settings surface for demo policy — item 4 of the
 * toolkit (docs/feature-label-manager-toolkit.md). Writes into
 * `useDemoPolicyStore`; `useEffectiveLabel` merges those edits back onto
 * `ProtonLabel` at the one place (`LabelProfileClient`) that resolves a
 * label and passes it to `LabelDetailHeader`/`DemoPolicyCard` — so this
 * page never has to touch those already-working, producer-facing
 * components. Browse/Discover list badges still read the static mock
 * fields directly and won't reflect an edit until those are wired the
 * same way — a known gap, not fixed here.
 */
export default function DemoPolicyPage() {
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const setDemoPolicy = useDemoPolicyStore((s) => s.setDemoPolicy);

  const rawLabel = useMemo(
    () => mockLabels.find((l) => l.id === activeLabelId) ?? null,
    [activeLabelId]
  );
  const effectiveLabel = useEffectiveLabel(rawLabel ?? mockLabels[0]);

  const [status, setStatus] = useState<NonNullable<ProtonLabel["demoStatus"]>>("open");
  const [genres, setGenres] = useState("");
  const [format, setFormat] = useState<NonNullable<NonNullable<ProtonLabel["demoPolicy"]>["preferredFormat"]> | "">("");
  const [responseTime, setResponseTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  // Re-seed the form whenever the scoped label changes.
  useEffect(() => {
    if (!rawLabel) return;
    setStatus(effectiveLabel.demoStatus ?? "unknown");
    setGenres((effectiveLabel.demoGenres ?? []).join(", "));
    setFormat(effectiveLabel.demoPolicy?.preferredFormat ?? "");
    setResponseTime(effectiveLabel.demoPolicy?.estimatedResponseTime ?? "");
    setNotes(effectiveLabel.demoPolicy?.notes ?? "");
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawLabel?.id]);

  const save = () => {
    if (!rawLabel) return;
    setDemoPolicy(rawLabel.id, {
      demoStatus: status,
      demoGenres: genres.split(",").map((g) => g.trim()).filter(Boolean),
      demoPolicy: {
        ...(format ? { preferredFormat: format } : {}),
        ...(responseTime.trim() ? { estimatedResponseTime: responseTime.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      },
    });
    setSaved(true);
  };

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Demo policy" },
      ]} />

      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <ClipboardList size={18} className="text-accent" /> Demo policy
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Controls what producers see on your label page — demo status, preferred genres, and submission format.
        </p>
      </header>

      <ScopeFilterChips />

      {mode === "all_labels" || !rawLabel ? (
        <p className="text-sm text-text-secondary py-2">
          Pick a specific label above to edit its demo policy.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">Demo status</p>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                    status === opt.value ? "border-accent bg-accent/5" : "border-[var(--color-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="demoStatus"
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-medium text-text-primary">{opt.label}</span>
                    <span className="block text-xs text-text-secondary">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary">Preferred genres (comma separated)</label>
            <input
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="e.g. Progressive House, Melodic Techno"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary">Preferred format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Not specified</option>
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary">Estimated response time</label>
            <input
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value)}
              placeholder="e.g. 2-3 weeks"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Anything producers should know before submitting."
              className="mt-1 w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Save changes
            </button>
            {saved && <span className="text-xs text-emerald-500">Saved.</span>}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Radar, MapPin, Sparkles, CheckCircle2, X } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockLabels } from "@/lib/mock/labels";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { useArtistSuggestionsStore } from "@/lib/store/label-manager/artistSuggestionsStore";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import type { LabelArtistSuggestion } from "@/types/labelArtistSuggestion";

const REASON_LABEL: Record<LabelArtistSuggestion["reason"]["type"], string> = {
  genre_fit: "Genre fit",
  catalog_gap: "Catalog gap",
};

function SuggestionCard({ suggestion }: { suggestion: LabelArtistSuggestion }) {
  const dismissSuggestion = useArtistSuggestionsStore((s) => s.dismissSuggestion);
  const markContacted = useArtistSuggestionsStore((s) => s.markContacted);
  const sendArtistOutreach = useLabelInboxStore((s) => s.sendArtistOutreach);
  const [note, setNote] = useState("");
  const [expanded, setExpanded] = useState(false);

  const reachOut = () => {
    const text = note.trim() || `Hi ${suggestion.artist.name} — we've been following your work and would love to talk about releasing together.`;
    const conversationId = sendArtistOutreach({
      artistId: suggestion.artist.id,
      artistName: suggestion.artist.name,
      text,
    });
    markContacted(suggestion.id, conversationId);
  };

  if (suggestion.status === "dismissed") return null;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary">{suggestion.artist.name}</p>
          {suggestion.artist.country && (
            <p className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
              <MapPin size={11} /> {suggestion.artist.country}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestion.artist.genres.map((g) => (
              <span key={g} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                {g}
              </span>
            ))}
          </div>
        </div>
        <StatusBadge tone="info">{REASON_LABEL[suggestion.reason.type]}</StatusBadge>
      </div>

      {suggestion.artist.bio && (
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">{suggestion.artist.bio}</p>
      )}

      <ul className="mt-3 space-y-1.5">
        {suggestion.reason.highlights.map((h) => (
          <li key={h} className="flex items-start gap-1.5 text-xs text-text-secondary leading-relaxed">
            <Sparkles size={11} className="text-accent shrink-0 mt-0.5" />
            {h}
          </li>
        ))}
      </ul>

      {suggestion.status === "contacted" ? (
        <div className="flex items-center gap-2 mt-4 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} className="shrink-0" />
          Reached out.
          {suggestion.conversationId && (
            <Link href={`/dashboard/connections/chat/${suggestion.conversationId}`} className="font-semibold underline underline-offset-2">
              View conversation
            </Link>
          )}
        </div>
      ) : expanded ? (
        <div className="mt-4 flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={`Tell ${suggestion.artist.name} why you're reaching out…`}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background
              px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60
              focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reachOut}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Reach out
          </button>
          <button
            type="button"
            onClick={() => dismissSuggestion(suggestion.id)}
            aria-label="Dismiss suggestion"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)] transition-colors"
          >
            <X size={12} /> Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default function ScoutingPage() {
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const suggestions = useArtistSuggestionsStore((s) => s.suggestions);

  const activeLabel = useMemo(
    () => mockLabels.find((l) => l.id === activeLabelId) ?? null,
    [activeLabelId]
  );

  const visible = useMemo(() => {
    const scoped = mode === "all_labels" ? suggestions : suggestions.filter((s) => s.labelId === activeLabelId);
    return scoped.filter((s) => s.status !== "dismissed");
  }, [suggestions, mode, activeLabelId]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Scouting" },
      ]} />

      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <Radar size={18} className="text-accent" /> Scouting
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Artists not on {mode === "all_labels" ? "any of your labels'" : `${activeLabel?.name ?? "this label's"}`} roster,
          worth reaching out to.
        </p>
      </header>

      <ScopeFilterChips />

      {visible.length === 0 ? (
        <p className="text-sm text-text-secondary py-8 text-center">
          No suggestions for this scope right now.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      )}
    </main>
  );
}

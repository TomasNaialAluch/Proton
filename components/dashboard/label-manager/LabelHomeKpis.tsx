"use client";

import { useMemo } from "react";
import { Users, CalendarClock, AlertTriangle, Inbox } from "lucide-react";
import KpiCard from "@/components/ui/KpiCard";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import { mockLabels } from "@/lib/mock/labels";
import { useLabelContests } from "@/lib/contests/useLabelContests";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";

/** Fixed KPI row — mirrors `DashboardContent.tsx`'s 3 stat cards. The first
 *  3 reuse the same derivation `roster/page.tsx` already computes (active
 *  artists, releases next 30d, issues) so Home and Roster never disagree on
 *  these numbers; the 4th (open contests/requests) is new at the Home level.
 *  See docs/README-label-manager-rebuild-plan.md, section 6.2. */
export default function LabelHomeKpis({ activeLabelId }: { activeLabelId: string }) {
  const conversations = useLabelInboxStore((s) => s.conversations);
  const label = useMemo(() => mockLabels.find((l) => l.id === activeLabelId) ?? null, [activeLabelId]);
  const contests = useLabelContests(label ?? { id: activeLabelId, activeContests: [] });

  const rosterArtists = useMemo(() => {
    const artistIds = new Set(mockLabelCatalog.filter((r) => r.labelId === activeLabelId).map((r) => r.artistId));
    return mockRosterArtists.filter((a) => artistIds.has(a.id));
  }, [activeLabelId]);

  const kpis = useMemo(() => {
    // Same formula as roster/page.tsx, kept in sync deliberately — see the
    // comment there on why it's `(idx + 1) % 5`, not `idx % 5`.
    const rows = rosterArtists.map((a, idx) => {
      const active = (idx + 1) % 5 !== 0;
      const nextReleaseDays = 7 + (idx * 9) % 46;
      const issues = active ? (idx % 3 === 0 ? 1 : 0) : 2;
      return { active, nextReleaseDays, issues };
    });
    return {
      activeArtists: rows.filter((r) => r.active).length,
      next30: rows.filter((r) => r.nextReleaseDays <= 30).length,
      issues: rows.reduce((s, r) => s + r.issues, 0),
    };
  }, [rosterArtists]);

  const openRequests = useMemo(() => {
    if (!label) return 0;
    return conversations.filter(
      (c) =>
        c.peer.type === "label" &&
        c.peer.slug === label.slug &&
        c.origin.type === "producer_request" &&
        (c.origin.kind === "remix" || c.origin.kind === "contest")
    ).length;
  }, [conversations, label]);

  return (
    <section className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4 lg:gap-4">
      <KpiCard icon={<Users size={14} />} label="Active artists" value={kpis.activeArtists} accent />
      <KpiCard icon={<CalendarClock size={14} />} label="Releases 30d" value={kpis.next30} />
      <KpiCard icon={<AlertTriangle size={14} />} label="Issues" value={kpis.issues} />
      <KpiCard icon={<Inbox size={14} />} label="Open requests" value={openRequests + contests.length} />
    </section>
  );
}

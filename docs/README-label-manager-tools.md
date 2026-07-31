# Label-manager tools — what each one does, and its link to Producer View

Quick reference for every page under `app/(dashboard)/dashboard/(label-manager)/`
plus Home (served by the shared `app/(dashboard)/dashboard/page.tsx`, which
branches to `LabelDashboardHome` when `view === "label_manager"`). For the
*design rationale* behind Requests/Contests/Demo policy/Scouting, see
`docs/feature-label-manager-toolkit.md` — this doc is just "what it does today."

## Home

`components/dashboard/label-manager/LabelDashboardHome.tsx`

A customizable widget board — same drag/reorder/hide/reset mechanic as the
producer Home, mirrored 1:1 (`labelDashboardStore.ts` next to the producer's
own dashboard store). Fixed header above the widgets:
- `LabelHomeHero` — the label's identity (name, genres, image) *and* the
  person managing it (`mockLabelManagerProfile`). Two identities in one hero,
  because a label account represents both, where a producer account only
  ever has one.
- `LabelHomeKpis` — active artists / releases next 30d / issues (same
  formula as Roster, kept in sync on purpose) / open requests+contests.

16 optional widgets (`widgets/registry.tsx`): revenue trend, latest releases,
activity feed, pending tasks, streams by release, statements progress,
roster growth, top territories, play sources, rising tracks, upcoming
releases, distribution status, catalog codes, royalties by store, payout
history, audio metadata.

**Relation to Producer View:** none. Label-manager-only, no shared data with
the producer dashboard beyond the identical widget-board *mechanism*.

## Roster

`app/(dashboard)/dashboard/(label-manager)/roster/page.tsx`

Table of every artist with at least one release in `mockLabelCatalog` scoped
to the active label (i.e. "on this label's roster" is derived from having a
release, not a flat membership list). Per artist: active/inactive, next
release ETA, 30-day streams, issue count — plus 4 KPI cards summarizing the
same. Clicking a row sets `labelScopeStore.activeArtistId` (the "zoom" filter
used across Catalog/Revenue/Statements) and jumps to Catalog.

**Relation to Producer View:** none directly — it's the label's internal
view of its own signed artists. It does drive `activeArtistId`, which scopes
what the label-manager sees on Catalog/Revenue/Statements, but nothing here
is read or written by producer-facing pages.

## Scouting

`app/(dashboard)/dashboard/(label-manager)/scouting/page.tsx`

The label-manager's "Discover" — but for *artists not yet on the roster*
worth reaching out to (`useArtistSuggestionsStore`, mock reasoning per
suggestion: genre fit / catalog gap). Reach out / Dismiss per card. "Reach
out" calls `sendArtistOutreach()` (`useLabelInboxStore`) and marks the
suggestion contacted with a link into the resulting conversation.

**Relation to Producer View:** yes — direct. `sendArtistOutreach` writes a
real conversation into the same shared `conversations`/`messages` data
producers read in their own Connections inbox. The producer being scouted
sees this message show up as an ordinary incoming chat; there's no separate
"label outreach" surface on the producer side, it's the same unified inbox
(`docs/feature-unified-chat-inbox.md`).

## Requests

`app/(dashboard)/dashboard/(label-manager)/requests/page.tsx`

Read-only inbox: filters the label's conversations down to ones a producer
started (`origin.type === "producer_request"`, kind `remix` or `contest`),
scoped to the active label. Shows sender, a preview of the last message, and
(for contest entries) which track/contest. Tapping a row opens the same
conversation thread (`requests/chat/[id]/page.tsx`).

**Relation to Producer View:** yes — direct, and the reverse direction of
Scouting. These conversations are *written by the producer side*
(`sendLabelRequest()`, triggered by "Request to remix" on `TrackRemixCard`
or entering a contest via `ContestSubmitCard`) — this page is purely a
filtered read over data the producer already created. No new store.

## Contests

`app/(dashboard)/dashboard/(label-manager)/contests/page.tsx`

Authoring form (track, title, description, deadline, prize) for remix
contests, scoped to tracks the active label actually owns. Writes to
`useContestsStore`. Lists both label-seeded contests (`label.activeContests`)
and label-manager-created ones side by side.

**Relation to Producer View:** yes — direct, via a merge hook.
`useLabelContests()` (`lib/contests/useLabelContests.ts`) combines
`useContestsStore` entries with the mock-seeded `activeContests` at every
producer-facing read site (`ActiveContests`, `ContestDetailClient`,
`TrackRemixCard`), so a contest created here appears to producers
immediately — those components were never touched.

## Demo policy

`app/(dashboard)/dashboard/(label-manager)/demo-policy/page.tsx`

Settings form for the label's demo submission policy: status
(open/closed/unknown), preferred genres, preferred format, response time,
notes. Writes to `useDemoPolicyStore`, scoped by label id.

**Relation to Producer View:** yes — direct, via a merge hook.
`useEffectiveLabel()` (`lib/labels/useEffectiveLabel.ts`) overlays saved
edits onto the mock `ProtonLabel` at the one place that resolves a label for
display (`LabelProfileClient`), so `LabelDetailHeader`/`DemoPolicyCard`/the
submit-demo gate all reflect it without changes. **Known gap:** Browse/
Discover list badges (`SearchResults`, `LabelRow`, `FeaturedCard`, the Labels
genre/tab pages) still read the static mock fields directly, so an edit
shows on the label's own page but not yet on those list views.

## Catalog

`app/(dashboard)/dashboard/(label-manager)/catalog/page.tsx`

Read-only list of releases (`mockLabelCatalog`) scoped to the active label
and, if set, `activeArtistId`. Status badges (live/delivered/qa/…) and
issue counts per release; tapping a row opens `LabelReleaseDetailsDrawer`.

**Relation to Producer View:** none — internal release/QA pipeline view.

## Revenue

`app/(dashboard)/dashboard/(label-manager)/revenue/page.tsx`

Read-only charts (`buildMockRevenue`): streams/revenue trend and top
DSP/territory breakdowns, scoped the same way as Catalog. Producer-view
users see a "not implemented yet" placeholder if they land on this route
(`view !== "label_manager"` branch).

**Relation to Producer View:** none — label-wide financials, not
per-producer.

## Statements

`app/(dashboard)/dashboard/(label-manager)/statements/page.tsx`

Read-only royalty runs (`mockLabelStatementRuns`) by period, with a
per-artist balances table (net owed, paid/approved/pending status). Same
producer placeholder pattern as Revenue.

**Relation to Producer View:** none directly here — but conceptually the
same numbers a producer would eventually see on their own individual
Royalties page (`/dashboard/royalties`); the two aren't wired together,
each reads its own mock dataset.

## Summary table

| Tool | Writes | Producer-facing counterpart |
|---|---|---|
| Home | widget layout only | — |
| Roster | — (read-only) | — |
| Scouting | `useLabelInboxStore` (outreach msg) | Producer's Connections inbox |
| Requests | — (read-only) | Producer's remix/contest actions (reverse of Scouting) |
| Contests | `useContestsStore` | `ActiveContests` / `TrackRemixCard` (merged via `useLabelContests`) |
| Demo policy | `useDemoPolicyStore` | `DemoPolicyCard` (merged via `useEffectiveLabel`) |
| Catalog | — (read-only) | — |
| Revenue | — (read-only) | — |
| Statements | — (read-only) | — |

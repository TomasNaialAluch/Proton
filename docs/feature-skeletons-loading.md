# Loading states: skeletons & spinners — audit and proposal

Working document for the `skeletons` branch. Maps every loading state that exists today in the app, then proposes where real skeletons are missing.

---

## 1. Summary

There is **no shared skeleton component** anywhere in the codebase (no `Skeleton.tsx`, no `loading.tsx` Next.js route files, no spinner component). What exists today is a mix of three different patterns, hand-rolled per page:

| Pattern | What it looks like | Where |
|---|---|---|
| Ad-hoc skeleton blocks | `<div className="animate-pulse rounded-lg bg-[var(--color-border)]" />`, sized per content | Dashboard home widgets, Performance page |
| Plain text fallback | `<p>Loading…</p>`, no visual structure | Public site pages, login, platform hub |
| Nothing | Content just appears once mock data resolves (synchronous, so there's nothing to show) | Most of the app — Feedback, Discover, Connections, Royalties, Contracts, Roster, Catalog, Statements, Settings |

There's also a fourth, app-wide case that doesn't fit the table: a full-screen **"Loading dashboard…" text** that briefly covers every single `/dashboard/*` page on load (see section 4) — the highest-traffic loading state in the app, and currently the least visually finished one.

---

## 2. Where real skeletons already exist (`animate-pulse`)

All in pages backed by **TanStack Query** (`useQuery`) or `<Suspense>` around a chart — i.e. the only two places in the app that actually simulate an async fetch (`lib/api/*` mock-delay functions). Everything else reads mock arrays synchronously and has nothing to wait for.

- **Dashboard home** (`/dashboard` → [DashboardContent.tsx](../components/dashboard/DashboardContent.tsx)) — `useQuery(["artist", ...])` drives `isLoading`, passed down as `DashboardWidgetProps.isLoading` to every widget:
  - [LatestTracksWidget.tsx:18-23](../components/dashboard/widgets/LatestTracksWidget.tsx) — 5 skeleton rows (`h-10`).
  - [StreamsByReleaseWidget.tsx:16-17](../components/dashboard/widgets/StreamsByReleaseWidget.tsx) — one `h-48` block, *plus* a separate `<Suspense>` fallback of the same size around the chart itself (double-covered: query loading and chart-render loading are different moments).
  - [StreamsWidget.tsx:17](../components/dashboard/widgets/StreamsWidget.tsx) — `<Suspense>` fallback only (`h-40`), doesn't use the query's `isLoading` at all.
  - Stat cards in `DashboardContent.tsx:374-376` don't skeleton — they just render `"—"` as the value while loading. Cheap, but inconsistent with the widgets below them doing real skeletons.
- **Performance page** ([performance/page.tsx](../app/(dashboard)/dashboard/(producer)/performance/page.tsx)) — same `useQuery`, most thorough coverage in the app:
  - KPI cards → `"—"` placeholder (same shortcut as the dashboard stat cards).
  - Streams chart, Genre donut → `<Suspense>` skeleton blocks (`:123`, `:131-133`).
  - Table rows → 5 skeleton rows (`:175-179`), same shape as `LatestTracksWidget`.

No two of these reuse a common component — each is its own inline `<div>` with hand-picked height and the same `bg-[var(--color-border)] animate-pulse` classes copy-pasted six times across three files.

---

## 3. Where there's only a text fallback, no skeleton

All public-site pages that wrap a server-data-dependent child in `<Suspense>`, plus one dashboard page:

- [HomeView.tsx:31](../app/(public)/HomeView.tsx), [[artist-name]/page.tsx:13](../app/(public)/[artist-name]/page.tsx), [labels/[slug]/page.tsx:13](../app/(public)/labels/[slug]/page.tsx), [LabelDetailView.tsx:60](../components/public/LabelDetailView.tsx), [login/page.tsx:10](../app/(public)/login/page.tsx), [platform/page.tsx:16](../app/(dashboard)/dashboard/(producer)/platform/page.tsx) — all render a centered `"Loading…"` string, no layout shape at all.

These are lower priority than section 4 below: most are wrapping `useSearchParams()` Suspense boundaries that resolve almost instantly (it's a Next.js requirement for static rendering, not a real network wait), so the fallback is rarely seen in practice.

---

## 4. The biggest gap: `PrototypePersistGate`

[PrototypePersistGate.tsx](../components/dashboard/PrototypePersistGate.tsx) wraps the **entire dashboard layout** — every single page under `/dashboard/*` — and blocks render until a Zustand store (`prototypeViewStore`, persisted to `localStorage`) finishes rehydrating client-side:

```tsx
if (!ready) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10">
      <p className="text-sm text-text-secondary">Loading dashboard…</p>
    </div>
  );
}
```

This is why, when you `curl` or server-render any `/dashboard/*` route, you only ever see this text — the real page content is entirely client-rendered after hydration (confirmed while debugging the Connections feature in this same session). In practice the gate clears in well under a second, but it's the **one loading state every user sees on every dashboard page load**, and right now it's a blank centered sentence with zero relationship to the page that's about to appear — no sidebar shape, no content blocks, just empty space then a hard swap.

This is the highest-leverage place to add a real skeleton: an **app-shell skeleton** (greyed-out sidebar rail + a generic content block) would make that swap feel instant instead of like a flash of blank page.

---

## 5. Pages with no loading state at all (nothing to add today, but listed for completeness)

These read mock arrays directly (`Array.find`, `Array.filter`) with no `useQuery`/`Suspense`/async boundary, so there is no actual wait to cover — content is synchronous once JS hydrates:

- Feedback (`/dashboard/feedback`, `/dashboard/feedback/[id]`)
- Discover (`/dashboard/discover`, `/dashboard/discover/[trackId]`)
- Connections (`/dashboard/connections`, `/dashboard/connections/[id]`, `/dashboard/connections/chat/[id]`)
- Royalties, Contracts, Settings (all sub-pages)
- Label manager: Roster, Catalog, Revenue, Statements

**If/when any of these move from mock arrays to a real API**, they should get the same treatment as section 6 below — right now there's nothing to skeleton because there's no fetch.

---

## 6. Proposal: where to add skeletons, in priority order

1. **`PrototypePersistGate`** (section 4) — replace the plain text with a lightweight app-shell skeleton (sidebar rail outline + 2-3 generic content blocks). Every dashboard page benefits immediately, zero per-page work.
2. **A shared `<Skeleton />` primitive** — `components/ui/Skeleton.tsx`, a single `<div className="animate-pulse rounded-lg bg-[var(--color-border)]" style={{ height, width }} />`. Replaces the six copy-pasted inline divs in section 2 and gives every future feature (including the eventual Discover/Feedback/Connections real-API migration) one place to import from instead of re-inventing the class string.
3. **Discover grid** ([discover/page.tsx](../app/(dashboard)/dashboard/(producer)/discover/page.tsx)) — currently synchronous mock, but it's the most visually "card grid" page in the app and the most likely candidate for a real paginated API later. Worth designing a card-shaped skeleton (`CoverArt`-sized square + two text lines) now so it's ready when `mockDiscoverTracks` becomes a real fetch.
4. **Connections list** ([connections/page.tsx](../app/(dashboard)/dashboard/(producer)/connections/page.tsx)) — same reasoning: row-shaped skeleton (avatar circle + two lines) matching the existing suggestion/conversation row layout, ready for when suggestions come from a real matching backend instead of `lib/mock/connections.ts`.
5. **Unify the `"—"` placeholders** (dashboard stat cards, performance KPI cards) **with real skeletons** — minor, but having some loading numbers show `"—"` and others show a pulsing block on the same page (dashboard home does both) reads as unfinished.
6. **Public site text fallbacks** (section 3) — lowest priority, since these Suspense boundaries resolve near-instantly in practice. Only worth skeletoning if `searchParams`-driven pages start doing real data fetching.

---

## 7. Out of scope for now

- **Spinners**: there is no spinner/`Loader2` usage anywhere in the app today (button-level pending states, in-flight form submissions, etc. all use disabled-state + label changes instead, e.g. `connections/[id]/page.tsx`'s accept/decline buttons). Not flagged as a gap — the app has no long-running mutations yet (everything is local `useState`), so there's nothing for a spinner to cover.
- **Image lazy-load placeholders** (`next/image` blur-up, avatar fallbacks): out of scope here — covered by `next/image`'s own loading behavior where used, and most avatars in this prototype are just colored initials, not images.

---

## 8. Task map — file by file

Checklist form, grouped by file. Priority order top to bottom; each file's tasks are independent of other files (can be done/committed separately), but within a file do the tasks top to bottom.

### `components/ui/Skeleton.tsx` — **new file, do this first**
- [ ] Create the primitive: `<div className="animate-pulse rounded-lg bg-[var(--color-border)]" />`, accepting `className` (caller sets width/height) and an optional `circle` prop that swaps to `rounded-full`.
- [ ] No other logic/variants. Don't wire it into any page yet — this task is just landing the file.

### `components/dashboard/PrototypePersistGate.tsx` — **highest impact**
- [ ] Replace the current `<p>Loading dashboard…</p>` block with a static app-shell skeleton.
- [ ] Left side: a `Skeleton circle` (logo spot) + 5-6 stacked `Skeleton` bars inside a container sized like the real sidebar (`w-64`/`w-16`), so nothing jumps when the real `AppSidebar` mounts.
- [ ] Right side: one heading-sized `Skeleton` bar + 2-3 block-sized bars — generic, doesn't need to match any specific route.
- [ ] Verify: hard-refresh `/dashboard/feedback`, `/dashboard/royalties`, `/dashboard/connections` — confirm no layout jump when it swaps to real content.

### `components/dashboard/widgets/LatestTracksWidget.tsx`
- [ ] Swap the 5 `<div className="h-10 animate-pulse rounded-lg bg-[var(--color-border)]" />` (line 21) for `<Skeleton className="h-10" />`.

### `components/dashboard/widgets/StreamsWidget.tsx`
- [ ] Swap the `<Suspense>` fallback (line 17, `h-40`) for `<Skeleton className="h-40" />`.

### `components/dashboard/widgets/StreamsByReleaseWidget.tsx`
- [ ] Swap both the `isLoading` fallback (line 17, `h-48`) and the `<Suspense>` fallback (line 19, `h-48`) for `<Skeleton className="h-48" />`.

### `components/dashboard/DashboardContent.tsx`
- [ ] Replace the 3 stat-card `isLoading ? "—" : value` placeholders (lines 374-376) with `<Skeleton className="h-5 w-12" />` so this page doesn't mix "—" text and pulsing blocks in the same screen.

### `app/(dashboard)/dashboard/(producer)/performance/page.tsx`
- [ ] Replace the 4 KPI-card `isLoading ? "—" : value` placeholders (lines 94, 100, 105, 111) with `<Skeleton className="h-5 w-12" />`, same reasoning as `DashboardContent.tsx`.
- [ ] Swap the streams-chart `<Suspense>` fallback (line 123, `h-40`) for `<Skeleton className="h-40" />`.
- [ ] Swap the genre-donut `isLoading` block (line 131, `h-48`) and its `<Suspense>` fallback (line 133, `h-48`) for `<Skeleton className="h-48" />`.
- [ ] Swap the 5 table-row skeletons (line 178, `h-10`) for `<Skeleton className="h-10" />`.

### `components/dashboard/discover/DiscoverCardSkeleton.tsx` — **new file**
- [ ] Create it: a square `Skeleton` matching `CoverArt`'s size, plus two stacked text-line `Skeleton`s below (one title-width, one shorter for producer/genre) — copy the spacing from the real card markup in `discover/page.tsx`'s `.map()`.
- [ ] Don't wire it into `discover/page.tsx` yet — `mockDiscoverTracks` is synchronous, there's nothing to show it during. Leave a one-line comment noting it's ready for when Discover moves to a real fetch.

### `components/dashboard/connections/ConnectionRowSkeleton.tsx` — **new file**
- [ ] Create it: a circle `Skeleton` (avatar) + two stacked text-line `Skeleton`s, matching the row layout shared by the Suggestions and Messages tabs in `connections/page.tsx`.
- [ ] Same as Discover: don't wire it in yet, `mockConnectionSuggestions`/`mockConversations` are synchronous. Leave the same "ready for real API" comment.

### Public site — optional, lowest priority, do last
Only worth doing if these `<Suspense>` boundaries start covering a real wait instead of the near-instant `useSearchParams()` resolution they wrap today. If picked up:
- [ ] `app/(public)/HomeView.tsx:31` — swap `<p>Loading…</p>` for a hero-sized `Skeleton` block.
- [ ] `app/(public)/[artist-name]/page.tsx:13` — swap for a profile-shaped skeleton (circle + lines).
- [ ] `app/(public)/labels/[slug]/page.tsx:13` and `components/public/LabelDetailView.tsx:60` — swap for a heading + list-row skeleton.
- [ ] `app/(public)/login/page.tsx:10` — swap for a form-shaped skeleton.
- [ ] `app/(dashboard)/dashboard/(producer)/platform/page.tsx:16` — swap for a tab-content-shaped skeleton.

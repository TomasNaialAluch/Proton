# Proposal — “Label Manager” Dashboard (record label)

This document proposes a **Label Manager dashboard view** (a person operating a record label) **within the same app** and using the **same dashboard layout** that already exists for the producer dashboard.

- **Goal**: define IA (information architecture), routes, modules, metrics, and permissions to run a label: **catalog, releases, distribution, metadata, campaigns, and royalties**.
- **Does not replace**: the **producer** view that is already documented (see `docs/dashboard-artists.md` and `docs/README-dashboard-vision-roadmap.md`).

> **UI language**: all product copy is **English** (consistent with this repo). This README is a product/design note.

---

## 1) What does a Label Manager do? (practical summary)

In 2026, the role typically owns the end‑to‑end release operation and the digital business:

- **Release management**: plan calendars (singles/EPs/albums), coordinate deliverables (masters, artwork, credits), checkpoints, and DSP go‑live.
- **Distribution & DSP/distributor relationships**: delivery, availability verification, issue fixing, editorial pitching.
- **Metadata & compliance**: ISRC/UPC, credits (writers/publishers/performers), territories, explicit flags, validation and delivery standards (e.g. DDEX).
- **Marketing & campaigns**: coordinate with marketing/artist teams; track performance; weekly reporting.
- **Rights / royalties / payouts**: splits, statements, income reconciliation, run approvals, multi‑currency payments.

References (role context + typical platform feature sets):
- Label Manager job spec (ops + release lifecycle + distribution/DSP + metadata + reporting) — [Music Week Jobs](https://www.musicweek.com/jobs/read/label-manager/03532).
- Platform feature sets for labels — [Revelator — For Labels](https://revelator.com/solutions/for-labels) and [LabelGrid — Catalog Management](https://labelgrid.com/solutions/digital-music-distribution-aggregation/catalog-management/).

---

## 2) Persona, scope, and mental model

### Primary persona: “Label Manager”

Responsible for:
- **Roster** (signed artists / active projects)
- **Catalog** (releases/tracks and their versions)
- **Delivery operations** (metadata, assets, territories, dates)
- **Label finances** (income, recoupment, splits, payouts, statements)

### Key concept: “zoom” (overview → focus → detail)

A label manager often administers **more than one label** (or sub‑labels) and needs to move between levels of information without losing context.

This dashboard proposes a consistent “zoom” model:

- **Level 0 — Multi‑label overview**: what’s happening across *everything* (all labels the user can access).  
  Example: total pipeline, total revenue, global issues, upcoming releases.
- **Level 1 — Label workspace (active label)**: the “default” dashboard after selecting a label.  
  Everything you see is **scoped** to that label/sub‑label.
- **Level 2 — Artist focus**: filter/enter a specific artist and see their performance/pipeline/statements within the active label.
- **Level 3 — Release focus**: operational release detail (checklist, delivery, territories, assets, metadata QA).
- **Level 4 — Track focus**: per‑track metadata/credits/splits/ISRC.

**UI implications**:
- A **Label switcher** must exist in a global location (dashboard navbar or sidebar).
- An **Artist filter** must be easy to reach (at least on Catalog/Releases/Revenue/Statements) to move from “whole label” to “one artist”.

### What this view is NOT (for now)

- It’s not the “producer‑only” view (already exists).
- It does not assume a full legal/accounting back office (we model only what a prototype needs).
- It does not include real DSP/distributor integrations yet; the prototype uses mocks.

---

## 3) Design principle: one shell, role‑based navigation

Today the dashboard assumes **producer view**. To support label manager:

- **Single layout** (`app/(dashboard)/layout.tsx`) and shared components.
- **Role‑conditioned navigation** (feature flag / mock): different primary tabs and secondary sidebar.
- **Base URL** stays `/dashboard/...` to avoid duplicating layouts; the difference is **context** (producer vs label).

> Future alternative: `/label/...` or `/dashboard/label/...`. For a prototype, keeping `/dashboard` and switching the menu by role is usually simpler.

---

## 4) Proposed IA (primary tabs)

The label manager view replaces/extends today’s tabs because the focus is no longer “my career” but “my label”.

> **Global scope**: all views must follow the “zoom” model. By default they show the **active label workspace** (Level 1) and allow zoom into artist/release/track. In parallel, the product should offer an “All labels” view (Level 0) via the switcher.

### Tabs (top/bottom nav on mobile)

1) **Roster** — `/dashboard/roster`  
- Label artist list, status (active/inactive), upcoming releases, health indicators.

2) **Catalog** — `/dashboard/catalog`  
- Releases + tracks, advanced search, filters by artist/label/sub‑label, delivery status.

3) **Releases** — `/dashboard/releases`  
- Pipeline (draft → QA → scheduled → delivered → live), deliverables checklist, dates and territories.

4) **Revenue** — `/dashboard/revenue`  
- Income trends by DSP/territory/release, reconciliation, “missing reports” alerts.

5) **Statements** — `/dashboard/statements`  
- Royalty runs, approvals, export, balances by artist, batch payouts.

> Keep “Settings” out of the bottom nav (common pattern): reachable via sidebar/account menu.

### Mapping to current tabs

- Producer **Performance** maps conceptually to label **Revenue**.
- Producer **Royalties** maps to label **Statements**, but adds approvals/payouts.
- Producer **Artists** becomes label **Roster**.
- **Contracts** could live as a sub‑section under Roster or Catalog (depending on scope).

---

## 5) Secondary sidebar (role‑based quick actions)

The current sidebar has “Producer tools / Platform / Public site”. For label manager:

### Section A — Label tools
- **New Release** (wizard)
- **Bulk import** (CSV / DDEX placeholder)
- **Metadata QA queue** (pending errors)
- **Pitching checklist** (Spotify/Apple prep)

### Section B — Platform
Keep `/dashboard/platform` hub, but content is label‑oriented:
- Distribution partners (placeholder)
- Assets / Brand kit
- Team & permissions

### Section C — Public site
Keep public links: radio/shows/charts/labels (exits the dashboard).

---

## 6) Page modules (what should exist)

### 6.1 Roster (`/dashboard/roster`)

**Top KPIs**
- Active artists
- Releases in pipeline (next 30/60 days)
- Revenue MTD / QTD (mock)
- Issues requiring attention (QA, missing assets)

**Artists table**
- Artist, country, A&R contact (mock), next release date, last 30d streams, status.

**Quick actions**
- “Create release” pre‑selecting the artist
- “View artist portal” (future)

**Zoom**
- From any row: enter **Artist focus** (Level 2) via an overview page + optional sub‑tabs, or by applying filters across Catalog/Releases/Revenue/Statements.
- Quick toggle: “Only this artist” so all tabs respect that focus until cleared.

---

### 6.2 Catalog (`/dashboard/catalog`)

**Search & filters**
- Artist (selector), label/sub‑label, status (draft/live), territory, genre, explicit, date range.

**Release list view**
- Artwork thumbnail, title, primary artist, UPC, release date, status, last delivery, issues.

**Detail (drawer/modal)**
- Tracklist with ISRCs, contributors, splits summary, assets checklist, territory matrix.

**Zoom**
- Selecting a release opens Level 3 (Release focus) in a drawer/page.
- From release: navigate to Level 4 (Track focus) for per‑track metadata/credits/splits.

---

### 6.3 Releases (`/dashboard/releases`)

**Pipeline (kanban or status list)**
- Draft → QA → Scheduled → Delivered → Live

**Artist filter (always visible)**
- Dropdown/combobox “All artists” → pick one artist to view only that artist’s pipeline and checklist.

**Release checklist**
- Masters
- Artwork (resolution/ratio)
- Metadata (titles, versioning, featured artists)
- Credits (writers/publishers/performers)
- Rights (P‑Line/C‑Line)
- Territories / dates

**Calendar**
- Weekly/monthly view with optional waterfall strategy.

---

### 6.4 Revenue (`/dashboard/revenue`)

**Charts**
- Streams & revenue over time
- Top DSPs
- Top territories

**Drilldowns**
- By release / by artist / by DSP / by territory.

**Zoom**
- “All artists” selector + search to move from whole‑label to one artist (Level 2).
- Click a point/table row to open a release breakdown (Level 3) and then track breakdown (Level 4) where relevant.

**Alerts**
- “Report missing” (expected period has no data)
- “Spike” (sudden growth via playlists)

---

### 6.5 Statements (`/dashboard/statements`)

**Royalty run**
- Period selection
- Split rules (mock)
- Preview: “who gets paid what”
- Approve run → generate statements (PDF/CSV placeholder)

**Balances & payouts**
- Balances per artist
- Payment status (pending/paid/withheld)
- Batch payout (placeholder: “export payment file”)

**Artist filter**
- For large runs, the label manager must be able to see:
  - “All artists” (whole‑label overview)
  - One artist (zoom) to validate consistency, recoupment, and edge cases

---

## 7) Data and types (suggested mocks)

The repo already uses mocks under `/lib/mock/`. For label manager we should add:

- `Label` / `SubLabel`
- `RosterArtist` (artist + label relationship)
- Extended `Release` (UPC, territory rules, delivery status, checkpoints)
- Extended `Track` (ISRC, versioning, contributors)
- `Contributor` (roles + percentages, validate totals = 100%)
- `RevenueReport` (DSP, territory, currency)
- `RoyaltyRun` / `Statement` / `Payout`

And a session/mock **role** property:
- `accountType: "producer" | "label_manager" | ...`

---

## 8) Permissions (MVP)

Even for a prototype, basic permissions help:

- **Admin (label owner)**: everything.
- **Ops (label manager)**: releases, catalog, revenue, statements.
- **A&R/Marketing**: roster + releases (no statements/payouts).
- **Read‑only**: analytics, catalog.

---

## 9) Compatibility with current UI (impact)

### Expected component changes

- `components/dashboard/BottomNav.tsx`: label‑role tabs (Roster/Catalog/Releases/Revenue/Statements).
- `components/dashboard/AppSidebar.tsx`: new “Label tools” section.
- New routes under `app/(dashboard)/dashboard/...` (or equivalent, depending on the current tree).

### Mobile considerations

Label manager workflows are denser (tables + filters). Recommendations:
- use **drawers** for filters on mobile,
- keep **primary actions** as contextual buttons/FAB,
- and list views with “summary first” + drilldown.

---

## 10) Roadmap (prototype)

- **Phase 1 (IA + shell)**: mock role + role‑conditioned nav + scaffold pages.
- **Phase 2 (Catalog + Releases)**: mocks, pipeline states, QA checklist.
- **Phase 3 (Revenue + Statements)**: charts + tables + mock “royalty run”.
- **Phase 4 (Team & permissions)**: members & permissions UI (no backend).

---

## 11) Component roadmap (small → large) — YAGNI / KISS / DRY

This is an implementation roadmap organized from the smallest building blocks to the largest composites, aimed at keeping the codebase **refactor‑friendly**, **minimal**, and **consistent**.

### Status tracker (what’s implemented)

- [x] **Prototype view switcher** (producer ↔ label manager) persisted locally.
- [x] **Role-based mobile tabs (BottomNav)**: label tabs route to scaffold pages.
- [x] **Scaffold pages**: `/dashboard/roster`, `/dashboard/catalog`, `/dashboard/revenue`, `/dashboard/statements`.
- [x] **Label switcher** (multi-label scope) UI + state (All labels ↔ active label).
- [x] **Artist filter** UI + scope propagation across pages (Catalog/Releases/Revenue/Statements).
- [x] **Shared primitives (MVP)**: scope chips + `StatusBadge` / `IssueBadge` scaffolding.
- [x] **Roster MVP**: KPIs + artists table + click-to-zoom (sets Artist focus).
- [x] **Catalog MVP**: scoped release list + details drawer (Release focus, Level 3).
- [x] **Releases MVP**: pipeline grouped by status + issues + drawer (Release focus).
- [x] **Revenue MVP**: scoped charts (trend + DSP/territory breakdown).
- [x] **Statements MVP**: period selector + preview + balances (scoped by artist focus).
- [ ] **Table shell** (only if a second page needs the same table behaviors).

### Principles (how we avoid over‑engineering)

- **YAGNI**: build only what’s needed for the next screen(s) and reuse patterns already present in the repo.
- **KISS**: prefer simple props + composition over abstract “framework” components.
- **DRY (pragmatic)**: dedupe *real* repetition (same behavior in 3+ places). Avoid premature generic layers.

### 11.1 Foundation (types, constants, and route model)

1) **Types / domain models** (smallest “shared truth”)
- `Label`, `SubLabel`, `RosterArtist`, `Release`, `Track`, `Contributor`, `RevenueReport`, `Statement`, `Payout`
- Keep producer models untouched; add label‑specific types alongside them.

2) **Enums + status maps**
- `ReleaseStatus` (draft/qa/scheduled/delivered/live)
- `PaymentStatus` (pending/paid/withheld)
- `IssueType` (missing_assets/metadata_error/missing_report/…)

3) **Routing + tab definitions (data, not UI)**
- One source of truth for label manager tabs: label + href + icon key.
- One source of truth for “zoom scope”: `scope = allLabels | label | artist | release | track` (MVP can be `label | artist`).

### 11.2 Shared UI primitives (atomic components)

These should be generic and reusable across all label pages:

4) **Select/Combobox** (for Label switcher + Artist filter)
- Keyboard‑friendly; supports “All …” option; async later if needed.

5) **Filter chips**
- Displays active filters (Artist, Status, Territory, Date range) and supports clear/remove.

6) **Badges**
- Status badge (release/payment)
- Issue badge (severity: info/warn/blocker)

7) **Empty / loading states**
- Skeleton blocks for tables and KPI cards (use existing design tokens).

### 11.3 Shared hooks / state (small logic units)

8) **Scope state**
- `useLabelScope()` with:
  - `activeLabelId`
  - `activeArtistId?`
  - helpers: `setLabel()`, `setArtist()`, `clearArtist()`
- Start with URL query params (e.g. `?label=…&artist=…`) or a small Zustand store (pick one; keep it simple).

9) **Filtering helpers**
- Pure functions: `applyArtistFilter`, `applyStatusFilter`, `applyDateRange`, etc.
- Keep business rules as pure utilities (easy to test).

### 11.4 Reusable building blocks (molecules)

10) **KPI card**
- Title, value, delta, optional sparkline slot.

11) **Table shell**
- Column config + row renderer + basic sorting.
- Don’t build a full data‑grid framework yet; only what the pages need.

12) **Drawer / modal shell**
- Reusable “details drawer” used by Catalog and Releases (Level 3+ zoom).

### 11.5 Page modules (organisms)

13) **Label switcher component**
- Lives in dashboard navbar (global) or sidebar.
- Supports “All labels” (Level 0) and “Active label” (Level 1).

14) **Artist filter bar**
- Visible on Catalog/Releases/Revenue/Statements.
- Writes to scope state (so other pages can inherit the focus).

15) **Release pipeline module**
- Kanban/list rendering of releases by status + quick actions.

16) **Catalog list + details drawer**
- List of releases, click → open drawer with tracklist and issues.

17) **Revenue charts module**
- 2–3 charts max for MVP, plus drilldown table.

18) **Statements run module**
- Period selector, preview table, “approve” action (mock).

### 11.6 Pages (largest UI units)

19) **Roster page** (`/dashboard/roster`)
- KPIs + artists table + entry point to Artist focus.

20) **Catalog page** (`/dashboard/catalog`)
- Search/filters + list + details drawer.

21) **Releases page** (`/dashboard/releases`)
- Pipeline + checklist + calendar (calendar can be Phase 2+ if needed).

22) **Revenue page** (`/dashboard/revenue`)
- Charts + drilldowns + alerts list.

23) **Statements page** (`/dashboard/statements`)
- Royalty run + balances + payout placeholder.

### 11.7 Role‑based navigation wiring (integration)

24) **Role‑based primary tabs**
- Extend `BottomNav` to read `accountType` and render producer vs label tabs.

25) **Role‑based sidebar sections**
- Add “Label tools” section; reuse patterns from producer sidebar.

### 11.8 “Stop points” (where we deliberately stop to keep YAGNI)

- **No multi‑tenant permission system** beyond simple role gates (Phase 4).
- **No DDEX import/export** beyond a placeholder (Phase 2+).
- **No full‑blown data grid**; only add features when a second page needs them.


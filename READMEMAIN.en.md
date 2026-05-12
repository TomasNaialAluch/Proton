# Proton Radio — Work log and implementation guide

---

## ✅ Dashboard (B2B) — What was built in this session

Everything below was implemented under `/dashboard`. The project runs on Next.js 15, TypeScript, Tailwind CSS v4, and TanStack Query.

**Product vision / roadmap (sidebar Producer tools + Platform, auth):** [`docs/README-dashboard-vision-roadmap.md`](docs/README-dashboard-vision-roadmap.md).

---

### 1. Contracts page — `/dashboard/contracts`

**File:** `app/(dashboard)/dashboard/contracts/page.tsx`  
**Mock data:** `lib/mock/contracts.ts`  
**Types:** `types/contract.ts`

Full artist contracts page with:

- **3 summary cards:** Total contracts · Signed · Unique labels
- **Pending contracts alert** (amber banner, conditional)
- **Contracts list** with dual layout:
  - Mobile: compact layout with a per-label color icon, release name, label, and date
  - Desktop: table with columns Date · Release · Label · Status · Contract (PDF link)
- **Per-label breakdown** at the bottom: label name, release count, unique colors per label
- **Per-label colors** defined in `CONTRACT_LABEL_COLORS`: `outer-space-oasis` → violet `#A78BFA`, `toxic-astronaut` → green `#34D399`
- **Contract statuses:** `signed` (green), `pending` (amber), `expired` (red) — with Lucide icons

**Current mock releases:**

| Release | Label | Status |
|---|---|---|
| Tied Inside | Outer Space Oasis | Signed |
| Mind Altered | Outer Space Oasis | Signed |
| Balance | Outer Space Oasis | Signed |
| Beyond Living | Toxic Astronaut | Signed |

---

### 2. Royalties page — `/dashboard/royalties`

**File:** `app/(dashboard)/dashboard/royalties/page.tsx`  
**Mock data:** `lib/mock/royalties.ts`

Main royalties page with:

- **Total accumulated card** with a progress bar to the payout threshold (`$50 USD`)
- **Next statement card** (date + period)
- **Payment method card** (USDC on Base via Coinbase Commerce)
- **Statements history** — quarterly list with:
  - Period (e.g. “Q1 2026”), date range, amount, status (withheld/paid)
  - CSV button → direct link to `soundsystem.protonradio.com` with real `id` and `qid`
  - Arrow to go to each statement’s detail

---

### 3. Statement detail — `/dashboard/royalties/[qid]`

**File:** `app/(dashboard)/dashboard/royalties/[qid]/page.tsx`

Quarter detail page with 4 tables:

1. **Release Summary** — releases in the period, sales and streams (this quarter vs accumulated)
2. **Track Sales & Streams** — per track: sold, streams, store, royalty %, amount
3. **Stores & Services** — breakdown by platform (Spotify, Beatport, etc.)
4. **Advance & Expense Debits** — mastering/design/etc. debits in amber (with an explanatory note)

- Header with CSV download button pointing to a real Proton SoundSystem URL
- Empty state with download button when there’s no detail available
- Breadcrumb: Dashboard → Royalties → Period
- `PRO_USER_ID = 67325` hard-coded for the download links

---

### 4. Performance page — `/dashboard/performance`

**File:** `app/(dashboard)/dashboard/performance/page.tsx`

Most complex dashboard page. Uses **TanStack Query** to fetch real tracks from the Proton API:

- **4 KPI cards:** Total Streams · Total Sales · Tracks · Top Track
- **Streams chart** (`StreamsChart` using Recharts) — filterable by range: 30D / 3M / 6M / 1Y / All
- **Genre donut** (`GenreDonut` using Recharts) — streams distribution by genre
- **Tracks table** with:
  - Category filters: Tracks · Releases · Labels · Genres
  - Live search (filters by title or label)
  - Sort by Streams / Sales / Date (toggle asc/desc)
  - Skeleton loading state while the API is loading
- Mock data in `lib/mock/performance.ts` (streams and sales keyed by `trackId`)
- Genres in `TRACK_GENRES` — `trackId → genre` dictionary

---

### 5. Notifications panel — `NotificationsPanel`

**File:** `components/dashboard/NotificationsPanel.tsx`

Right-side drawer (`translate-x-full` → `translate-x-0`):

- Backdrop with blur closes the panel on click
- Closes on `Escape`
- 5 mock notifications: new release approved, royalties available, streams spike, pending contract, release rejected
- Orange unread dots
- Unread counter badge in the header
- “Clear all” button in the footer
- Empty state with `CheckCheck` icon when all notifications are cleared

Connected from **DashboardNavbar** (mobile) and **AppSidebar** (desktop).

---

### 6. Collapsible sidebar — `AppSidebar`

**File:** `components/dashboard/AppSidebar.tsx`

Desktop sidebar (`lg:flex`) with:

- **Collapse toggle** persisted in `localStorage` (`proton-sidebar-collapsed`). Expanded: 256px, collapsed: 64px, 300ms CSS transition
- **Collapsed width:** icons only, centered, with `title` tooltip
- **Logo** (image `logo txt.png`) visible only when expanded
- **Notifications bell** (opens `NotificationsPanel`) with orange badge
- **Nav links:** Artists · Performance · Royalties · Contracts · Settings — orange highlight for active route
- **Producer tools:** Release Links (dashboard route)
- **Platform:** Shows · Labels · DJ Mixes → hub `/dashboard/platform`. **Public site:** Radio · Shows · Charts · Labels (public routes; exits the dashboard). **Performance** remains under Dashboard nav.
- **Footer:** artist avatar + link to settings/profile + collapse/expand button

---

### 7. Mobile navbar — `DashboardNavbar`

**File:** `components/dashboard/DashboardNavbar.tsx`

Sticky mobile-only navbar (`lg:hidden`) with:

- Hamburger button (left) → opens `HamburgerMenu`
- Center “Proton” logo
- Bell button (right) → opens `NotificationsPanel` (with orange badge)

---

### 8. Dashboard store — Zustand

**File:** `lib/store/dashboardStore.ts`

Zustand store with `persist` middleware for the dashboard widget layout:

```typescript
interface DashboardState {
  widgetOrder: WidgetId[];      // draggable widget order
  hiddenWidgets: WidgetId[];    // widgets hidden by the user
  setWidgetOrder, hideWidget, showWidget, resetLayout
}
```

Widgets: `streams` · `latest-tracks` · `streams-by-release` · `royalties`  
Persisted in `localStorage` under the key `proton-dashboard-layout`.

---

### Summary of created/modified files in this session

| File | Status | What it does |
|---|---|---|
| `app/(dashboard)/dashboard/contracts/page.tsx` | ✅ New | Full contracts page |
| `app/(dashboard)/dashboard/royalties/page.tsx` | ✅ Improved | History + progress bar + payout config |
| `app/(dashboard)/dashboard/royalties/[qid]/page.tsx` | ✅ New | Statement detail with 4 tables |
| `app/(dashboard)/dashboard/performance/page.tsx` | ✅ Improved | KPIs + charts + tracks table w/ search/sort |
| `components/dashboard/NotificationsPanel.tsx` | ✅ New | Notifications drawer |
| `components/dashboard/DashboardNavbar.tsx` | ✅ Updated | Wires bell → NotificationsPanel |
| `components/dashboard/AppSidebar.tsx` | ✅ Updated | Collapsible sidebar + bell + notifications |
| `components/dashboard/DashboardContent.tsx` | ✅ Updated | Main dashboard layout |
| `components/dashboard/BottomNav.tsx` | ✅ Updated | Mobile bottom nav |
| `lib/mock/contracts.ts` | ✅ New | 4 mock contracts w/ per-label colors |
| `lib/mock/royalties.ts` | ✅ Updated | Quarterly statements + payout config |
| `lib/store/dashboardStore.ts` | ✅ New | Zustand store for widget layout |
| `types/contract.ts` | ✅ Updated | Contract types |
| `types/royalty.ts` | ✅ Updated | Royalty and Statement types |

---

## 🗺️ Public Area Guide — next steps (B2C)

> Implementation guide for the public area (`(public)`) — the B2C side of the platform.
> The dashboard (`(dashboard)`) already has its base built. This document is the roadmap to build what would be **protonradio.com**: live radio, shows, charts, labels, and artist profiles.

**Note:** a more detailed public-area implementation roadmap also lives in `READMEPUBLIC.en.md` (translated from `READMEPUBLIC.md`).


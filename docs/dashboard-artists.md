# Dashboard — Redesign Spec

Redesign of the SoundSystem dashboard: [`soundsystem.protonradio.com`](https://soundsystem.protonradio.com/)

> **Language:** All UI copy is in **English** — Proton is an international platform.
> **Mock data:** Defined in `/lib/mock/` — see `artist.ts`, `tracks.ts`, `royalties.ts`.

This is the first screen an artist sees after logging in. It consolidates identity, navigation, and account data in one place.

---

## Entry Points to the Dashboard

```
Public Navbar  →  "For Artists" button  →  /login  →  /dashboard
Direct URL     →  soundsystem.protonradio.com    →  /login  →  /dashboard
Artist profile →  [Edit Profile] button           →  /login  →  /dashboard
                  (only visible when logged in)
```

---

## Legacy Design — Issues

| Area | Problem |
|---|---|
| Top bar | Flat color tiles with no hierarchy — everything screams at once |
| Layout | Two rigid columns, no breathing room. Sidebar competes with main content |
| Artist card | Small square photo, no visual identity. Artist name has no prominence |
| Stats | Grey buttons with no visual weight — look disabled |
| Account sidebar | Three dense text blocks with no visual separation |
| Typography | No hierarchy — everything at the same weight and size |
| Background | Black leather texture — dated, doesn't communicate music tech |

### What works (keep)
- The **4-tab structure** (Artists / Performance / Royalties / Contracts) — intuitive
- Quick access shortcuts at the top (Shows, Labels, DJ Mixes, Account)
- Right sidebar with account data — useful concept, needs better execution

---

## Global Layout — Redesign

**Legacy:** Horizontal tile bar at the top + two-column layout below.

**Redesign:** Fixed left vertical sidebar + main content area.

```
┌──────────┬────────────────────────────────┐
│          │                                │
│ Sidebar  │   Main content                 │
│  (nav)   │   (changes per tab)            │
│          │                                │
│          │                                │
└──────────┴────────────────────────────────┘
```

### Sidebar navigation

Items use Lucide icons + label. Legacy colors repurposed as dot indicators only.

| Item | Lucide Icon | Dot color |
|---|---|---|
| Shows | `Radio` | `#E67E22` |
| Labels | `Tag` | `#1ABC9C` |
| DJ Mixes | `Disc3` | `#9B59B6` |
| Account | `DollarSign` | `#27AE60` |
| Release Links | `Link` | — |

- Active item: text `#FFFFFF` + left border `2px #00FF9D`
- Inactive item: text `#94A3B8`

---

## Tab Navigation (shared across all tabs)

| Tab | Route | Lucide Icon |
|---|---|---|
| Artists | `/dashboard` | `User` |
| Performance | `/dashboard/performance` | `TrendingUp` |
| Royalties | `/dashboard/royalties` | `DollarSign` |
| Contracts | `/dashboard/contracts` | `FileText` |

- Active tab: white text + `2px` bottom border `#00FF9D`
- Inactive tab: text `#94A3B8`
- No tab background fill — underline only

---

## Tab 1 — Artists (`/dashboard`)

### Artist Card

```
┌─────────────────────────────────────────────┐
│                                             │
│   ◉  [Circular photo — #00FF9D glow border] │
│                                             │
│   Artist Name         ← Plus Jakarta Sans   │
│                          Bold Italic / 32px  │
│   City, Country          ← text-secondary   │
│                                             │
│   ┌────────┐  ┌────────┐  ┌────────┐        │
│   │   N    │  │   N    │  │   N    │        │
│   │Members │  │ Mixes  │  │ Tracks │        │
│   └────────┘  └────────┘  └────────┘        │
│                                             │
│   [Edit Profile]      [More ▾]              │
│                                             │
└─────────────────────────────────────────────┘
```

- Background: `#181C25` + `border: 1px solid rgba(255,255,255,0.05)`
- Photo: circular, gradient border `#00FF9D` → transparent
- Stat number: `Inter / Medium / 24px / #FFFFFF`
- Stat label: `Inter / Regular / 12px / #94A3B8`
- `Edit Profile` button: background `#00FF9D`, text `#0B0E14`
- `More` button: ghost, `border: 1px solid rgba(255,255,255,0.1)`

### Members Table

- No heavy borders
- Row separator: `border-bottom: 1px solid rgba(255,255,255,0.05)`
- Column header: `Inter / 12px / UPPERCASE / #94A3B8`
- Cell text: `Inter / 14px / #FFFFFF`
- Email: `Inter / 14px / #00FF9D` (clickable)

| Column | Notes |
|---|---|
| Name | Full name of the artist/member |
| Pro Email | Email used for contracts and statements |

### Contextual Prompt (above the artist card)

**Legacy:** Small italic text — *"These are your artist profiles. Are your bios and photos up-to-date?"*

**Redesign:** Remove it. The `Edit Profile` button on the card already communicates the same call to action without the extra line.

---

### Account Sidebar

Three stacked cards, each with `background: #181C25`:

```
┌──────────────────────┐
│ LOGIN DETAILS        │  ← 12px / uppercase / #94A3B8
│                      │
│ Username             │  ← label 12px #94A3B8
│ ___________          │  ← value 14px #FFF
│                      │
│ Email                │
│ ___________          │
│                      │
│ Update login  →      │  ← Lucide ArrowRight
└──────────────────────┘

┌──────────────────────┐
│ CONTACT DETAILS      │
│                      │
│ Name / Country / City│
│                      │
│ Update contact  →    │
└──────────────────────┘

┌──────────────────────┐
│ PAYMENT DETAILS      │
│                      │
│ Method               │
│ ___________          │
│                      │
│ Token                │
│ ___________          │  ← accent #00FF9D
│                      │
│ Update payment  →    │
└──────────────────────┘
```

---

## Support Chat Widget (Global)

The current platform includes a floating **Intercom-style support widget** visible across all dashboard tabs. It appears as a bottom-right launcher button that opens a full chat panel.

### What the legacy widget has

```
┌─────────────────────────────┐
│ [avatars]               [X] │
│                             │
│ Hi [username] 🤚            │
│ How can we help?            │
│                             │
│ Send us a message    →      │
│ We'll be back online Monday │
│                             │
│ 🔍 Search for help          │
│                             │
│ · Instant Access to Spotify │
│   for Artists               │
│ · Proton SoundSystem FAQ    │
│ · When are statements and   │
│   payments sent?            │
│ · Release Links by Proton   │
│                             │
│ [Home]  [Messages]  [Help]  │
└─────────────────────────────┘
```

### Redesign decision

Keep the support widget — it's useful. Style it to match the design system:

- Background: `#181C25`
- Border: `1px solid rgba(255,255,255,0.08)`
- Header accent: `#00FF9D` instead of orange
- FAQ links: `#94A3B8` with `#FFFFFF` on hover
- Bottom nav active state: `#00FF9D` icon tint
- Launcher button: circular, `background: #00FF9D`, `color: #0B0E14`

> The greeting uses the artist's username dynamically — it is not hardcoded.

---

## Tab 2 — Performance (`/dashboard/performance`)

### Legacy structure
- Bold date range text at top: `[From date] to [To date]`
- Horizontal filter row: Labels / Artists / **Tracks** / Releases / Countries / Genres / Stores
- Search bar
- Sortable data table: `#` · `Title / Artist` · `Sales` · `Streams` · `Release` · `Label` · `Date`
- Right sidebar: calendar widget, date range inputs, filter checkboxes, "Get Report" CTA

### Redesign

```
┌──────────────────────────────────────────────────┐
│  Jan 1, 2026 → Apr 3, 2026      [Change Range ▾] │
└──────────────────────────────────────────────────┘

┌──────────┐   ┌──────────┐   ┌──────────┐
│  Total   │   │  Total   │   │  Total   │
│ Streams  │   │  Sales   │   │  Tracks  │
└──────────┘   └──────────┘   └──────────┘

[ Labels ][ Artists ][ Tracks ● ][ Releases ][ Countries ][ Genres ][ Stores ]

🔍 Search...

 #   Title / Artist     Sales   Streams   Release   Label    Date
────────────────────────────────────────────────────────────────────
 1   Track name          N        N        Release   Label   YYYY-MM-DD
 2   Track name          —        N        Release   Label   YYYY-MM-DD
 ...
```

### Redesign decisions
- **3 summary stat cards** at the top — instant read without scrolling the table
- Active filter tab: `#00FF9D` bottom border, `#FFFFFF` text
- Table sorted by Streams descending by default
- `Sales: 0` shown as `—` — cleaner than a zero
- Label catalog code shown as a subtle badge next to the label name
- Date range: compact dropdown — replaces the oversized calendar widget
- Filters (All Artists / All Stores / All Countries) move into a collapsible right drawer

---

## Tab 3 — Royalties (`/dashboard/royalties`)

### Legacy structure
- Header: "Your Q[N] statement comes: by [Date]"
- Table: `Quarter (Date)` · `Amount` · `Status` · `[View Statement]` · `[Download CSV]`
- All entries show status **WITHHELD** (payout threshold not reached)
- Per-page selector: 10 / 25 / 50 / 100
- Footer rules (small text): statements and payments trigger at $100+, quarters are 3-month periods
- Right sidebar: same account sidebar + payment method filled in

### Redesign

```
┌────────────────────────────────────────────────────┐
│  TOTAL ACCUMULATED         NEXT STATEMENT           │
│  $XX.XX                    [Month DD, YYYY] (QN)    │
│                                                     │
│  ████████░░░░░░░░░░░░░░░   $XX.XX / $100.00        │
│  Progress to payout        XX% — $XX.XX remaining   │
└────────────────────────────────────────────────────┘

ℹ️  Statements and payments are issued when your balance reaches $100.
    Quarters run every 3 months (Jan–Mar / Apr–Jun / Jul–Sep / Oct–Dec).

 Quarter          Amount    Status         Actions
─────────────────────────────────────────────────────
 YYYY QN  Mon–Mon   $X.XX   ○ Withheld    ↓  ↗
 YYYY QN  Mon–Mon   $X.XX   ○ Withheld    ↓  ↗
 YYYY QN  Mon–Mon   $X.XX   ✓ Paid        ↓  ↗
 ...
```

### Redesign decisions
- **Progress bar** toward $100 payout threshold — the most important UX addition. Artists can see at a glance how close they are to getting paid
- Business rules surfaced in an info card, not buried in footnote text
- `Withheld` badge: grey/neutral pill — green would imply success
- `Paid` badge: green pill with checkmark
- Actions: icon-only (`Download` + `ExternalLink` Lucide icons) — reduces visual noise per row
- Payment method shown inline at the bottom: `Paid via [Method] · [Token]`

---

## Tab 4 — Contracts (`/dashboard/contracts`)

### Legacy structure

**Header:** "Here are all your contracts. Have you signed them all?" — subtle prompt that implies unsigned contracts may exist. Search bar on the right.

**Data table columns:** `Date` · `Release` · `Label` · `Status` · `[View Contract]`

**Pagination:** Showing N to N of N entries. Per-page selector: 10 / 25 / 50 / 100.

**Right sidebar:** Same account sidebar as all other tabs.

**Key observations from the legacy screen:**
- `SIGNED` status shown in bright green — unlike Royalties, green makes sense here (signed = good)
- One contract per release — each release has its own contract
- No visible "pending" contracts in the current data, but the header copy ("Have you signed them all?") implies the system supports unsigned states
- `[View Contract]` is a green pill button — heavy, takes up too much row space

### Contract structure

Each contract maps to one release:

| Field | Notes |
|---|---|
| Date | Contract signing date |
| Release | Name of the EP or track |
| Label | Label that issued the contract |
| Status | `signed` / `pending` / `expired` |

### Redesign

```
 Here are all your contracts.

 Date         Release         Label            Status       Action
────────────────────────────────────────────────────────────────────
 YYYY-MM-DD   Release name    Label name       ✓ Signed     ↗ View
 YYYY-MM-DD   Release name    Label name       ✓ Signed     ↗ View
 YYYY-MM-DD   Release name    Label name       ⏳ Pending   ↗ View
 YYYY-MM-DD   Release name    Label name       ✓ Signed     ↗ View
```

### Redesign decisions
- **Header copy simplified:** "Here are all your contracts." — remove "Have you signed them all?" and replace with a visible **badge counter** if any contracts are pending (e.g. `1 pending` badge on the tab label)
- `Signed` badge: green pill with checkmark — same as Royalties `Paid`
- `Pending` badge: amber/orange pill — draws attention without being alarming
- `Expired` badge: red pill
- Action: icon-only `ExternalLink` (Lucide) — replaces the heavy green `[View Contract]` button
- Table sorted by Date descending — most recent contract first

### Tab badge (pending contracts indicator)

If there are pending contracts, the **Contracts** tab shows a count badge:

```
[ Artists ][ Performance ][ Royalties ][ Contracts  2 ]
                                                  ↑
                                          amber badge
```

This replaces the ambiguous header prompt in the legacy design.

---

## Components to Build

### Shared
| Component | File | Status |
|---|---|---|
| `Sidebar` | `components/dashboard/Sidebar.tsx` | ⬜ Pending |
| `DashboardTabs` | `components/dashboard/DashboardTabs.tsx` | ⬜ Pending |
| `SupportWidget` | `components/dashboard/SupportWidget.tsx` | ⬜ Pending |

### Tab 1 — Artists
| Component | File | Status |
|---|---|---|
| `ArtistCard` | `components/dashboard/ArtistCard.tsx` | ⬜ Pending |
| `StatBadge` | `components/dashboard/StatBadge.tsx` | ⬜ Pending |
| `MembersTable` | `components/dashboard/MembersTable.tsx` | ⬜ Pending |
| `AccountSidebar` | `components/dashboard/AccountSidebar.tsx` | ⬜ Pending |

### Tab 2 — Performance
| Component | File | Status |
|---|---|---|
| `SummaryCards` | `components/dashboard/SummaryCards.tsx` | ⬜ Pending |
| `FilterTabs` | `components/dashboard/FilterTabs.tsx` | ⬜ Pending |
| `DateRangePicker` | `components/dashboard/DateRangePicker.tsx` | ⬜ Pending |
| `TracksTable` | `components/dashboard/TracksTable.tsx` | ⬜ Pending |
| `FiltersDrawer` | `components/dashboard/FiltersDrawer.tsx` | ⬜ Pending |

### Tab 3 — Royalties
| Component | File | Status |
|---|---|---|
| `RoyaltySummary` | `components/dashboard/RoyaltySummary.tsx` | ⬜ Pending |
| `PayoutProgress` | `components/dashboard/PayoutProgress.tsx` | ⬜ Pending |
| `RoyaltiesTable` | `components/dashboard/RoyaltiesTable.tsx` | ⬜ Pending |

### Tab 4 — Contracts
| Component | File | Status |
|---|---|---|
| `ContractsTable` | `components/dashboard/ContractsTable.tsx` | ⬜ Pending |
| `StatusBadge` | `components/ui/StatusBadge.tsx` | ⬜ Pending |

---

## Redesign Decisions

> **Vertical sidebar instead of horizontal tiles**
> Legacy tiles all compete at the same visual weight. A vertical sidebar is the standard in modern dashboards (Vercel, Linear, Spotify for Artists) and scales naturally as sections are added.

> **Circular photo with glow border**
> A square thumbnail doesn't communicate artistic identity. A large circular avatar with a `#00FF9D` gradient border makes the artist the visual focal point of their own panel.

> **Individual cards for account sections**
> Three dense text blocks (Login / Contact / Payment) with no separation are hard to scan. Breaking them into surface cards creates hierarchy and breathing room.

> **Summary stat cards on Performance**
> Without them, the artist must read the whole table to understand their numbers. Three cards (Streams / Sales / Tracks) give an instant read before diving into the data.

> **Progress bar on Royalties**
> The payout threshold ($100) is the most important number on this page. Showing it as a progress bar makes the information immediately actionable — no mental math required.

---

## Status

| Task | Status |
|---|---|
| Tab 1 (Artists) — legacy analysis | ✅ Done |
| Tab 1 (Artists) — redesign defined | ✅ Done |
| Tab 2 (Performance) — legacy analysis | ✅ Done |
| Tab 2 (Performance) — redesign defined | ✅ Done |
| Tab 3 (Royalties) — legacy analysis | ✅ Done |
| Tab 3 (Royalties) — redesign defined | ✅ Done |
| Tab 4 (Contracts) — legacy analysis | ✅ Done |
| Tab 4 (Contracts) — redesign defined | ✅ Done |
| Figma wireframe | ⬜ Pending |
| Code implementation | ⬜ Pending |

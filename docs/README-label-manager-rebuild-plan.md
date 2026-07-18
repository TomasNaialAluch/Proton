# Label Manager — pages, problem, and target structure

Fresh doc, replacing the patched note in `docs/README-dashboard-label-manager.md`
(that doc is the original 2026 proposal — multi-label switcher model,
now considered wrong; see below). This one is meant to be read start to
finish in one sitting.

---

## 1. Pages that exist today

All under `app/(dashboard)/dashboard/(label-manager)/`, route group only
(no `label-manager` in the actual URL):

| Page | Route | What it does |
|---|---|---|
| Roster | `/dashboard/roster` | Table of artists on the active label — status, next release, streams, issues. Click a row to "zoom" into that artist elsewhere. |
| Scouting | `/dashboard/scouting` | Suggested artists *not* on the label's roster, worth reaching out to. "Reach out" sends a real message. |
| Requests | `/dashboard/requests` | Inbox of remix/contest entries producers have sent to the label. Own chat thread at `requests/chat/[id]`. |
| Contests | `/dashboard/contests` | List the label's remix-call contests (seeded + label-created); "+ New contest" form picks one of the label's own tracks. |
| Demo policy | `/dashboard/demo-policy` | Edit the label's demo status, preferred genres, format, response time, notes. |
| Catalog | `/dashboard/catalog` | Releases + tracks for the active label, filterable by artist, with a details drawer. |
| Revenue | `/dashboard/revenue` | Streams/revenue charts, top DSPs/territories, scoped to the active label. |
| Statements | `/dashboard/statements` | Royalty run balances per artist, period selector. |

Not built yet, only spec'd in docs: a label-manager mirror of **Contracts**
(see `docs/label-contracts/label-manager-contracts.md`).

**Missing entirely: a Home.** Confirmed — there is no `page.tsx` at
`app/(dashboard)/dashboard/(label-manager)/`. `LABEL_MANAGER_ENTRY` (in
`lib/dashboard/dashboardShellRouting.ts`) points straight at
`/dashboard/roster`, so switching into label-manager view just drops you
on the Roster table with no overview screen — "dice Roster sin más." The
producer side has a real Home; label-manager doesn't. Section 6 below
proposes one, mirroring how the producer Home is actually built.

---

## 2. The actual problem

Every page above was built assuming a **label manager can freely switch
between any of the 19 mock labels** — a global dropdown
(`useLabelScopeStore`'s `mode: "all_labels" | "label"`) that every single
page reads from and branches on.

That's wrong. The producer side has **one identity** — Naial. No
"which producer am I right now" switcher exists anywhere. Label-manager
needs the same shape: **one account, one label, permanently** — not a
super-user administering the whole platform.

Because the free-switcher assumption is threaded through ~10 files
(every page's data filtering, the header/sidebar UI, empty states, form
gates), fixing it in place means touching all of them at once, in a
codebase that's already fairly developed. That's the "muy desarrollado y
no podés trabajar" problem — there's a lot of surface area built on top of
the wrong foundation.

**This is why a rebuild is on the table**, instead of continuing to patch
page by page.

---

## 3. Target model

### 3.1 One label-manager account = one label

Mirrors the producer side exactly. No label switcher UI anywhere. The
active label is a fixed identity, not a selectable state.

### 3.2 Profiles — different levels of administration

New requirement, not in the original proposal at all: a label-manager
account is a **person with a role**, and different roles see/do different
things. Three roles, from most to least access:

- **Owner** — full access: everything below, plus (later) inviting other
  people onto the label's account.
- **Manager** — day-to-day operations: Roster, Catalog, Releases, Revenue,
  Scouting, Requests, Contests, Demo policy.
- **A&R** — talent-focused only: Roster (read), Scouting, Requests. No
  Revenue, no Statements, no Demo policy editing.

This needs to be a first-class concept in the rebuild, not bolted on
after the fact — the page list above should be filterable by "which roles
can see this page" from day one.

---

## 4. Proposed code structure

```
types/
  labelManager.ts
    LabelManagerRole = "owner" | "manager" | "ar"
    LabelManagerProfile { id, name, role, labelId }
    ROLE_PAGE_ACCESS: Record<LabelManagerRole, LabelManagerPageKey[]>
      — single source of truth for "which pages can this role reach"

lib/
  mock/label-manager/
    labelManagerProfile.ts   — the one seeded identity + role
    rosterArtists.ts         — existing, keep
    labelCatalog.ts          — existing, keep (fix labelId accuracy per label)
    artistSuggestions.ts     — existing, keep
    ...(revenue/statements mocks — existing, keep)

  store/label-manager/
    labelIdentityStore.ts    — replaces labelScopeStore's old "mode" concept
                                entirely: activeLabelId is a constant, not
                                state. Keeps activeArtistId (zoom) as the
                                only real piece of settable scope state.

app/(dashboard)/dashboard/(label-manager)/
  roster/, scouting/, requests/, contests/, demo-policy/,
  catalog/, revenue/, statements/
  — same routes as today, each page:
    1. reads the fixed active label + role from the identity store
    2. redirects / shows "not available for your role" if ROLE_PAGE_ACCESS
       excludes it for the current role
    3. no `mode === "all_labels"` branch anywhere — deleted concept

components/dashboard/label-manager/
  RoleGate.tsx          — new: wraps a page, checks ROLE_PAGE_ACCESS,
                           renders children or an access-denied state
  ArtistScopeFilter.tsx — existing, keep (artist zoom, unrelated to labels)
  ...(page-specific components — existing, keep as-is where they don't
      reference the old label-switching mode)
```

### What changes vs. what survives

**Survives as-is:**
- All 8 pages' actual *content* (tables, forms, charts) — the label
  filtering/scoping is what's wrong, not the pages themselves.
- `activeArtistId` "zoom into one artist" — a real, working feature,
  unrelated to the multi-label problem.
- `mockRosterArtists`, `mockLabelCatalog`, and the other label-manager mock
  data files — the data is fine, just needs to be read through a
  single-label lens instead of a switchable one.

**Gets rebuilt:**
- The scope store (`labelScopeStore` → `labelIdentityStore`): drop `mode`
  and the "all labels" branch entirely.
- The label-switcher UI (deleted) — nothing replaces it as a control; the
  active label is just always-true context, shown as identity (not a
  picker) wherever the producer's own name is shown.
- Every page's data-filtering `useMemo` that currently checks
  `mode === "all_labels"` — becomes a flat filter against the one fixed
  label id.
- Add role-gating (`RoleGate`) — genuinely new, didn't exist before in any
  form.

---

## 5. Open decisions before rebuilding

- Does A&R actually get its own distinct UI per page, or just a subset of
  pages hidden entirely (simpler, probably right for a prototype)?
- Where does the role/profile get picked — is there a "log in as
  Owner/Manager/A&R" switch anywhere (mirroring the existing
  producer/label-manager `usePrototypeViewStore` toggle), or is the mock
  account permanently one fixed role?
- Confirm: is a full delete-and-rebuild of `(label-manager)/` actually
  wanted, or should the 8 pages' JSX be salvaged and only the
  scope-reading parts rewritten? (This doc assumes salvage is possible per
  section 4's "survives as-is" list — flagging in case the intent is a
  harder reset than that.)

---

## 6. Label Manager Home — mirroring how the producer Home actually works

### 6.1 What the producer Home does today (`components/dashboard/DashboardContent.tsx`)

Three distinct layers, top to bottom:

**A. Fixed identity hero** — not customizable, always the same shape:
- Large avatar (tap → edit profile), name with an edit-pencil icon,
  genres, country. Reads `mockArtist` + a `useQuery` fetch
  (`fetchArtistWithTracks`) for live track data.

**B. Fixed KPI row** — exactly 3 cards, not customizable, not part of the
widget system: **Tracks**, **Releases**, **Labels** (all derived counts
from the artist's own track list).

**C. Customizable widget board** — this is the part with real machinery:
- 18 possible widgets total (`components/dashboard/widgets/`, listed in
  `DASHBOARD_WIDGETS` + `WIDGET_META`): Streams, Latest Tracks, Streams by
  Release, Royalties, Listeners growth, Top territories, Play sources,
  Rising tracks, Upcoming releases, Distribution status, Catalog codes,
  Royalties by store, Payout history, Pending tasks, Notifications feed,
  Smart links, Social overview, Audio & metadata.
- Only **4 are visible by default** (Streams, Latest Tracks, Streams by
  Release, Royalties) — the rest exist but start hidden.
- "Customize" toggles edit mode → drag-to-reorder (`@dnd-kit`), an `X` to
  hide a widget inline, a "Manage widgets" modal listing all 18 with
  on/off toggles, and "Reset" back to the 4 defaults.
- State lives in `lib/store/dashboardStore.ts` (persisted Zustand):
  `widgetOrder` (full ordering, including hidden ones so their position is
  remembered) + `hiddenWidgets`.

### 6.2 Proposed Label Manager Home — same three layers, label-scale content

**A. Fixed identity hero (mirrored)**
Two identities stack here, since a label account is a *label* + a
*person managing it* (section 3.2's profiles) — unlike the producer side,
which only has one:
- Label avatar/initial, label name (e.g. "Toxic Astronaut").
- Below/beside it, smaller: the manager person — `mockLabelManagerProfile.name`
  + role badge (e.g. "Alex Rivera · Label Manager"), same info already
  placed in `SidebarFooter` — repeating it here in the hero is about
  making Home itself feel populated/real, not introducing new data.

**B. Fixed KPI row (mirrored, using data that already exists)**
Roster's page already computes 4 KPIs that are really label-home-level
stats, not roster-specific ones — reuse them instead of inventing new
numbers: **Active artists**, **Releases next 30d**, **Issues**, and
(new, home-level) **Open contests/requests count**. No new mock data
required for the first 3; the 4th reads `useLabelContests` +
`requests`'s existing conversation-filtering, already built.

**C. Customizable widget board (mirrored catalog, label-scale)**

Proposed label-manager widget catalog, walking through the producer's 18
one by one — most translate directly (same chart, label-wide instead of
artist-wide data), a few don't make sense at label scale and should be
dropped rather than force-mirrored:

| Producer widget | Label-manager equivalent | Notes |
|---|---|---|
| Streams | Revenue trend | Already exists as a full page (`revenue/page.tsx`'s chart) — widget would be a condensed version |
| Latest Tracks | Latest releases | Label-wide, not one artist |
| Streams by Release | Streams by release | Same shape, label-wide |
| Royalties | Statements progress | Ties to `statements/page.tsx`'s data |
| Listeners growth | Roster growth | New framing: artists gained/lost, not listeners |
| Top territories | Top territories | Same shape, label-wide |
| Play sources | Play sources | Same shape, label-wide |
| Rising tracks | Rising tracks | Across the whole roster, not one artist |
| Upcoming releases | Upcoming releases | Same shape, label-wide — overlaps with Releases pipeline page |
| Distribution status | Distribution status | Same shape, label-wide |
| Catalog codes | Catalog codes | Same shape (ISRC/UPC quick reference) |
| Royalties by store | Royalties by store | Same shape, label-wide |
| Payout history | Payout history | Same shape, label-wide |
| Pending tasks | Pending tasks | Maps to Roster's existing "Issues" concept |
| Notifications feed | **Activity feed** | Genuinely label-specific: new contest entries, remix requests, scouting replies — not a mirror, this is where label-only activity belongs |
| Smart links | *(drop)* | Producer promo tool, doesn't apply at the label-account level |
| Social overview | *(drop)* | Each artist owns their own socials — not a label-level concept |
| Audio & metadata | Audio & metadata (QA) | Same shape — ties into the existing metadata-error issue type already in `mockLabelCatalog` |

Same default-4-visible pattern as producer, likely: **Revenue trend,
Latest releases, Activity feed, Pending tasks** — the four a label manager
would actually check first thing. Rest start hidden, reachable via the
same "Manage widgets" modal pattern.

**State**: a new `lib/store/label-manager/labelDashboardStore.ts`, same
shape as `dashboardStore.ts` (`widgetOrder` / `hiddenWidgets`, persisted),
not shared with the producer one — the two boards are independently
customizable.

**Route**: new `app/(dashboard)/dashboard/(label-manager)/page.tsx`
(currently doesn't exist), and `LABEL_MANAGER_ENTRY` in
`lib/dashboard/dashboardShellRouting.ts` changes from `/dashboard/roster`
to `/dashboard` — so switching into label-manager view lands on this new
Home, the same way the producer switch already lands on theirs.

### 6.3 Open question this raises

Several proposed widgets (Upcoming releases, Distribution status,
Pending tasks/Issues) already show the same information on dedicated
pages (Releases pipeline, Roster). Is the Home widget meant to be a
**summary card that links out** to the full page (most likely, matches
producer's pattern — e.g. "Latest Tracks" widget is a condensed list, the
full library lives elsewhere), or should some of these pages get folded
into Home entirely instead of staying separate? Worth deciding before
building the widget components themselves.

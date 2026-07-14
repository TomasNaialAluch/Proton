# Label Detail Page — Design Document

> **Scope note:** this doc used to also cover Track Detail and Artist
> Detail in depth. Once those existed as real pages, they were split out
> into their own docs so each could be iterated on independently:
> `docs/feature-track-detail.md` and `docs/feature-artist-detail.md`. This
> doc now covers Label Detail only — its own sections, its own data model,
> its own known weaknesses. The three pages still link into each other; see
> "How the three pages relate" below for the navigation graph and where
> each entity's data model lives.

## Overview

The Label Detail page is the profile of a label — accessible to any
producer, regardless of whether that label is currently accepting demos.
It serves as the primary decision surface where a producer evaluates fit
and takes action.

This is distinct from "Browse": Browse is for discovery. Detail is for
evaluation and action.

**Route:** `app/(dashboard)/dashboard/labels/[slug]/` — moved out of
`(producer)/` once its actions became role-aware (see
`docs/README-routing-architecture.md`); Browse/Submissions/Messages stay
under `(producer)/labels/`, since those are producer-scoped workflows, not
a general entity page.
**Files:** `page.tsx` (entry), `LabelProfileClient.tsx` (composes everything below)

---

## Implementation status

| Section | Status | Notes |
|---|---|---|
| Label Header | ✅ Built | `LabelDetailHeader.tsx` — contest badge + Follow button, both real |
| Recent Releases | ✅ Built (sample data) | `RecentReleasesStrip.tsx` — real `Track[]`, but the same 5-track sample on every label. Each card links to Track Detail; "View all" links to a paginated/searchable list |
| Artist Roster | ✅ Built (sample data) | `ArtistRoster.tsx` — real `Artist[]`. Each row links to Artist Detail; "View all" links to a paginated/searchable list |
| Demo Policy | ✅ Built | `DemoPolicyCard.tsx`, visible whether the label is open or closed |
| Submit demo (label open) | ✅ Built, real flow | `SubmitTrackForm.tsx` — collapsed by default, expands on tap. Writes to `labelSubmissionsStore`, shows up under Submissions |
| Request to Connect (label closed) | ✅ Built, real flow | `RequestToConnectForm.tsx` — sends via `labelInboxStore`, creates/reuses a real conversation |
| Active Contests | ✅ Built, real flow | `ActiveContests.tsx` + `ContestBadge.tsx` |
| Remix Opportunities (label-curated) | ✅ Built, real flow, 2-step approval | `RemixOpportunities.tsx` — see `docs/feature-track-detail.md` for the label+artist approval rule this now enforces |
| Similar Labels | ✅ Built (mock) | `SimilarLabels.tsx` — genre-overlap only |
| Follow label | ✅ Built, real flow | `LabelDetailHeader.tsx` + `labelFollowsStore.ts` + `lib/mock/labelNews.ts`, surfaces as a real `NotificationsPanel` entry |

**What "real flow" means:** every producer-initiated action on this page
(intro, collab request, remix request, contest entry, demo submission)
writes to a real Zustand store and shows up in Labels → Messages / →
Submissions — not a local success toast that forgets it happened.

---

## The Problem

The original label profile showed: logo, name, genres, and a submit form.
A producer had no way to:

- Understand the label's sound and identity before submitting
- Know what kind of artists are on the roster
- See if there are alternative ways to connect (contest, remix, direct introduction)
- Evaluate submission chances based on recent activity
- Act on a label that isn't currently open for unsolicited demos

The result: producers either submit blindly, or skip entirely.

---

## What the page answers

1. **Is this label right for my sound?** — Recent releases, roster, genre description
2. **How can I connect?** — Multiple action paths, not just "submit demo"
3. **What's the label's current state?** — Activity, demo policy, contests, remix opportunities

---

## Sections

### 1. Label Header
Logo (falls back to initials — no label in the mock data has a real
image), name, founded year, genre tags, bio, activity indicator
(`releaseCount`/`lastReleaseDate`), demo status badge, contest badge if
active, Follow button.

### 2. Recent Releases
A horizontal strip of the label's most recent tracks — see
`docs/feature-track-detail.md` for what a track links to from here.

### 3. Artist Roster
The label's artists as tappable chips — see `docs/feature-artist-detail.md`
for what an artist links to from here, and for the collab-request flow
that used to live inline in this section (it doesn't anymore; tapping an
artist now navigates to their real profile).

### 4. Demo Policy
Structured, label-reported block: accepting demos yes/no/referral,
preferred genres, preferred format, estimated response time, free-text
notes. Stays visible even when the label is closed, sitting directly above
whichever action form renders below it (moved there so the two read
together — used to be scattered higher up the page).

### 5. Active Contests
Contest name, description, deadline, prize, entry action. Surfaced as a
badge in the header too, since Browse has no contest surface of its own.

### 6. Remix Opportunities (label-curated)
Tracks the *label* has flagged as open for remix — distinct from the
artist-driven per-track remix request that lives on Track Detail. Both
now enforce the same 2-step approval (label, then artist) — see
`docs/feature-track-detail.md`.

### 7. Request to Connect
Shown instead of the submit form when the label is closed. Intro-only, no
track attachment — **deliberately still an open product question**, not an
oversight (see Roadmap below, do not "fix" without deciding).

### 8. Similar Labels
3 recommendations by genre overlap only — no roster/activity weighting yet.

---

## Action hierarchy

From most to least common, in order of UI prominence:

| Action | When available | Entry point |
|---|---|---|
| Submit demo | `demoStatus === "open"` | Primary CTA (collapsed by default) |
| Enter contest | Label has an active contest | Highlighted section |
| Request remix slot | Label approved a track for remix AND artist opted in | Section with track list |
| Request to connect | `demoStatus` is "closed" or "unknown" | Secondary CTA below policy |
| Follow label | Always | Icon button in header |

---

## Interface notes

**Not a streaming page.** No full playback here — identity, not a listening session.

**Accessible when closed.** A closed label profile stays fully readable —
policy, roster, releases — only the submit action swaps to "Request to connect."

**Mobile first.** Producers browse during free time, often on mobile —
sections stack cleanly, actions stay thumb-accessible.

---

## Data model

```ts
interface ProtonLabel {
  id: string;
  name: string;
  slug: string;
  image: { url: string } | null;
  artistCount?: number;
  genres?: string[];
  description?: string;

  releaseCount?: number;
  lastReleaseDate?: string;
  demoStatus?: "open" | "closed" | "unknown";
  demoGenres?: string[];
  featured?: boolean;
  foundedYear?: number;
  beatportUrl?: string;

  demoPolicy?: {
    preferredFormat?: "wav" | "mp3" | "either";
    estimatedResponseTime?: string;
    notes?: string;
  };

  activeContests?: {
    id: string;
    title: string;
    description: string;
    deadline?: string;
    prize?: string;
  }[];

  /** Step 1 of the 2-step remix approval — see docs/feature-track-detail.md. */
  remixOpportunities?: {
    id: string;
    trackId: string;
    deadline?: string;
  }[];
}
```

---

## How the three pages relate (Label ↔ Track ↔ Artist)

Not three isolated pages — a cross-linked graph:

```
Label Detail
 ├─→ Track Detail       (Recent Releases / "view all releases")
 └─→ Artist Detail      (Artist Roster / "view all roster")

Artist Detail
 └─→ Track Detail       (their track list)

Track Detail
 └─→ Artist Detail      (every credited artist — a 2-artist track links to both)
```

A producer can bounce Label → Track → (a different) Artist → their Tracks
→ a different Track → back to a different Label, indefinitely.

**Where each entity's data model lives:**
- `ProtonLabel` — this doc, above
- `Track` — `docs/feature-track-detail.md` (shared with Discover and the
  producer's own catalog — this was a real unification, not a given; see
  that doc for why `LabelDemoTrack`, a disconnected ad-hoc type, got
  retired in favor of the real `Track`)
- `Artist` — `docs/feature-artist-detail.md` (reused the existing type
  instead of inventing a parallel `ProtonArtist`)

**Sensitive data carve-out:** unifying on one `Track` does NOT mean every
field is visible to everyone who reaches it — streams/sales stay
access-scoped, never rendered on a track another producer is browsing. See
`docs/README-security.md` #1 and `docs/feature-track-detail.md`.

---

## Known UI weaknesses (why this doc says "keep going")

Label Detail is the most built-out of the three pages, but it's still
visually thin in specific ways:

1. ~~**Every section is the same card shell.**~~ **Addressed:** each
   section now has its own color, matching the same language used on
   Track Detail — Demo Policy stays neutral on purpose (it's a rule, not
   an action), Active Contests is amber, Remix Opportunities is violet
   (same violet as Track Detail's per-track remix card, so "remix" reads
   as one consistent concept everywhere it appears), and the submit
   demo/request to connect form — the page's primary action — gets the
   app's own accent color. Four visually distinct categories instead of
   one repeated shell.
2. ~~**No real label imagery anywhere.**~~ **Partially addressed:** the
   two-letter fallback badge now renders as a deterministic gradient per
   label (`AvatarGradient`, same component Track/Artist Detail use), so
   labels are at least visually distinct from each other by color. Still
   not a real logo/brand color — that needs actual assets.
3. ~~**Similar Labels is genre-overlap only**~~ **Improved:** now ranked
   by *how many* genres actually overlap (not just "any" match), with
   activity level (`releaseCount` proximity) as a tiebreaker — two labels
   putting out a similar volume of music read as more comparable than a
   giant and a tiny one sharing one genre tag. **Roster overlap was
   deliberately left out**: every label currently shows the same shared
   sample roster (see #4 below), so computing overlap against it would
   make every label 100% "similar" to every other one — worse than not
   having the signal at all. Revisit once labels have real, distinct
   rosters.
4. **Recent Releases and Artist Roster are the same 5-track/4-artist
   sample on every label** — real per-label data is Phase 5 (needs a
   backend). ~~The "View all" pages just paginate the same fixed list~~ —
   **addressed for releases:** `/dashboard/labels/[slug]/releases` now has
   a real sort dropdown (newest/oldest, title A-Z/Z-A, genre A-Z/Z-A — same
   options Beatport's label track list offers) and a Genre filter
   (`FilterDropdown`, reused from Discover), plus richer rows (`CoverArt`
   thumbnail + genre/BPM line instead of a bare title/artist). Roster's
   "view all" page (`/roster`) hasn't had the same pass yet.
5. **No sense of label "voice."** The `description` field is a single
   paragraph with no distinct tone per label — Bedrock and a bedroom-house
   label read in the same register.

---

## Roadmap

### Done
- [x] Header, Recent Releases, Artist Roster, Demo Policy, Active
  Contests, Remix Opportunities, Request to Connect, Similar Labels,
  Follow — all built, all real flows where an action is involved
- [x] "View all releases" / "view all roster" — paginated + searchable
- [x] Demo Policy grouped visually with the action it describes
- [x] Submit form collapsed by default

### Still open
- [ ] **Product decision, not implementation debt:** can "Request to
  Connect" intro messages carry an optional track attachment? Blurs the
  line with a real demo submission — flagging so it doesn't get "fixed"
  without deciding first
- [ ] Real per-label release/roster data (needs backend — Phase 5)
- [ ] Label self-manages demo policy/contests/remix slots via a label
  dashboard (Phase 5)
- [ ] "Follow" notifications via push/email, not just in-app (Phase 5)
- [ ] Visual pass addressing the "known UI weaknesses" above — started
  (label imagery, see weakness #2), rest still open: differentiating the
  repeated card shell (#1), Similar Labels quality (#3), per-label sample
  data (#4), label "voice" (#5)

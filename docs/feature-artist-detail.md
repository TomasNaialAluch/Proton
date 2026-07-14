# Artist Detail Page — Design Document

## Overview

Artist Detail is the profile of a real roster artist (`Artist`,
`types/artist.ts`) — reachable from a label's Artist Roster, a label's full
"view all roster" list, or from a track's credited-artist link on Track
Detail. It's a **global route** (`/dashboard/artists/[id]`), same reasoning
as Track Detail: an artist isn't scoped to one label, and a producer should
be able to reach the same artist page from more than one parent.

Split out of `docs/feature-labels-detail.md` (2026) once Artist Detail
existed as real code. See that doc for how Label ↔ Track ↔ Artist relate to
each other as a whole.

---

## Where it lives

**Route:** `app/(dashboard)/dashboard/artists/[id]/` — moved out of `(producer)/`
since an artist is a general entity, not a producer-only concept; see
`docs/README-routing-architecture.md`.
**Files:** `page.tsx` (entry), `ArtistDetailClient.tsx` (composes the
below, resolves the artist/tracks/`via`/`from` and passes them down —
holds no card-specific markup of its own). Sub-components live in
`components/dashboard/artists/detail/`, same split pattern as Label
Detail's `components/dashboard/producer/labels/detail/`:
- `ArtistDetailHeader.tsx` — avatar, name, country, genres, bio
- `ArtistTrackList.tsx` — the tracks section
- `ArtistCollabCard.tsx` — "Request to collaborate," self-guards on
  `openToCollab`/`viaLabel` (returns `null` if either is missing)

**Reached from:**
- A label's Artist Roster (`RosterArtistRow.tsx`) — via
  `?via=<labelSlug>`
- A label's "view all roster" list (`labels/[slug]/roster/page.tsx`) — via
  `?via=<labelSlug>&from=<path>`
- A track's credited-artist link on Track Detail — via `?from=<path>`, no
  `via`

---

## What's on the page today

1. **Header card** — initials-only avatar (no real photo), name, country
   (if set), genre chips, bio paragraph (only rendered if `artist.bio` is
   non-empty — every mock artist has `bio: ""`, so this never actually
   shows today).
2. **Tracks section** — every `Track` (shared entity, see
   `docs/feature-track-detail.md`) credited to this artist, deduped across
   both the label sample catalog and the producer's own catalog, each
   linking to Track Detail. Plain list rows: title + release name/genre,
   no cover, no play button.
3. **"Request to collaborate" card** — gated on two things at once, see
   below.

---

## The two-gate "who do I message" problem

**Gate 1 — the artist has to have opted in:** `artist.openToCollab` must
be `true`. Seeded on `mockRosterArtists`
(`lib/mock/label-manager/rosterArtists.ts`): Naial, GMJ, and Emily
Underhill are open; Matter deliberately isn't, to prove the gate actually
hides the action (not just theoretically gated).

**Gate 2 — there has to be a label to route the message through.** A
collab request always goes *through* a label (`sendLabelRequest({label,
kind: "collab", ...})`) — producers never message artists directly, the
label mediates, same rule as every other action in this feature. But the
`Artist` entity has no stored "which labels I'm on" relationship. So this
page relies entirely on **how you got here**:

- `?via=<slug>` — set when linked from a specific label's roster. Directly
  usable as the target label.
- No `via`, but `?from=<path>` is set — the Back button still works
  (deterministic), but there's no known label, so **the collaborate action
  simply doesn't render.** Browsing-only in that case (e.g. reached from
  Track Detail, which doesn't know or pass a `via`).

This is an honest scope limit, not a bug: inventing a stored
artist↔label(s) relationship wasn't part of the pass that built this page.
If an artist works with multiple labels, there's currently no way to choose
which one mediates outside of "whichever label you happened to click
through."

---

## Data model

Reuses the existing `Artist` type (`types/artist.ts`) instead of a
parallel `ProtonArtist` — there was already a real roster
(`mockRosterArtists`) used by the label-manager side of the app (catalog,
revenue, statements all key off these same artist ids: `naial`, `gmj`,
`matter`, `emily`). Two fields were added for this feature:

```ts
export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  country: string;
  genres: string[];
  socialLinks: { instagram?: string; soundcloud?: string; spotify?: string };
  openToCollab?: boolean;   // added — gates "Request to collaborate"
  openToRemix?: boolean;    // added — checked on Track Detail, not here
}
```

Note `openToRemix` lives on the artist but is only ever checked on **Track
Detail**, not this page — because remix approval is also gated by the
*label's* per-track approval (`label.remixOpportunities`), and that check
only makes sense in the context of one specific track, not the artist as a
whole. See `docs/feature-track-detail.md`'s "2-step remix approval"
section.

---

## Research: Beatport's artist page — filtered for what's actually ours to take

Looked at a real Beatport artist page (Vintage Culture) — same exercise as
the track-page research in `docs/feature-track-detail.md`. **Most of what's
there doesn't apply to us and was deliberately left out below** — Beatport
is a marketplace optimizing for discovery-to-purchase; Proton isn't selling
anything on this page, and the whole point of this redesign is fostering
connection between people, not comparison or status (same rule already
established in `docs/README-security.md` #1: nobody sees another artist's
numbers, because it doesn't help them and works against the point).
Two things Beatport does were cut for exactly that reason, noted so they
don't get re-added later without re-litigating why:

- **"Charts"** — playlists the artist curates and publishes as a DJ. This
  is a content-creation/discovery feature for a marketplace, not something
  that helps a producer evaluate or connect with this artist. Not ours to
  build.
- **"Top Ten Tracks"** — a popularity ranking. Same category of problem as
  showing another artist's streams/sales, just coarser: it turns the page
  into a status display instead of a profile. Rejected outright, not
  "deferred" — it's the same "comparison over connection" trap already
  ruled out elsewhere in this project.

**What actually is pertinent, and why each one earns its place:**

1. **A real, substantial bio, populated by default.** Directly serves the
   page's actual job — helping a producer judge "is this artist a fit to
   work with" — which is the whole reason Artist Detail exists (to support
   the collaborate/remix-request flow). Confirms existing weakness #2: a
   real artist page leads with a bio; ours never has, because every mock
   artist's `bio` is `""`.
2. **Track rows with cover art + inline play**, instead of plain text
   rows. Not borrowed for polish's own sake — hearing/seeing a track
   before deciding whether to reach out is part of evaluating fit, same
   reasoning as Track Detail's cover+waveform research.
3. **URL structure** (`/artist/[slug]/[id]`, tab as a real sub-path) — a
   plumbing detail, not a design choice, noted for consistency if we ever
   add sub-views to this page.

Deliberately **not** carrying over the Destacado/Pistas tab split itself —
it's real estate spent solving a "huge catalog, needs curation" problem
Beatport has and we don't (a roster artist here has a handful of tracks,
not hundreds). Revisit only if that stops being true.

---

## Known UI weaknesses (why this doc says "keep going")

Thinner than Track Detail, honestly — this page proves the routing/gating
logic works, not that it's a good artist profile.

1. **No real photo.** `avatarUrl` exists on `Artist` but every mock artist
   has `avatarUrl: ""` — the header always falls back to a two-letter
   initial badge, identical treatment to how tracks fall back to a generic
   music icon. Nothing about the page visually distinguishes one artist
   from another beyond their name and genre chips.
2. **Bio never renders in practice.** The bio block is conditional on
   `artist.bio` being non-empty, and it's empty on every seeded artist —
   so a section that's designed into the page has never actually been seen
   rendered. Either populate real bios in the mock data or don't build the
   conditional yet.
3. **Social links exist on the type, never shown.** `Artist.socialLinks`
   (Instagram/SoundCloud/Spotify) is real data on the type and populated
   nowhere in the UI at all — dead weight in the type today.
4. **No stats.** No release count, no "member since," no genres-over-time,
   nothing that helps a producer judge "is this artist active / a good
   fit" beyond the static genre chips — contrast with Label Detail, which
   at least shows `releaseCount`/`lastReleaseDate`.
5. **Track list is a plain text list.** No cover art, no play button, no
   grouping by release — just rows of title + subtitle, less visually rich
   than even the label's own Recent Releases strip that links here.
6. **The collaborate form is a bare textarea** — no structure (compare to
   how `SubmitTrackForm` on Label Detail at least has a file upload + genre
   selector + note; this is just one free-text field with no prompts or
   guidance for what a good pitch looks like).
7. **The `via`-less dead end isn't explained to the user.** If you land
   here without a `via` (e.g. from Track Detail) and the artist happens to
   be `openToCollab: true`, there's no card at all — no "you can't do this
   from here, go via a label" message, it just silently isn't there. A
   producer with no context might not understand why the button they saw
   elsewhere isn't available.

---

## Roadmap

- [x] Page exists, reads the real shared `Artist`, reachable from a
  label's roster, "view all roster," and Track Detail
- [x] Collaborate action gated on `openToCollab` + a known label (`via`)
- [x] Deterministic back navigation (`from` param, falls back to `via`
  label's page when `from` isn't set)
- [x] Visual identity via `AvatarGradient` (deterministic per-artist
  gradient circle with initials, sibling to Track Detail's `CoverArt`) —
  replaces the flat single-color initials box in the header and
  `RosterArtistRow`. Real photo support is still a separate, later step
- [x] Populate real bios in mock data — all 4 roster artists now have a
  real 1-2 sentence bio; the header's bio block actually renders now
- [ ] Render `socialLinks`
- [ ] Some form of artist activity/stats
- [x] Richer track list — rows now show `CoverArt` per track, still no
  inline play or release-grouping yet
- [ ] Structured collab-request form instead of a bare textarea
- [ ] Decide what to show when reached without a `via` and the artist is
  otherwise open to collab — at minimum, explain why the action is missing
  instead of omitting it silently
**Explicitly rejected, not just deferred** (see Beatport research above for
why): a DJ-style "Charts"/curated-playlists feature, and any "Top Ten" /
popularity ranking — both are comparison/status features that work against
this project's actual goal, not gaps to fill in later.

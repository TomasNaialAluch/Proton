# Track Detail Page — Design Document

## Overview

Track Detail is the profile of a single track — the shared `Track` entity
(`types/track.ts`) that Discover, the producer's own catalog, and a label's
release list all read from. It's a **global route**
(`/dashboard/tracks/[id]`), not scoped to a label or an artist, because a
track is reachable from more than one parent: a label's Recent Releases, a
label's full "view all releases" list, an artist's own track list, or —
once linked from there — the artist credited on it.

Split out of `docs/feature-labels-detail.md` (2026) once Track Detail
existed as real code, so it could be iterated on as its own surface instead
of a subsection of the Label doc. See that doc for how Label ↔ Track ↔
Artist relate to each other as a whole.

---

## Where it lives

**Route:** `app/(dashboard)/dashboard/tracks/[id]/` — moved out of
`(producer)/` since a track is a general entity, not a producer-only
concept; see `docs/README-routing-architecture.md`.
**Files:** `page.tsx` (entry), `TrackDetailClient.tsx` (composes the below,
resolves the track/artists/label and passes them down — holds no
card-specific markup of its own). Sub-components live in
`components/dashboard/tracks/detail/`, same split pattern as Label
Detail's `components/dashboard/producer/labels/detail/`:
- `TrackDetailHeader.tsx` — cover, title, artists, metadata, release, label link
- `TrackFeedbackCard.tsx` — self-guards on `track.openForFeedback`
- `TrackRemixCard.tsx` — self-guards on the label having approved this
  track for remix (2-step approval, see below)

**Reached from:**
- A label's Recent Releases strip (`RecentReleasesStrip.tsx`)
- A label's "view all releases" list (`labels/[slug]/releases/page.tsx`)
- A label's curated Remix Opportunities list (`RemixOpportunities.tsx`)
- An artist's own track list (`ArtistDetailClient.tsx`)

Every one of those links appends `?from=<path>` so the page's Back button
returns to the exact place the producer came from — see "Known UI
weaknesses" below for why this had to be built at all, and
`components/dashboard/_shared/BackButton.tsx` for the mechanism.

---

## What's on the page today

1. **Header card** — generic music-note icon (no real cover art), title,
   every credited artist as a link (`&`-joined if more than one), a row of
   genre/BPM/key/duration, release name + date if set, and a link to the
   label if `track.labelSlug` resolves to one.
2. **"Open for feedback" card** — only rendered if `track.openForFeedback`
   is true. If the track is also in `mockDiscoverTracks`, shows a "Give
   feedback" button linking to `/dashboard/discover/[id]` (the real scored
   feedback flow). If not, shows an informational sentence instead of a
   dead link.
3. **"Remix this track" card** — only rendered if the **label** has
   approved this track for remix (`track.id` appears in
   `label.remixOpportunities`). Inside that: if a credited artist also has
   `openToRemix: true`, shows a working "Request to remix" button (via
   `sendLabelRequest`, same shared inbox action used everywhere else). If
   the label approved but no artist has opted in yet, shows "awaiting
   artist" text instead of a button — see the 2-step approval rule below.

That's the entire page. No cover image, no audio player, no waveform, no
"more from this release," no "similar tracks."

---

## Data model

`Track` (`types/track.ts`) — the single shared entity, also used by
Discover (`DiscoverTrack extends Track`) and the producer's own catalog
(`mockTracks`):

```ts
export interface Track {
  id: string;
  title: string;
  artistId: string;           // primary credited artist (back-compat)
  artistIds?: string[];       // full credit list — a track can have 2+ artists
  duration: number;
  genre: string;
  releaseDate: string;
  status: "draft" | "pending" | "published";
  audioUrl: string;
  coverUrl: string;
  bpm?: number;
  key?: string;
  openForFeedback?: boolean;  // gates the feedback card
  labelSlug?: string;         // which label released it, if any
  releaseName?: string;       // EP/LP/single name for display
}
```

**Deliberately not on this type:** `streams`/sales. That data is sensitive
— only the track's own artist and the label with distribution rights
should see it — and lives in access-scoped lookups instead
(`TRACK_STREAMS`/`TRACK_SALES` in `lib/mock/performance.ts`). See
`docs/README-security.md` #1 and `docs/README-efficiency.md` #3 for the
full reasoning (it's both a privacy rule and a "don't ship data nobody
asked for" efficiency rule). Track Detail never fetches or renders it,
regardless of who's viewing.

**Where the mock tracks come from:** `lib/mock/labelSampleCatalog.ts`
(`LABEL_SAMPLE_TRACKS`, the shared 5-track sample shown on every label
until there's a real per-label catalog) and `lib/mock/tracks.ts`
(`mockTracks`, the producer's own real catalog). `findTrack()` in
`TrackDetailClient.tsx` checks both, since either can be the source
depending on how you got here.

---

## The 2-step remix approval

Enabling a remix isn't the artist's call alone — the label holds
distribution rights and has to approve a track for remix first, and only
then does the credited artist's own opt-in matter. Both gates are checked
here and on Label Detail's `RemixOpportunities.tsx` section, off the same
data (`label.remixOpportunities[].trackId`), so the two surfaces never
disagree about what's remixable:

```
labelApprovedRemix = track.id is in label.remixOpportunities
canRequestRemix    = labelApprovedRemix AND some credited artist has openToRemix
```

When only the first is true, the UI says "awaiting artist" instead of
silently hiding the card — reads as pending, not broken. Demonstrated in
the sample data: "Fading Signal" (Matter, Sudbeat-approved, but Matter has
`openToRemix: false`) shows "awaiting artist"; "Open Horizons" (Emily
Underhill, Bedrock-approved, `openToRemix: true`) passes both gates and the
request actually sends.

---

## Research: Beatport's track detail page (real-world reference)

Looked at a real Beatport track page to check our anatomy against a
product that's been doing exactly this — a single track's page, in a
music-marketplace context — for years.

**URL:** `beatport.com/es/track/toxic/29348883` — human slug + a stable
numeric id together, locale-prefixed. (We use just an id today; a slug
alongside it would read better in a shared link but isn't load-bearing.)

**Page anatomy, top to bottom:**

1. **Large cover art** — not a generic icon, the actual release artwork,
   often with its own typographic treatment baked in. This is the first
   thing you see, full-width-ish, unmistakably *this* track and no other.
2. **A type label** ("Pista" = "Track") — a small tag confirming what kind
   of page you're on, since Beatport also has Release/Album pages that
   look structurally similar.
3. **Title + mix name**, bold title with a lighter-weight suffix ("Toxic
   **Extended**") — mix/version is part of the identity, not a footnote.
4. **Artists**, comma-separated, bold, immediately under the title — no
   scrolling needed to know who made it.
5. **A compact action row** right under the artists: play, queue, buy,
   share (X, Facebook, copy-link) — all the "do something with this track"
   affordances live in one dense row, not scattered down the page.
6. **A large, full-width waveform** — this is the dominant visual element
   of the entire page, more real estate than everything else combined. It
   scrubs, it's colorful, it visually communicates the track's energy
   (dense/sparse regions) before you've even pressed play.
7. **Metadata as a clean label:value list** — Compañía discográfica
   (label), Género, BPM, Clave, Duración, Lanzado — one line each, plenty
   of vertical breathing room, easy to scan top to bottom.
8. **"Aparece en" ("Appears on")** — a small horizontal row of release
   cards (thumbnail + name) this exact track shows up on. In the example
   it appeared on two: its own EP/single AND a "Summer Sounds 2026"
   compilation — so this is genuinely a many-to-many relationship (a track
   can appear on more than one release), not a single `releaseName` string.
9. **"Recomendaciones"** — a long (20-item) numbered list of other tracks:
   rank, title + mix, artist(s), label, price. No visible logic tying them
   to genre or the current artist specifically — reads as "here's more to
   browse," not a tightly-reasoned "because you liked this."
10. **A persistent bottom mini-player**, separate from the big on-page
    waveform — whatever's actually queued/playing stays visible and
    controllable no matter which track page you navigate to next. Browsing
    never interrupts listening.

**What makes it genuinely pleasant to use (the actual ask — not just "what
sections exist"):** it's almost entirely about steps 1 and 6. A huge,
specific cover image plus a huge, specific waveform means the very first
thing you register on the page is *this exact track's* identity — visually
distinct, inviting to click into, not a form to read. Our current page
does the opposite: a generic music-note icon that's pixel-identical across
every track on the site. That's the single biggest gap between "this page
technically works" and "this page feels good to be on" — it directly
reinforces weakness #1 and #2 below, now with a concrete reference for
*why* they matter, not just that they're missing.

**What's NOT relevant to us:** the price/buy/cart affordances — we're not
a marketplace, nobody's purchasing a track here. Skip that part of the
pattern entirely.

**Why "pleasant" matters here specifically — this isn't decoration.**
Beatport's polish is in service of a purchase — a nicer page converts
better. We have no transaction to convert toward. Proton doesn't sell
anything on this page; what we're actually competing for is **whether an
artist or a label manager chooses to use this platform at all** instead of
DMs/email/nothing. The entire premise of this redesign, all the way back
to the messaging-design research earlier in this project
(`docs/label-contracts/contracts-rebuild-plan.md` — no read receipts, no
manufactured urgency, warm tone over corporate tone) and the
"connection over comparison" rule in `docs/README-security.md` #1
(nobody sees another artist's numbers), is the same thesis applied to
every surface: **the pleasantness of navigating and connecting IS the
product**, not a wrapper around some other value we're delivering. So
borrowing Beatport's "instantly-recognizable, tactile identity per track"
(cover + waveform) is worth doing — that's genuinely what makes a page
feel good to be on — while everything in service of a sale gets left
behind, because we're not selling.

**Concrete takeaways for this page:**
- "Aparece en" maps directly onto something we're already rendering wrong:
  today `track.releaseName` is a single plain-text string next to the
  date. Beatport's version — a small card per release, with its own
  thumbnail — implies a track can belong to more than one release, which
  our current single-string field can't represent. Worth keeping in mind
  if/when `releaseName` needs to become `releases: {id, name, coverUrl}[]`.
- "Recomendaciones" is a real, clearly-labeled section — worth adding to
  our page **as a structural placeholder now, with no data/algorithm
  behind it yet.** Not because it's ready to build (no real per-track
  similarity signal exists in this prototype), but so the page's layout
  already reserves the space and the heading, instead of that being a
  surprise addition to the layout later.

---

## Known UI weaknesses (why this doc says "keep going")

This page works, but it's visually thin — it proves the data model and the
navigation graph, not a finished page. In rough priority order:

1. **No real visual identity for the track.** The header is a generic
   music-note icon in a colored box, same icon for every track on the
   whole site. No cover art (`coverUrl` exists on `Track` but is never
   rendered — every mock track has `coverUrl: ""`), no accent color per
   genre, nothing that makes this track *feel* different from any other.
2. **No audio.** `audioUrl` exists on `Track` but Track Detail doesn't
   render a player or even a preview button — you can't hear the track
   you're looking at. The global player exists elsewhere in the app
   (`components/player/global-player/`) but isn't wired in here.
3. **Metadata is a flat, low-contrast line.** Genre/BPM/key/duration are
   one `text-xs text-text-secondary` row with no visual separation or
   hierarchy — reads as an afterthought, not scannable at a glance.
4. **The feedback and remix cards are visually interchangeable** — same
   card shell, same icon-in-a-box pattern, no differentiation for what's
   actually a very different kind of action (one opens structured scoring
   in Discover, the other opens a message thread with a label).
5. **No "more like this."** No related tracks (same artist, same label,
   same genre), no way to keep browsing from here without going back.
6. **No loading or empty states considered.** `notFound()` covers a bad id,
   but there's nothing between "instant" and "not found" — fine for mock
   data with zero latency, but the page has no skeleton for when this is
   backed by a real fetch.
7. **The Back button had to be hand-fixed with a `from` query param**
   because this page is reachable from multiple parents and browser
   `history.back()` wasn't reliable in practice (see
   `components/dashboard/_shared/BackButton.tsx`) — works now, but it's a
   sign the page's navigation model was bolted on after the fact rather
   than designed in from the start.

---

## Roadmap

- [x] Page exists, reads the real shared `Track`, reachable from Label
  Detail, Label's "view all releases," Label's remix list, and Artist
  Detail
- [x] Feedback and remix actions, both correctly gated
- [x] Deterministic back navigation (`from` param)
- [x] Visual identity via `CoverArt` (deterministic per-track gradient,
  same component Discover already uses) — replaces the generic music-note
  icon in the header, `RecentReleasesStrip`, and `ArtistTrackList`. Real
  `coverUrl` rendering is still a separate, later step (needs real assets)
- [ ] Audio preview / player integration — checked: **no real audio file
  exists anywhere in this prototype**, `audioUrl` is `""` on every mock
  track including Discover's own preview player, which is already wired
  up but has nothing to actually play. Blocked on real audio assets
  (or a decision to fake it with placeholder audio), not a UI gap
- [x] Visual hierarchy pass on the metadata row — genre/BPM/key/duration
  are pills now, not a flat text line
- [x] Differentiate the feedback vs. remix card visually — feedback is
  sky-blue, remix is amber (matching the amber "opportunity" language
  already used for Active Contests), not just copy on an identical shell
- [ ] "More from this artist" / "more from this release" section
- [ ] Loading/skeleton state for when this is backed by a real API
- [ ] **"Appears on"** — a small horizontal row of release cards this track
  belongs to (see Beatport research above). Needs `releaseName: string` to
  become a real `releases: {id, name, coverUrl}[]` relation first, since a
  track can appear on more than one release
- [ ] **"Recommendations"** — add the section, structured (heading +
  layout reserved), with **no data or algorithm behind it yet** — a
  deliberate empty/placeholder state, not a half-built feature. Real
  content needs a similarity signal this prototype doesn't have (genre
  match, same artist, same label, activity) — decide that before filling
  it in, don't fake it with random tracks

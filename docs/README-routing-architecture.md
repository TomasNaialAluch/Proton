# Routing architecture — general entities vs. role-specific pages

## The question

Label Detail, Track Detail, and Artist Detail are general entities — a
track is a track whether a producer, a label manager, or (eventually) a
logged-out visitor is looking at it. Today they all live nested inside
`app/(dashboard)/dashboard/(producer)/...`, as if they belonged to the
producer role specifically. Checked how a real product that's organized
around exactly these entities (Beatport) structures this, to see if our
nesting is the right call.

## What Beatport does

Confirmed via the actual site (both the visible URL and the real `<a>`
hrefs on a label page, checked in devtools):

```
/es/label/{slug}/{id}          /es/label/{slug}/{id}/tracks
/es/track/{slug}/{id}          /es/label/{slug}/{id}/releases
/es/artist/{slug}/{id}         /es/artist/{slug}/{id}/tracks
/es/release/{slug}/{id}
```

**No role prefix anywhere.** Not `/dj/artist/...`, not
`/label-manager/track/...` — just the entity type at the top level. A
label's page links to tracks, which link to artists, which link back to
labels, all through the same flat namespace, regardless of who's browsing.

## Our situation

`app/(dashboard)/dashboard/` has two route groups today,
`(producer)/` and `(label-manager)/`, each with their own pages
(Performance/Royalties/Contracts/Discover/Feedback/Connections for
producer; Catalog/Revenue/Roster/Statements for label-manager). `tracks/`,
`artists/`, and `labels/` all currently live inside `(producer)/` —
meaning, structurally, they're filed as if they were producer-only
features, even though nothing about "what a track is" is
producer-specific.

**Important technical detail:** parenthesized route-group folders
(`(producer)`, `(label-manager)`) are a Next.js App Router convention that
does **not** appear in the actual URL — `(producer)/tracks/[id]` and
`tracks/[id]` produce the exact same browser URL,
`/dashboard/tracks/[id]`. So moving these folders is a **pure file-system
reorganization**: zero URL changes, zero `Link href` changes anywhere in
the app (confirmed: `tracks/` and `artists/` use only `@/`-absolute
imports, no relative paths, so nothing breaks on a move either). This is
about where the code *lives conceptually*, not how it *behaves* — low
risk, purely a maintainability fix.

## We already have the right precedent for this

`app/(dashboard)/dashboard/releases/page.tsx` already lives at the top
level, sibling to both route groups — not inside either one. Internally it
branches on `usePrototypeViewStore().view` ("producer" | "label_manager",
the same toggle behind the "PRODUCER VIEW / Switch" badge seen throughout
the app) to render different content per role from the same route. That's
exactly the pattern Track/Artist Detail should follow once they need
label-manager-facing content — no new pattern to invent, just apply the
one that's already there.

## Reorganization — done

- [x] `app/(dashboard)/dashboard/(producer)/tracks/` → `app/(dashboard)/dashboard/tracks/`
- [x] `app/(dashboard)/dashboard/(producer)/artists/` → `app/(dashboard)/dashboard/artists/`

Confirmed zero URL/href/import changes needed, as predicted above. Went a
step further than just moving the route: both `TrackDetailClient.tsx` and
`ArtistDetailClient.tsx` were monolithic (~200 lines, header + every card
inline) — split each into a composer + sub-components, mirroring the
pattern Label Detail already established
(`components/dashboard/producer/labels/detail/`):

- `components/dashboard/tracks/detail/` — `TrackDetailHeader.tsx`,
  `TrackFeedbackCard.tsx`, `TrackRemixCard.tsx`
- `components/dashboard/artists/detail/` — `ArtistDetailHeader.tsx`,
  `ArtistTrackList.tsx`, `ArtistCollabCard.tsx`

Each action card self-guards with an early `return null` (same convention
`DemoPolicyCard`/`RemixOpportunities` already use on Label Detail) rather
than the parent deciding what to render — which is exactly what makes the
role-hiding rule from the section above (hide producer-only actions, hide
self-directed actions) cheap to add later: it's one more condition inside
`ArtistCollabCard`/`TrackRemixCard`'s existing guard, not a restructure.

**Also done, once the blocker above was resolved:**
- [x] `app/(dashboard)/dashboard/(producer)/labels/[slug]/` → `app/(dashboard)/dashboard/labels/[slug]/`
  (with its `releases/` and `roster/` sub-pages)

This was the one flagged as "needs more thought" in an earlier pass,
because Label Detail's action area (`SubmitTrackForm`/`RequestToConnectForm`,
`ActiveContests`, `RemixOpportunities`) wasn't role-aware yet — moving it
while a label manager would still see "pitch this label" actions on their
own label's page would've been premature. Once the role-hiding rule above
was actually implemented (every producer action gated on
`usePrototypeViewStore().view`), that blocker was gone, so this moved too.

**Verified no routing conflict:** `(producer)/labels/(tabs)/` (Browse,
resolves to `/dashboard/labels`) and the new top-level
`labels/[slug]/` (resolves to `/dashboard/labels/[slug]`) are different
leaf URLs, so both can exist as physically separate `labels/` folders
under different route groups without Next.js treating it as a duplicate
route — confirmed by hitting `/dashboard/labels`,
`/dashboard/labels/sudbeat`, `/dashboard/labels/sudbeat/releases`, and
`/dashboard/labels/sudbeat/roster` in dev, all 200.

**Still nested under `(producer)/labels/`, and correctly so:** `(tabs)/`
(Browse, Submissions, Messages) and `chat/[id]/` — these are producer-scoped
workflows (submitting demos, tracking your own submissions, your own
label conversations), not a general entity page, so they stay put.

**Also worth noting:** `(label-manager)/roster/page.tsx` already reads the
same `mockRosterArtists` we unified Artist Detail onto — good, no
duplicate data model — but it's a management dashboard (active/inactive,
next release, issues, streams KPI scoped to the label manager's own
roster), a different job from Artist Detail (a profile for evaluating
fit/reaching out). Complementary, not overlapping — no conflict, just
worth knowing both exist and read the same underlying artist list.

## Resolved: these pages don't need a label-manager UI mode at all

Asked directly, one question per page. The answers turned out simpler than
the "different verbs per role" framing this doc originally guessed at:

**Label Detail, own label vs. others':** the mental model given was Naial
(a producer) opening his own artist profile — it looks exactly like what
anyone else sees, just without the ability to message/collaborate with
himself. Same logic here: **a label manager's own Label Detail page looks
identical to what a producer sees** — no separate "edit/manage" mode, no
alternate layout. Management already has its own dedicated place
(`(label-manager)/catalog`, `/revenue`, `/roster`, `/statements`). Label
Detail (and Track/Artist Detail) are **universal, read-only-ish profile
pages** — the same page for every viewer. The only thing that changes:
**self-directed actions disappear when you're viewing your own entity** —
you can't submit a demo to your own label, you can't request to
collaborate with your own artist. Not replaced with a management
equivalent, just removed, because that reflexive action never made sense
regardless of role.

**Follow, label viewing another label:** explicitly **no** — and not
because of the self/other distinction above. Reasoning given: the
label-manager role in this product isn't "manage your own catalog like a
mini social network of other labels" — the whole point of this redesign is
connecting labels **with artists**, not with other labels. Follow stays a
producer-only action, full stop, regardless of whose label page a label
manager is looking at.

**Track Detail, remix approval on their own label's track:** explicitly
**no** — that's a separate management screen's job, not something to
surface inline on the same universal Track Detail page a producer sees.
Track Detail stays read-only-plus-producer-actions; the label side of the
2-step remix gate (`docs/feature-track-detail.md`) gets built as its own
catalog-management feature later, not bolted onto this page.

**Artist Detail, their own roster artist:** explicitly **nothing** —
redirect to the roster dashboard instead. Artist Detail isn't where a
label manager manages their own artist; `(label-manager)/roster` already
exists for that.

**The actual, much simpler rule that falls out of all four answers:**

1. Label/Track/Artist Detail render **the same content for every viewer**,
   producer or label manager — no `usePrototypeViewStore`-branched layout
   needed on these three pages.
2. Every action currently on these pages (submit demo, request to connect,
   request to collaborate, request to remix, follow) is **producer-only**
   — hide it outright for `view === "label_manager"`, don't replace it
   with a management equivalent. Management lives in the dedicated
   label-manager screens, not here.
3. Additionally, hide any action that would target **yourself** (viewing
   your own label/artist), regardless of role — same reasoning as a
   producer opening their own public profile.

So the earlier assumption that each page needed its own bespoke
label-manager action design was overthinking it — there's no new UI to
build for label-manager view on these three pages, just conditions to hide
existing producer actions.

**Confirmed buildable with what already exists:** `useLabelScopeStore`
(`lib/store/label-manager/labelScopeStore.ts`) already tracks
`activeLabelId` — which label a label-manager account is scoped to. That's
exactly what rule 3 needs ("is this my own label?" is just
`activeLabelId === label.id`; "is this artist on my own roster?" is a
membership check against that label's roster). No new data model required
— when this gets implemented, it's `view`/`activeLabelId` conditionals on
already-existing action blocks, not new state.

### Implemented

- [x] **Rule 2** (hide producer-only actions for label-manager view) —
  `usePrototypeViewStore().view === "label_manager"` conditionals added to
  every action identified above:
  - Track Detail: `TrackFeedbackCard`, `TrackRemixCard` — hidden entirely
  - Artist Detail: `ArtistCollabCard` — hidden entirely
  - Label Detail: `LabelDetailHeader`'s Follow button, the
    `SubmitTrackForm`/`RequestToConnectForm` block — hidden entirely;
    `ActiveContests`' "Enter contest" and `RemixOpportunities`' "Request to
    remix" — only the button hides, the informational row/card stays (per
    rule 1, same content for everyone)
- [x] **Rule 3** (hide self-directed actions) — implemented for Track
  Detail and Artist Detail using `mockArtist.id` (the current producer's
  own identity) against the track's credited artists / the artist being
  viewed. **Not needed for Label Detail**: rule 2 alone already covers it,
  since only label-manager accounts "own" a label, and rule 2 already
  hides label actions for that whole role regardless of which label —
  there's no producer-viewing-their-own-label case in this data model, so
  no `activeLabelId` self-check was actually necessary here after all.

## Why this is worth doing at all

Not cosmetic. Filing a general entity under one role's folder is exactly
the kind of thing that silently forces bad decisions later — e.g. someone
building a label-manager feature that needs to link to a track would
either duplicate the page under `(label-manager)/` (now two Track Detail
pages to keep in sync) or reach across into `(producer)/`'s folder (which
reads as a layering violation even though it'd work). Fixing the location
now, while it's a free move, avoids both.

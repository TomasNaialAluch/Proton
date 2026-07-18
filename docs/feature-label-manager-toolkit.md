# Label-manager toolkit — artist suggestions, remix inbox, contests, demo policy

## The ask

Four related asks, all about giving the label-manager role active tools to
manage outward-facing parts of their label, not just read-only dashboards:

1. A Discover-equivalent — but suggesting **artists** the label could reach
   out to / try to sign, the way the producer side suggests other
   producers to connect with.
2. An inbox for incoming **remix requests** from producers, so the label
   can review and respond to them.
3. The ability to **create contests** (today producers can only enter
   ones that already exist).
4. The ability to **set the label's demo policy** — open/closed, what it
   requires — instead of that being fixed mock data.

## Where this fits

`app/(dashboard)/dashboard/(label-manager)/` today has exactly four pages,
all read-only dashboards: `catalog` (release/track pipeline + QA issues),
`revenue` (charts), `roster` (artist table), `statements` (payout runs).
Nothing under this route group matches "suggest," "inbox," "request," or
"contest" — confirmed empty on a repo-wide grep. All four asks are
genuinely new surface area, not something to wire up from an existing
page. All four should scope to `labelScopeStore.activeLabelId` — the same
pattern `catalog`/`revenue` already use to know which label the
label-manager is currently looking at.

One structural note that affects all four: `ProtonLabel` (`types/label.ts`)
has no field linking a label to an owning label-manager account —
"this label is mine" is established purely by `activeLabelId` matching,
never stored on the label itself. Fine for a single-label-manager
prototype; worth knowing if multi-account ever becomes real.

## 1. Artist suggestions ("Discover for label-manager")

**Nothing exists today.** The producer-side analog is Connections
(`mockConnectionSuggestions` in `lib/mock/connections.ts`, typed by
`ConnectionSuggestion` — `peer`, `reason: {type, sharedGenres,
highlights}`, `status`, `peerAlreadyAccepted`) — a suggestion *why* two
producers would pair well, with a pending/accepted state machine.

The label-manager's roster mock (`lib/mock/label-manager/rosterArtists.ts`)
is only the label's **own already-signed** roster (4 artists) — there is
no pool of unsigned or "open to being scouted" artists anywhere in the
codebase. This is the biggest gap of the four: the other three features
reuse an existing data shape with a new consumer; this one needs a new
mock dataset from scratch (something like `LabelSuggestedArtist` —
artist, shared-genre/reason, whether they're already signed elsewhere,
maybe an `openToLabelOutreach` flag mirroring `Artist.openToCollab`) before
any UI can be built. Proposed shape: mirror `ConnectionSuggestion`
closely (same "why this pairing" reasoning card the producer side already
uses), swapping "producer↔producer" for "label↔artist."

## 2. Remix requests inbox

**Better-than-expected news: the request-side plumbing already exists.**
When a producer clicks "Request to remix" (`RemixOpportunities.tsx`), it
calls `sendLabelRequest({label, kind: "remix", text})`
(`lib/store/labelInboxStore.ts`), which creates a real conversation
tagged `origin: { type: "producer_request", kind: "remix" }` in the same
`conversations`/`messages` data producers see in their own inbox. The
label-manager side of this is just a **new view over data that's already
being written** — filter conversations where `peer.type === "label"` and
`origin.kind === "remix"`, scoped to the active label. No new store, no
new mock data.

**Update**: `remixOpportunities` no longer exists as a separate field —
it was merged into `activeContests` (`docs/feature-contest-flow.md`,
"Merging remix opportunities into contests"), since it turned out to be
the same concept as a contest with none of the actual delivery mechanics
(no way to get stems at all). What's still missing is the same gap,
just against the merged shape: which tracks are up for remix at all
(`ProtonLabel.activeContests`) is static per-label mock data today
(`lib/mock/labels.ts`), with no admin UI to create one. The inbox can
show incoming requests immediately; turning a request into an actual
approval (closing the loop with the 2-step artist-consent gate,
`lib/contests/remixConsent.ts`) needs a write action added to this new
page.

## 3. Contest creation

`ActiveContests.tsx` only **displays** `label.activeContests` (shape:
`{id, title, description, deadline?, prize?}`, `types/label.ts`) and lets
a producer enter, which itself is just another `sendLabelRequest(kind:
"contest")` call — same inbox mechanism as remix requests. There is no
authoring UI anywhere; contests are hand-written into `lib/mock/labels.ts`
per label. Proposed: a form (title, description, deadline, prize) on the
label-manager side that writes into the same `activeContests` array the
producer-facing card already reads — the display component doesn't need
to change at all, only where the data comes from.

**Superseded/expanded by `docs/feature-contest-flow.md`**: a closer look
at the producer-facing side (researched against LabelRadar's real contest
flow) found the entry mechanism itself is much thinner than "real flow"
implied — no actual file submission, no reference to a real track, no
winner selection. That doc redesigns the producer-facing contest page
(track info, stems, a real upload) and reshapes `activeContests` to carry
a `trackId` + structured `prizes`/`rules`. This section's "creation form"
still applies on top of that reshaped data — a label-manager still needs
to author a contest — but the shape being authored changes.

## 4. Demo policy management

`DemoPolicyCard.tsx` **displays** `label.demoStatus`, `demoGenres`, and
`demoPolicy: {preferredFormat, estimatedResponseTime, notes}` — all
read-only, all static per-label mock data. No settings surface touches
these fields anywhere, including `catalog/page.tsx` (which manages
releases/tracks, a different data domain entirely, not label-level
policy). Proposed: a settings section — toggle open/closed, edit accepted
genres, edit the policy fields — that again just changes *where the same
fields DemoPolicyCard already renders* come from, producer-facing
component untouched.

## The common shape across all four

Every one of these is "add a write path (and in one case, a new mock
pool) feeding a display component that already exists and already works
correctly on the producer side." None of them require touching
`DemoPolicyCard`, `ActiveContests`, or `RemixOpportunities` — the
producer-facing read side is already correct and stays that way. That's
worth keeping true during implementation: these are label-manager-only
additions, not a redesign of anything a producer currently sees.

## Open questions

1. **Where do these live in the label-manager shell?** New top-level nav
   items (sidebar/bottom nav) alongside Catalog/Revenue/Roster/Statements,
   or grouped under one new "Outreach" or "Manage" section? Four new
   standalone pages would meaningfully grow the label-manager nav, which
   today has exactly four items total.
2. **Artist suggestions data**: is "openness to being scouted" something
   every artist in the roster mock should get (an `openToLabelOutreach`
   flag next to the existing `openToCollab`/`openToRemix`), or a separate
   pool of not-yet-signed artists distinct from `rosterArtists.ts`
   entirely?
3. **Remix inbox scope**: should it show only requests still awaiting a
   response, or the full history (including ones already answered via
   chat)? Bearing in mind the same conversation the request created is
   also where the label would actually reply — is this page a queue that
   deep-links into that same chat, or does the label-manager currently
   have no chat/inbox equivalent at all to link into? (Worth checking
   before deciding this needs its own reply UI vs. reusing the existing
   conversation thread component.)
4. **Contest/demo-policy writes**: persisted via a new label-manager
   zustand store (mirroring `labelInboxStore`'s pattern), or held in the
   same place `lib/mock/labels.ts` already lives, mutated in memory like
   `useContractsStore` does for signing? Affects whether changes survive
   a reload.

## Status

All four implemented:

1. Artist suggestions — `app/(dashboard)/dashboard/(label-manager)/scouting`,
   `lib/store/label-manager/artistSuggestionsStore.ts`.
2. Remix requests inbox — `app/(dashboard)/dashboard/(label-manager)/requests`,
   reading the existing `useLabelInboxStore` conversations.
3. Contest creation — `app/(dashboard)/dashboard/(label-manager)/contests`,
   `lib/store/label-manager/contestsStore.ts`, merged into producer-facing
   reads via `lib/contests/useLabelContests.ts` (so `ActiveContests`,
   `ContestDetailClient`, and `TrackRemixCard` don't need to change).
4. Demo policy management — `app/(dashboard)/dashboard/(label-manager)/demo-policy`,
   `lib/store/label-manager/demoPolicyStore.ts`, merged in via
   `lib/labels/useEffectiveLabel.ts` at the single point
   (`LabelProfileClient`) that resolves a label and passes it to
   `LabelDetailHeader`/`DemoPolicyCard`/the submit-demo gate. **Known gap**:
   Browse/Discover list badges (`SearchResults`, `LabelRow`, `FeaturedCard`,
   the Labels tabs/genre pages) still read `label.demoStatus` straight off
   the static mock array, so an edit shows up on the label's own detail
   page but not yet on those list views — same merge pattern would need to
   be applied there too.

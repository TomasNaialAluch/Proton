# Unified chat inbox — one list, tagged by where each conversation came from

## The ask

Every "request" flow in the app (remix request, contest entry, collab
pitch, intro, direct label outreach, a producer-to-producer match) ends
up as a chat conversation somewhere. The ask: one page listing all of
them, each tagged with *why* that conversation exists, so — the concrete
example given — if a label likes a contest remix, the follow-up
conversation just shows up there like anything else, tagged
appropriately, instead of needing its own dedicated surface. The starting
point is what already exists under Connections' message list.

## What's already unified — the data model

Better foundation than expected: there's already **one shared type**
covering every case. `ConversationOrigin` (`types/message.ts`) is a
four-variant union — `connection` (producer↔producer match),
`submission` (demo accepted), `label_outreach` (label reached out first),
and `producer_request` with `kind: "intro" | "collab" | "remix" |
"contest"`. Every conversation in the app, regardless of what created it,
already carries this tag. The "etiqueta de dónde viene el chat" the user
is asking for **already exists as data** — it's just never rendered
anywhere.

Every producer-initiated request funnels through one function,
`sendLabelRequest` (`lib/store/labelInboxStore.ts`), called from five
places: `RequestToConnectForm.tsx` (intro), `ArtistCollabCard.tsx`
(collab), `TrackRemixCard.tsx` and `RemixOpportunities.tsx` (remix, two
different entry points into the same request kind), and
`ContestSubmitCard.tsx` (contest, carrying the file as a
`ContestEntryAttachment`). All five write into the same
`conversations`/`messages` arrays. If a label replies to any of them —
including "we liked your contest remix" — that reply lands in the exact
same conversation the request created. **This already works today**,
confirmed while building `docs/feature-contest-flow.md`: no new plumbing
needed for the scenario in the ask, it's a rendering/presentation problem
of an already-correct data model.

## What's actually fragmented — two pages, two data sources, no tags

This is the real finding. Today there are **two separate conversation
list pages**, and they don't just look different — they read from
genuinely different sources:

- **Connections' "Messages" tab** (`app/(dashboard)/dashboard/(producer)/connections/page.tsx`)
  filters for `peer.type === "producer"` and imports `mockConversations`
  **directly from `lib/mock/messages.ts`** — a frozen, static snapshot,
  not the live store.
- **Labels → Messages** (`app/(dashboard)/dashboard/(producer)/labels/(tabs)/messages/page.tsx`)
  filters for `peer.type === "label"` and reads `useLabelInboxStore` —
  the live, mutable version of the same underlying array shape.

Both pages are filtering the same *kind* of data down to one peer type
each, from two different copies of it. A new label conversation created
by any of the five `sendLabelRequest` call sites above — a remix
request, a contest entry, a label replying — updates the live store and
is correctly visible on the Labels page. It would **never** appear on
Connections' Messages tab even if it were a producer-peer conversation
(it can't be, `sendLabelRequest` only creates label peers), because that
page never reads the live store at all.

**Neither page tags anything.** Checked both list renderers directly:
each uses one generic `MessageCircle` icon for every row, no badge or
label keyed off `origin.type` or `origin.kind` anywhere. The shared
`ConversationThread` component (used by both chat detail routes) is the
same story — it only branches on `attachment.type` (contract vs. contest
entry), never on `origin`.

**One more real gap**: demo submissions (`labelSubmissionsStore.ts`) are
a fully disconnected system — zero references to `Conversation` anywhere
in that store. A submission-origin conversation only appears as a UI
fallback inside the chat detail page once a submission's status flips to
`accepted`/`listening`; no real `Conversation` object is ever created for
it. If this becomes a unified inbox, submissions need to actually join
the same data model, not stay a special-cased exception.

## Proposed shape

**One list, not two.** Merge Connections' Messages tab and Labels →
Messages into a single page reading the live `useLabelInboxStore`
(dropping the frozen `mockConversations` import entirely — that's the
one genuine bug-fix in here, not just a design choice). Every
conversation — producer peer or label peer, any origin — shows up in one
place, newest activity first, same as either page already sorts today.

**Origin tag per row** — a small icon + label, derived directly from
`origin` (already on every `Conversation`, no new field needed):

| `origin` | Tag | Icon (matching existing per-feature colors) |
|---|---|---|
| `connection` | "Connection" | `Users`, violet — matches Connections' existing palette |
| `submission` | "Demo submission" | `Send`, accent |
| `label_outreach` | "Label reached out" | `Building2`, teal — matches `TrackDetailHeader`'s label icon |
| `producer_request`, `kind: "intro"` | "Intro request" | `MessageSquareText` |
| `producer_request`, `kind: "collab"` | "Collab request" | same violet as `ArtistCollabCard` |
| `producer_request`, `kind: "remix"` | "Remix request" | same violet as `RemixOpportunities`/`TrackRemixCard` |
| `producer_request`, `kind: "contest"` | "Contest entry" | same amber as `ActiveContests` |

Reuses colors each origin's *source* feature already established
elsewhere in the app (remix = violet everywhere, contest = amber
everywhere) — a conversation tagged "Remix request" should look related
to the violet remix cards it came from, not introduce a new palette.

**Filter by tag**, not just a flat list — same `FilterDropdown` component
already used on Discover/label releases, so a producer with a lot of
conversation history can jump straight to "just my contest entries" or
"just direct label outreach."

**Submissions join the same model**: `labelSubmissionsStore.submitTrack`
should create a real `Conversation` (`origin: {type: "submission",
submissionId}`) at submit time, not wait for a status change and fake it
in the UI — same pattern the other five request kinds already follow.

## Resolved decisions

**1. Where the merged page lives**: not a single new nav entry —
**both** existing entry points stay (Connections' Messages tab, Labels →
Messages), but both point at the same underlying page/data, each opening
with a different default filter (Connections → `peer.type === "producer"`,
Labels → `peer.type === "label"`). A "show everything" filter option is
available from either entry point. Deliberately not a full merge into one
undifferentiated list: Connections and Labels already represent two
distinct mental contexts for the producer (people vs. labels), and
dropping a contest entry into the middle of "did anyone accept my
connection" would be a regression, not an improvement. The actual bug —
Connections reading a frozen `mockConversations` import instead of the
live store — gets fixed either way, since both entry points now read the
same live source.

**2. Tag click destinations** — resolved per-origin, not one generic
rule:

| Tag | Click destination |
|---|---|
| Contest entry | The contest detail page (`contestId` already on `ContestEntryAttachment`) |
| Collab request | The artist's profile (Artist Detail) |
| Remix request, Intro request, Demo submission, Label reached out | The label's page |
| Connection | No extra destination needed — the peer's name in the row already identifies the conversation, nothing else to link to |

**A real gap found while resolving this**: collab requests don't
actually carry a structured artist reference anywhere today —
`ArtistCollabCard.tsx`'s `sendLabelRequest` call only bakes the artist's
name into free text (`` `Collab request re: ${artist.name} — ${pitch}` ``).
Making "Collab request" clickable to the right artist profile needs a
small fix first: add an `artistId` field alongside `contestId`/`trackId`
on the request (either a new optional field on `ConversationOrigin`'s
`producer_request` variant, or a lightweight attachment like
`ContestEntryAttachment`'s pattern) — not buildable from today's data
as-is.

**3. Label-manager**: same page, same data, not a separate build. The
remix/contest inbox planned in `docs/feature-label-manager-toolkit.md`
(#2) **is** this unified inbox, viewed from the label's side (filtered to
that label, showing what producers sent in) — avoids building two
list-of-conversations systems that both end up reading
`useLabelInboxStore`.

## Status — implemented (producer side)

Built: `types/message.ts` (`producer_request` origin now carries optional
`artistId`, set only for `kind: "collab"`), `labelInboxStore.sendLabelRequest`
(accepts `artistId`), `ArtistCollabCard.tsx` (passes `artist.id`),
`lib/messaging/conversationTag.ts` (the origin → {label, icon, color, href}
resolver, one function covering all seven tag variants), and
`components/dashboard/messaging/ConversationList.tsx` (the shared list:
People/Labels/All toggle, a `FilterDropdown` for tag filtering, each row's
tag rendered as its own click target separate from the row). Both
Connections' Messages tab and Labels → Messages now render this same
component against the same live `useLabelInboxStore` data — the frozen
`mockConversations` import Connections used to read is gone.

Verified end-to-end in-browser: every existing conversation shows the
right tag and color (Bedrock/"Remix request" violet, Toxic Astronaut/
"Contest entry" amber, Dear Deer Music/"Demo submission", Hope Recordings/
"Label reached out" teal, Darko/"Connection"); clicking a tag routes
correctly per the resolved table (Contest entry → the actual contest
page, Remix request → the label page); sent a fresh collab request to
Sudbeat (a label with no prior conversation) and confirmed both that its
tag reads "Collab request" and that clicking it opens GMJ's artist
profile, not a chat. Also reproduced the already-documented "kind reflects
only the first message" limitation live: sending a second, different-kind
request to a label that already had an open conversation (Bedrock, which
already had a remix-request thread) correctly kept showing "Remix
request" even after a collab message was appended — expected, not a bug,
matches the caveat written into the `ConversationOrigin` type comment.
"All" filter on both entry points confirmed to show the exact same
unified, mixed list.

**Not built in this pass**: `labelSubmissionsStore` still doesn't create
a real `Conversation` at submit time (the "submissions join the same
model" fix from "Proposed shape" above) — demo-submission conversations
still only appear via the pre-existing chat-detail fallback. Label-manager's
own side of this inbox (`docs/feature-label-manager-toolkit.md` #2) is
also still open — this pass only covers the producer-facing two entry
points.

## Follow-up: opening a chat had no way back

Reported separately: opening any conversation had no Back button at
all — only a breadcrumb whose links went to generic parent pages
(`/dashboard/labels` Browse, or Connections defaulting to its Suggestions
tab), not back to the actual messages list. Getting back to open a
*different* chat meant going all the way to Dashboard first.

Fixed the same way every other detail page in this app already works
(`docs/README-navigation-back-flow.md`): `ConversationThread.tsx` now
takes a `backHref`/`backFallback` pair and renders a real `BackButton`.
`ConversationList.tsx` builds each chat link with `?from=` pointing back
at its own current URL — including query string, not just the path, so
the People/Labels/All choice doesn't matter here (that's local state,
not persisted) but a synced concern still needed solving: Connections'
Suggestions/Messages toggle was local `useState` only, not reflected in
the URL, so "back to Connections" always landed back on Suggestions
regardless of which tab you'd actually left from. Fixed by syncing that
toggle to `?tab=` (`router.replace` on tab change) so it round-trips
through the chat and back correctly.

Also fixed in passing: `connections/chat/[id]/page.tsx` was still reading
the frozen `mockConversations`/`mockMessages` import, the same stale-data
bug already fixed on the list page — brought in line with the live store.

Verified in-browser: opened a label chat from Labels → Messages, hit
Back, landed back on the exact list (not Dashboard); opened a second,
different chat directly from there with no detour; same round trip
confirmed on Connections specifically through the tab-loss scenario —
opened Darko's chat from the Messages tab, hit Back, and landed back on
Messages, not Suggestions.

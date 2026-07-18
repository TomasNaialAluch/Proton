# Contest flow — from a decorative card to a real remix contest

## The ask

"Contest" today is a dead click — see `docs/feature-label-manager-toolkit.md`'s
critique: a card with title/description/deadline/prize and a button that
just sends a text message ("I'd like to enter X"), no real submission, no
track reference, no winner. The ask: look at how LabelRadar (a real,
established platform for exactly this) runs contests, take what's
pertinent, and design a real flow — track info, rules, stem download,
remix upload — adapted to Proton's situation: **the label already owns
the rights to the track** (it's their own catalog, not a licensed
outside track), and the goal is purely "get a good remix for a real
release," not community engagement.

## What LabelRadar actually does

Checked the real site (`labelradar.com`, via its Contests hub and one
full contest — "MaRLo - The Decade Remix Contest"). Structure, concretely:

**The contest hub** (list of open contests) — each entry has: a cover
image, status badges (`NEW`/`OPEN` + a live countdown — "time left 18
days 12 hours"), title, the hosting label's name with a verified badge,
a free-text description, a **Prizes** section (usually tiered: winner /
2nd / 3rd / top 10, sometimes hardware or software bundles instead of a
release), a rules/eligibility list (genre restrictions, "no AI-generated
entries," "one entry per person," "must have rights to all samples used,"
sometimes a required Discord join or social-media share), key & BPM of
the original track, a deadline, and two separate buttons: **View
Contest** and **Download Stems**.

**The contest detail/submission page** — same header (cover, label,
badges, title), then a small tabbed widget: an **Info** tab (the same
description/prizes/rules), a **Submit** tab — a drag-and-drop uploader
("Drop your track — MP3 or WAV. By uploading, you agree to the Terms" +
an "Add New Track" button) — and a separate **Download stems** icon
button. That's the whole page. Submission is one file, attached to that
specific contest, nothing more.

**The community layer** (LabelRadar's homepage — "Artist Activity",
"shortlisted 4 mins ago", public chat-entry logs, trending artists) is a
visible, competitive, social feed layered on top of all of this —
everyone can see who got shortlisted, who's active, who's trending.

## What's pertinent to Proton, and what isn't

**Pertinent — the actual mechanics:**
- A page anchored to a real track's stems, a deadline, and whatever
  terms the label wrote, with **Info** and **Submit** as the only two
  things on the page.
- Submission is a single file upload against that specific remix call,
  not a formless "I'd like to enter" message.

**Not pertinent — the community/competitive layer, and that includes the
whole "competition" framing itself, not just the public visibility part.**
Corrected mid-design after pushing this too literally: this is **not a
contest with a winner and placements** (no 1st/2nd/3rd, no prize tiers,
no "winners announced" moment). The label isn't running a competition to
generate community engagement — it's putting up a track (or several —
however many the label decides, at their own discretion) it wants
remixed, to see if a producer's take is good enough to actually release
and sell. That's a **remix call**, not a contest. Same underlying
mechanics as LabelRadar (stems, a real track, a real upload) but without
importing the game-show shape (tiered prizes, ranked places, a public
winner announcement) that LabelRadar's actual business model needs and
Proton's doesn't. Also not pertinent, separately: the public
visibility/community layer (public shortlist announcements, trending
artists, social proof) — same "connection over comparison" reasoning
already established for rejecting Beatport's Charts/Top Ten in
`docs/README-routing-architecture.md`. **No public feed of who submitted,
whose remix got picked, or how many entries exist.** Entries stay private
between the submitting producer and the label.

## The one structural fix that matters most

LabelRadar's contests are usually for tracks the host label is **licensing
in** for the occasion (Roger Sanchez ft. Melanie C, a UMG-distributed
single, etc.) — so a free-text description of the original track is all
LabelRadar can do; there's no shared catalog to link to. **Proton's
situation is different and better**: the contest is for a track the
label already owns and that already exists as a real `Track` in this
app's own catalog, with real `bpm`/`key`/`genre`/`duration` fields
(`types/track.ts`). There is no reason for a Proton contest to describe
its track in prose the way LabelRadar has to — it should reference a real
`trackId`, the same way `remixOpportunities` already does
(`ProtonLabel.remixOpportunities: {id, trackId, deadline?}[]`,
`components/dashboard/producer/labels/detail/RemixOpportunities.tsx`).

**Update, after design review**: Proton had **two disconnected "remix a
label track" mechanisms** — `remixOpportunities` (structured, `trackId`-
based, real 2-step label+artist approval, but no way to deliver stems)
and `activeContests` (freeform text, no track reference, but real stems
+ upload). The first draft of this doc kept them "parallel, not nested" —
wrong call, corrected in "Merging remix opportunities into contests"
below: they're the same concept (the label wants remixes of a track it
owns) and are now **one system**. `remixOpportunities` no longer exists;
the 2-step artist-consent gate now applies to every `activeContests`
entry.

## Proposed shape for Proton

**Data model — minimal change, not a wholesale restructure.** Extend
`ProtonLabel.activeContests` (`types/label.ts`) with just one new field:
`trackId: string`, linking to the real track being remixed. `title`,
`description`, `deadline?`, and `prize?` all stay exactly as they are —
free text, however the label wants to phrase it ("possible official
release," or nothing at all if there's no formal prize). No `prizes`
tiers, no `rules` array, no ranked-places structure — that's LabelRadar's
game-show shape, not what this is. The label decides how many tracks to
put up for remix and on what terms, entirely at their own discretion;
the doc's earlier draft over-imported LabelRadar's literal structure here
and that was a mistake, corrected during design review.

**Contest detail page** (new route — e.g.
`/dashboard/labels/[slug]/contests/[contestId]`) — composed from pieces
that already exist:
- Track info: reuse `TrackDetailHeader`'s pattern (cover, genre/BPM/key/
  duration chips) for the track being remixed — the label already has
  this data, no new fields needed beyond the `trackId` link above.
- The label's own free-text pitch, deadline, and prize (if any) — as
  written, no forced structure.
- **Download stems**: a real button, honestly stubbed — this prototype
  has no real audio infrastructure anywhere (`audioUrl` is `""` on every
  mock track, documented in `docs/feature-track-detail.md`), so this
  can't download a real ZIP. Label it accordingly, same honesty
  convention as `LABEL_DEMO_CATALOG_NOTICE` elsewhere in this codebase —
  not worth faking a fake file. Disappears once the deadline passes —
  confirmed with the user: after that point, download access ends
  outright (not left up read-only). *Separately open: how producers who
  did submit get told what happened next — deliberately not decided yet,
  see below.*
- **Submit your remix**: reuse `SubmitTrackForm.tsx`'s existing,
  already-working file-upload pattern (`.wav`/`.mp3` validation, size
  limit, file metadata capture) instead of inventing a new uploader —
  same drag-and-drop-shaped job LabelRadar's "Drop your track" does.
  Submitting sends a message carrying a `contest_entry` attachment (see
  the label-manager section below for the exact shape) instead of just
  free text — extending the existing `labelInboxStore` request mechanism
  — so the label side actually receives something to review and can tell
  which contest it belongs to, not just a sentence. One submission per
  producer per contest, no
  replacing it once sent (confirmed with the user) — matches
  LabelRadar's most common rule, and keeps this simple rather than
  building resubmission handling for a first version.

**Fixing the dead click**: `ActiveContests.tsx`'s card currently has
"Enter contest" call `sendLabelRequest` directly, in place. That flow
gets replaced — the card links to the new contest detail page above
instead (matching how `RemixOpportunities.tsx`'s row already links out
to `TrackDetailClient` rather than doing anything inline).

**No winner-selection UI.** Since this isn't a ranked competition, there's
no "mark as winner" step to design — the label just reviews whatever
comes in (via the remix inbox in `docs/feature-label-manager-toolkit.md`)
the same informal way they'd evaluate any demo, and decides what to do
with it (release it, reach out, pass) entirely outside any contest-specific
mechanism.

## Why this exists at all — the incentive on both sides

Worth stating plainly, since it shapes what "after the submission" needs
to do: for the label, this is a zero-cost way to find a remix worth
signing and releasing — get several takes on a track they already own,
pick the one that could actually sell. For the producer, it's not a game
— it's a real shot at getting into a label they want to work with, or
just "let's see if I can pull off a good remix of this." Neither side is
here for a leaderboard. That's the reasoning behind rejecting the ranked/
tiered structure above, made explicit: the whole feature is really a
**scouting channel**, the same underlying goal as the artist-suggestions
feature in `docs/feature-label-manager-toolkit.md` (#1) — just a
different entry point (an existing track the label owns, vs. an artist
the label doesn't have yet).

## Full lifecycle, end to end

Traced every step from submission to "the label wants to sign this," to
find what already works and where a notification actually needs to exist:

1. **Label creates the remix call** (toolkit #3 — a new label-manager
   authoring surface) against a `trackId` they own, writing into
   `label.activeContests`.
2. **Producer discovers it** on Label Detail (`ActiveContests`, already
   built) → clicks through to the new contest detail page (this doc) →
   downloads stems, uploads a remix.
3. **Submission** calls `sendLabelRequest({label, kind: "contest", ...})`
   — same mechanism already used for remix requests, collabs, and intros.
4. **The label needs to find out a submission arrived.** This is a real,
   currently-nonexistent notification — and it's the natural first real
   entry for `labelManagerWelcomeItems()` in
   `docs/feature-session-welcome-modal.md`, which returns `[]` today
   specifically because no label-manager-facing "needs your attention"
   signal exists anywhere yet. A new contest/remix submission is exactly
   that signal — this feature is what finally gives that empty function
   something real to return.
5. **Label reviews it** via the remix/contest inbox (toolkit #2) and
   opens the conversation the submission created — the existing
   `ConversationThread` UI, no new component needed.
6. **Label replies informally** in that same thread — again, nothing new,
   just using the messaging system as it already works.
7. **Producer needs to find out the label replied.** Checked for this
   specifically: **there is no unread/read tracking anywhere in the
   messaging system.** `ChatMessage` (`types/message.ts`) has no `read`
   field at all — unlike `Feedback`, which does (`read: boolean`,
   `lib/mock/feedback.ts`). Today, a producer only finds out about a
   reply by manually reopening Connections/Messages. This also means
   `docs/feature-session-welcome-modal.md`'s "label reached out and is
   waiting on your reply" detection (scoped to `origin.type ===
   "label_outreach"`) **wouldn't catch this case** — a reply inside a
   `producer_request`-origin conversation (which is what a contest entry
   creates) is invisible to that logic today. Real gap, not yet solved by
   anything in either doc.
8. **If the label wants to move forward, they hand over a contract** —
   and this part is already fully real: `ChatMessage.attachment: {type:
   "contract", contractId, contractLabel}` is exactly how the JIK / Dear
   Deer Music example already works in `lib/mock/messages.ts` (message
   `msg-jik-5`) — a label handing a contract to a producer inside the
   same conversation. No new mechanism needed; a promising remix just
   needs to end in the same kind of message that already exists for
   "here's your contract."
9. **Producer sees the pending contract** — already tracked everywhere
   this session touched: the amber nav dot, `NotificationsPanel`, and
   `SessionWelcomeModal`'s first category all already watch
   `status === "pending_signature"`.

**One more real gap, found while tracing this**: `sendLabelRequest`
reuses whatever conversation already exists with that label
(matched by `label.slug` alone) rather than starting a fresh one per
request kind. So a contest entry sent into a conversation that already
exists for some other reason (a past collab chat, say) won't be cleanly
identifiable as "a contest entry" — `Conversation.origin` is set once,
at the conversation's creation, and doesn't update per-message. Filtering
the toolkit's remix/contest inbox purely by `origin.kind` will miss
entries that landed inside an older, differently-originated thread. Not
a blocker for a first version (most contest entries will be a producer's
first-ever contact with that label, creating a fresh conversation
normally), but worth knowing before trusting that filter completely.

## Producer side — the contest detail screen, laid out

Route: `/dashboard/labels/[slug]/contests/[contestId]`, reached from
`ActiveContests` on Label Detail. Follows the same composer +
`?from=`-chained-back pattern as Track/Artist Detail
(`docs/README-navigation-back-flow.md`) — `BackButton` returns to
wherever the user actually came from, breadcrumb reads `Dashboard >
Labels > {label} > {contest title}`.

Top to bottom, one column, matching Track Detail's card-stack layout:

1. **Header card** — label's `AvatarGradient`, label name (links to Label
   Detail), contest title, a status pill (`Open` in accent green / amber
   "Closes in 4 days" once inside some threshold / `Closed` in neutral
   gray once the deadline passes — same three-state pattern
   `LabelDetailHeader`'s demo-status badge already uses), and the
   deadline date spelled out.
2. **Track card** — literally `TrackDetailHeader`'s existing layout
   reused as a compact card (cover art, title, credited artist link,
   genre/BPM/key/duration chips), linking through to the real Track
   Detail page. This is the piece LabelRadar can't have (no shared
   catalog) and Proton gets for free once `activeContests` carries a
   `trackId`.
3. **The label's pitch** — `description`, exactly as written, no
   reformatting.
4. **Prize** (only rendered if `prize` is set) — one line, plain text,
   no icon-badge treatment implying "this is a formal reward tier."
5. **Stems** — a bordered row, download icon, honestly labeled ("Stems —
   prototype, no real audio asset" tooltip, same honesty convention as
   `LABEL_DEMO_CATALOG_NOTICE`), disabled once the contest is closed.
6. **Submit your remix** — only rendered while `view === "producer"` and
   the contest is open (mirrors `ActiveContests`' existing
   `view === "producer"` gate). Reuses `SubmitTrackForm.tsx`'s file-drop
   UI verbatim: drag-and-drop zone, `.wav`/`.mp3` validation, size limit,
   a filename chip once selected, a submit button. After submitting, the
   card flips to the same "Entry sent — view conversation" confirmation
   `ActiveContests`' `ContestEntry` already renders today, linking into
   the conversation the submission created.
7. **Closed state** (once the deadline passes) — the stems row and
   submit card both disappear, replaced by one neutral line: "This remix
   call has closed." No results, no "see who won" — nothing to browse,
   consistent with no public visibility anywhere in this feature.

## Producer side — notifications, concretely

Three separate signals, each reusing a different piece of plumbing that
already exists rather than inventing a new notification type per event:

**"A label you follow just opened a remix call."** `mockLabelNews`
(`lib/mock/labelNews.ts`) already drives a real `NotificationsPanel`
entry for new releases from followed labels
(`labelFollowsStore`-gated, `NotificationsPanel.tsx`'s
`labelNewsNotifications`). A new contest is the same shape of event —
add a `"new_contest"` news type alongside the existing `"new_release"`
one, same follow-gating, same notification row, just a different icon
(`Trophy`, matching `ActiveContests`' existing icon choice) and `href`
pointing at the new contest detail route. No new store.

**"Your submission got a reply."** This is the read/unread gap already
flagged above — genuinely can't be built honestly until `ChatMessage`
gets a way to know whether the producer has seen the latest message in a
conversation. Once that exists, this becomes a third derived
notification source in `NotificationsPanel` (alongside
`contractNotifications` and `labelNewsNotifications`) and a fifth
category in `SessionWelcomeModal`'s `producerWelcomeItems()` — generalize
that function's existing label-outreach detection (today scoped to
`origin.type === "label_outreach"`) to **any** conversation whose latest
message is `fromMe: false` and unread, which naturally covers contest
replies too without a contest-specific rule.

**"You've been sent a contract."** Already real, already flows through
every existing surface (nav dot, `NotificationsPanel`, welcome modal) —
nothing new to build here, just confirming the chain holds: contest
submission → label reply → contract attached → producer notified, and
every link past the first is already-shipped code.

## Label-manager side — creating and managing a contest

No page like this exists today (confirmed in
`docs/feature-label-manager-toolkit.md`) — this is genuinely new surface,
scoped to `labelScopeStore.activeLabelId` the same way `catalog`/
`revenue` already are.

**List view** (e.g. `/dashboard/contests`, label-manager shell) — one row
per contest on the active label: track cover thumbnail + title, status
(Open/Closed, same three-state pill as the producer-facing page),
deadline, and an entry count. That entry count is exactly where the
message-level gap identified earlier bites: today there's no reliable
way to count "how many submissions belong to contest X" separately from
every other message in a conversation. Fixing it is small — extend
`ChatMessage.attachment` with a new variant alongside the existing
`{type: "contract", ...}` one:

```ts
| { type: "contest_entry"; contestId: string; trackId: string;
    fileName: string; fileType: string; fileSize: number }
```

`sendLabelRequest` (or a small new `submitContestEntry` alongside it)
attaches this to the message it creates. Now a submission is
identifiable by `contestId` regardless of which conversation it landed
in, the contest list can count entries with a simple filter, **and** the
message renders as a real attachment card in the thread (same pattern
`ChatMessage.attachment.type === "contract"` already gets in
`ConversationThread`), instead of a plain sentence.

**Create/edit form** — the fields match the trimmed data model above,
deliberately short: pick a track (a searchable select scoped to the
label's own catalog — `LABEL_SAMPLE_TRACKS` filtered by that label's
slug, the same source `ActiveContests`/`RemixOpportunities` already
read), title, description (free text), deadline (date picker), prize
(optional free text). No prize-tier builder, no rules builder — matches
the trimmed shape decided above. Saving writes into
`label.activeContests`.

**Closing a contest**: computed from `deadline` passing, not a manual
"end contest" action — simpler, and avoids the label needing to remember
to close something. (`docs/feature-label-manager-toolkit.md`'s open
question about *where in the label-manager nav this and the other three
tools live* still applies here — not re-litigated in this doc.)

**Reviewing entries**: the list view's per-contest entry count links into
the toolkit's remix/contest inbox (#2), pre-filtered by that `contestId`
— the same `ConversationThread` UI producers use, just opened from the
label's side, with the `contest_entry` attachment rendering the filename/
track context inline.

## What this doc is NOT solving (tracked, not designed)

- The read/unread gap in (7) — needs its own small design pass (probably
  a `read: boolean` on `ChatMessage`, mirroring `Feedback`'s existing
  field, plus wiring `NotificationsPanel`/`SessionWelcomeModal` to watch
  for it) before "producer gets notified of a reply" is real.
- The label-manager-side notification in (4) is the toolkit doc's job
  (`docs/feature-label-manager-toolkit.md`), not this one — this doc just
  identifies that a contest submission is the trigger.

## Status — producer side implemented

Built: `types/label.ts` (`activeContests` now carries `trackId`),
`types/message.ts` (`ContestEntryAttachment` alongside `ContractAttachment`,
unioned as `MessageAttachment`), `lib/mock/labels.ts` (the one seeded
contest moved from Proton Music — which owned no real track — to Toxic
Astronaut, the actual owner of "Living"), `labelInboxStore.sendLabelRequest`
(accepts an optional `attachment`), `ConversationThread.tsx` (renders
either attachment type), the new
`app/(dashboard)/dashboard/labels/[slug]/contests/[contestId]/` route +
`ContestDetailClient.tsx`, `ContestSubmitCard.tsx` (the reused
drag-and-drop uploader), and `ActiveContests.tsx` (now a plain link card,
dead click fixed).

**A second real bug found and fixed along the way, unrelated to this
feature's own code**: verifying the label-manager side of the new page
revealed `/dashboard/labels/{slug}` was being redirected away entirely
for `view === "label_manager"` — `isProducerShellPath`
(`lib/dashboard/dashboardShellRouting.ts`) classified the whole
`/dashboard/labels` prefix as producer-only, contradicting
`docs/README-routing-architecture.md`'s already-established rule that
Label Detail is a universal page. Fixed by narrowing that check to only
catch `/dashboard/labels` itself (Browse) and the producer-scoped
sub-workflows (`submissions`, `messages`, `chat`) — a specific label's
own page and its `releases`/`roster`/`contests` sub-routes are exempted.
Verified both directions still hold: `/dashboard/labels` and
`/dashboard/labels/submissions` still redirect a label-manager session;
`/dashboard/labels/toxic-astronaut` and the new contest page no longer do.

Verified end-to-end in-browser: track card shows real data ("Living
(Original Mix)", Naial, Melodic House, 124 BPM, F# min), status pill
computes correctly from the deadline, stems button is disabled and
honestly labeled, submitting a file produces a real message in the
conversation with the file rendered as an attachment card (not free
text), and the `view === "producer"` gate correctly hides the submit
card for a label-manager session while leaving the rest of the page
(track info, description, prize, stems) visible to both.

**Not built in this pass** (still open, tracked above): the
label-manager authoring/list/entry-review side (`docs/feature-label-manager-toolkit.md`
#2 and #3), the read/unread notification gap, and the `new_contest`
label-news notification.

## Follow-up: merging remix opportunities into contests

Caught after the pass above shipped: `remixOpportunities` (the older,
separate "label pre-approves a track for remix, 2-step gate with the
artist" system — `RemixOpportunities.tsx`, `TrackRemixCard.tsx`'s
original version) and `activeContests` were never actually the same
concept in the code, even though they're the same concept in reality —
"the label wants remixes of this track." Two real problems, caught by
the user, not by any check of mine:

1. **`remixOpportunities`'s "Request to remix" had no way to deliver
   stems at all.** It sent a text message — that's it. A producer
   approved through that flow had no way to actually get the audio to
   remix. Not a corner case, a structurally broken flow: you cannot
   remix a track you were never given.
2. **They were never asked to be two different kinds of contest.** A
   remix request *is* a remix contest — the same "the label wants
   remixes of a track it owns" idea. Keeping two separate systems (one
   with real stems/upload, one text-only) for the same concept was the
   "split-personality problem" this doc already flagged earlier and
   didn't actually finish resolving — giving both a `trackId` made them
   the same *shape*, not the same *thing*.

**Fix**: `remixOpportunities` is gone from `ProtonLabel` — deleted, not
deprecated. Every former `remixOpportunities` entry became an
`activeContests` entry instead (Sudbeat's two, Bedrock's one — all in
`lib/mock/labels.ts`). The 2-step approval rule didn't disappear, it
moved: `lib/contests/remixConsent.ts`'s `trackArtistsOptedInToRemix(trackId)`
is now a gate checked against *any* contest, not a separate list.
`ActiveContests.tsx`'s cards show "Awaiting artist" when the gate isn't
passed (same wording, same idea as before) instead of hiding a whole
parallel row. `TrackRemixCard.tsx` on Track Detail was rewritten from
scratch — it now finds the real contest for the track (searching
`mockLabels` for an `activeContests` entry matching `trackId`) and links
straight into the same stems+submission page, instead of sending its own
separate text-only message.

Verified in-browser at both gate states on real data: Bedrock's "Open
Horizons" (Emily Underhill, `openToRemix: true`) shows no "Awaiting
artist" anywhere and its Track Detail card links through to the real
contest page with stems and the submit form; Sudbeat's "Weightless" and
"Fading Signal" (GMJ and Matter, both `openToRemix: false`) show
"Awaiting artist" on the label page, on their own contest detail pages
(no stems/submit rendered, just the status line), and on Track Detail
(no button, just the waiting message) — one gate, checked consistently
in three places, not three different flows to keep in sync.

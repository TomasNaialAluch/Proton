# First-visit-of-session welcome modal — "here's what's waiting on you"

## The ask

A modal that greets the user the first time they land on the dashboard in
a session — before they start clicking around — summarizing the handful
of things that actually need their attention: a contract awaiting
signature, a connection request waiting on an answer. The idea is to
front-load anything with real consequences (a signature, a relationship)
ahead of the rest of the app, which is easier to get distracted by.
Wanted for both producer and label-manager, but producer is expected to
matter more.

## What already exists

**Notifications today are flat, not ranked.** `NotificationsPanel.tsx`
merges three sources with no priority field anywhere: hardcoded mock
notifications, contracts pending signature, and label news the user
follows — concatenated in source order and rendered as one list.
"Important" today just means "happened to be listed first." There's no
concept this modal could reuse as-is; it would need to define its own
"what's worth surfacing" logic from scratch.

**Pending contracts are real, well-shaped data.** `useContractsStore`
(zustand+persist) holds `Contract[]` with `status: "signed" |
"pending_signature" | "expired"`. A pending contract carries a label name,
a release name, a `keyDates` array (including a release deadline), and a
document URL — enough to render a real "Sign your Dear Deer Music
contract" row. The amber pending-dot already lit on Contracts nav items
(sidebar, bottom nav, hamburger) is driven by exactly this same
`.some(c => c.status === "pending_signature")` check, so the modal would
be surfacing the same signal that's already flagged elsewhere, just
earlier and with more context.

**Pending connection requests exist, but aren't stateful.** There's no
dedicated store — the Connections page filters a static mock array
(`mockConnectionSuggestions`) directly for `status === "pending"` on every
render. Accepting/rejecting doesn't persist across a reload today. Each
suggestion does carry a `peerAlreadyAccepted` flag, which is a genuinely
useful distinction for a summary modal ("they already said yes — you'd
match instantly" reads as more actionable than a cold suggestion).

**Label-manager has nothing equivalent to surface — this is the real
gap.** Nothing under the label-manager role models a "needs your
attention" item. The catalog page shows release pipeline status
(live/delivered/qa) as display data, not actionable items. The only
producer→label submission flow (`labelSubmissionsStore`) is read from the
*producer's* side tracking their own submissions — there's no
label-manager-facing review queue ("3 new demos waiting on you") anywhere
in the data model. Confirms the user's hunch that producer matters more
right now: label-manager doesn't just have a *less urgent* version of this
feature, it has *nothing to show* yet.

**No session-tracking mechanism exists anywhere.** Zero uses of
`sessionStorage` in the repo, no onboarding/tour feature to extend. This
would be new plumbing, not a reuse of something already there.

**A modal visual convention already exists and should be matched, not
reinvented.** Two precedents — `YouTubeChoiceModal` and
`DashboardContent.tsx`'s `WidgetManageModal` — both use: fixed backdrop
(`bg-black/55 backdrop-blur-[2px]`), centered `role="dialog"
aria-modal="true"`, `rounded-2xl border border-[var(--color-border)]
bg-surface p-5 shadow-xl`, Escape-to-close and click-outside-to-dismiss.
`app/(dashboard)/layout.tsx` is the shell every dashboard route passes
through (renders `AppSidebar`, navbar, `BottomNav`) — the natural mount
point, as a sibling to those existing modals, gated on
`usePrototypeViewStore().view`.

## Proposed shape

- **Producer**: pull pending contracts (`useContractsStore`, filtered) and
  pending connection requests (`mockConnectionSuggestions`, filtered,
  `peerAlreadyAccepted` ones surfaced first/differently) into one short
  list, each row linking straight to the relevant page (Contracts,
  Connections). Read-only summary + navigation, not an inline
  accept/sign action inside the modal itself — signing/accepting still
  happens on the real page, this is just "here's what's queued."
- **Label-manager**: don't ship a fake or empty modal. Either skip the
  modal entirely for this role until a real pending-items concept exists
  (e.g. a submissions review queue), or treat building *that* concept as
  a prerequisite step, not something this modal can paper over.
- **Trigger**: once per session (`sessionStorage` flag set on first
  render), not once ever and not on every dashboard visit — a session
  reasonably maps to "you just sat down to use the app."
- **Visual**: match the existing modal convention above exactly rather
  than invent a new one.
- **Dismissal**: close / "Remind me next time" — no evidence anywhere in
  this codebase of a permanent "don't show again" pattern to match, so
  that would be a new decision, not a reuse.

## Resolved decisions

**Frequency: once per session (`sessionStorage`).** Resets on tab close —
matches "you just sat down to use the app," not "once ever" or "every
single visit."

**Threshold: any pending item, no urgency filter.** With a handful of
categories today, any signal is worth surfacing — an urgency threshold
(e.g. "only if a contract deadline is within N days") is premature given
`Contract`'s `keyDates` doesn't even have a single normalized deadline
field to filter on yet. Explicitly left open-ended, not fully speculative
either — two more real categories surfaced during this discussion,
**both already backed by real mock data**, no invention required:

- **A label reached out directly, waiting on your reply.**
  `lib/mock/messages.ts` already seeds exactly this:
  `convo-hope-outreach` (`origin: { type: "label_outreach" }`, peer =
  Hope Recordings) has a single message with `fromMe: false` — genuinely
  waiting on the producer's answer. Detectable as: a conversation with
  `origin.type === "label_outreach"` whose latest message has
  `fromMe: false`.
- **Someone left feedback on one of your tracks that you haven't seen.**
  `lib/mock/feedback.ts`'s `mockReceivedFeedback: Feedback[]` already has
  a `read: boolean` field — `fb-1` (feedback from Lume on "Emotional
  Damage") is seeded `read: false` right now. Detectable as:
  `mockReceivedFeedback.filter(f => !f.read)`.

So the producer-side category list is now four, all backed by real,
already-existing data, no fabrication: pending contract signature,
pending connection request, unanswered label outreach, unread feedback.
The list is explicitly meant to keep growing as more "needs your
attention" moments get identified — not a closed set.

**Content: action-required + good news, mixed.** Selected explicitly over
the action-only option — a signed remix approval or similar good news can
sit alongside "sign this contract" in the same summary, not a separate
concern.

**Label-manager: ship the same modal mechanism for both roles, but let
the content be honest about what's real.** Not "defer label-manager
entirely" — build one shared modal component gated by
`usePrototypeViewStore().view` on both sides. The reasoning, in the
user's words: the producer-side categories above are grounded in lived
experience running a real act on Proton, so they're worth getting right
in detail; the label-manager categories would have to be invented from
scratch (no first-hand label-manager experience to draw the same
judgment from), so that side is expected to start thinner/more
speculative and grow later — it's not being skipped, it's just naturally
behind, the same way the rest of the label-manager shell is behind the
producer shell elsewhere in this prototype.

## Status — implemented

`components/dashboard/SessionWelcomeModal.tsx`, mounted in
`app/(dashboard)/layout.tsx` as a sibling to `AppSidebar`/`BottomNav` — one
component for both roles, gated on `usePrototypeViewStore().view`.
`producerWelcomeItems()` computes the four categories above straight from
real store/mock data (no new fields invented); `labelManagerWelcomeItems()`
returns `[]` for now, honestly reflecting that no such data model exists
yet on that side — the modal simply doesn't render when there's nothing
to show, rather than displaying an empty "0 things" card.

Visual convention matches `YouTubeChoiceModal`/`WidgetManageModal` exactly
(backdrop blur, `rounded-2xl` surface, `role="dialog"`, Escape and
click-outside to dismiss). Gating is `sessionStorage`-based, one flag
(`proton-session-welcome-shown`), set the moment the decision is made —
so a mid-session reload doesn't re-show it, but a new tab/session does.

**A real bug surfaced and got fixed during verification:** `view` comes
from a zustand `persist` store, so the very first client render reads the
pre-hydration default (`"producer"`) before `localStorage` has loaded.
Deciding whether to open on that first render — before this fix — computed
`producerWelcomeItems()` (5 items) for what was actually a label-manager
session, opened the modal, and then went stale to an empty "0 things worth
a look" card once hydration flipped `view` to `"label_manager"` a moment
later (`open` was already `true` and nothing re-evaluated it). Fixed by
waiting on `usePrototypeViewStore.persist.hasHydrated()` /
`onFinishHydration()` before making the open/closed decision at all,
re-reading both stores' live `getState()` at that point rather than
whatever the render closure had captured.

Verified in-browser: producer session shows all 5 items (contract, two
connections — one plain suggestion, one `peerAlreadyAccepted` — label
outreach, unread feedback), each row navigates to the right page and
closes the modal; doesn't re-open on a second navigation in the same
session; label-manager session (forced via `localStorage`) shows nothing,
including after the hydration-race fix; Escape closes it; dark mode
renders correctly through the existing CSS-variable theme.

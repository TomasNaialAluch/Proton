# Should we unify "Contracts" (Settings) with "Contracts" (Labels)? — idea-level

Exploratory document, no code. To think through whether it makes sense to merge
the two places where the word "Contracts" currently appears in the dashboard,
or whether they should keep being two separate doors.

## What exists today

**At the data level things are already unified** — there aren't two contract
tables. Everything reads from `lib/mock/contracts.ts` / `contractsStore`. What
is NOT unified is the *navigation*: there are two entry points with different
intent.

**Door 1 — Settings → Pro Access → "Contracts & Reports"**
(`settings/account/pro/page.tsx`). It's a small button next to "Royalties",
inside an account-settings screen. Context: someone who went into Settings to
review their PRO profile, not necessarily to sign anything right now.

**Door 2 — Labels → Contracts** (`labels/contracts/page.tsx`). It's one of
the 3 tabs in the Labels section (Browse / Submissions / Contracts), with an
"awaiting your signature" badge, a list grouped by label, and a detail view
with the PDF reader + signature. Context: someone actively managing their
relationship with labels — they discovered one, sent a demo, and now have to
sign.

A side note so it doesn't get confused: Pro Access also has a separate
**"Labels"** section (`EmptyState: "You don't manage any labels on
Proton"`) — that one is for people who *administer* a label, a totally
different concept from "labels I signed with." It's not part of this
discussion.

## The real question

It's not "are we duplicating data?" (we're not). It's: **should a user who
needs to sign a contract have to know that a "Labels" section exists in order
to find it, or is Settings already enough?** And conversely: does it make
sense for Settings to have its own link if 90% of the time the user is
already inside Labels when a new contract shows up?

## Options

### A. Leave it as is — two doors, one room
Settings/Pro Access is the "administrative" door (for when someone goes in to
review their account as if they were a manager/accountant). Labels is the
"active" door (for when you're in the middle of the flow: you got accepted,
the contract arrived, you sign it right there).

- 👍 Each one serves a different intent, without forcing anyone to learn a
  single hierarchy.
- 👎 Someone new might not know which one to check first; it looks like
  "it's in two places" even though it isn't.

### B. Everything under Labels — Pro Access stops having its own destination
Remove the "Contracts" button from Pro Access (or leave it only as text
explaining "managed from Labels", without a dedicated route of its own).

- 👍 A single source of truth for *navigation*, not just for data.
- 👎 Pro Access is supposed to be "everything professional/legal about your
  account" — removing Contracts from it empties out exactly its most
  important piece.

### C. Everything under Pro Access — Labels is left with only Browse + Submissions
Move the "Contracts" tab (and the PDF reader/signature) to live inside Pro
Access, and have Labels be purely "discover labels and send demos."

- 👍 Conceptually separates "explore" (Labels) from "manage legal
  commitments" (Pro Access) — they're different intents, each with its own
  home.
- 👎 Breaks the flow we deliberately built: you get accepted → the contract
  arrives → you sign without leaving Labels. Adding a jump to Settings right
  at the most important moment (signing) is friction exactly where we want
  it least.

### D. Recommended — Contracts lives in Labels, Pro Access mirrors it live
Leave the PDF reader + signature where it is (Labels — that's where the flow
is born: the label accepts you right there). But instead of Pro Access having
a mute button, have it show the same state we already compute in Labels —
e.g. the "1 contract awaiting your signature" badge that today shows up in
`labels/contracts/page.tsx` gets replicated as dynamic text in the Pro Access
card (`"1 contract awaiting signature"` instead of just the `FileText` icon).

- 👍 Settings stays the administrative door (and there you *know* whether
  something needs attention without having to go in), but there's no second
  signature logic to maintain — it just reads the same state.
- 👍 Doesn't break the immediate-signature flow from Labels.
- 👎 Requires Pro Access to read from the same `contractsStore` (today it's a
  server component page with no state — it would need a small client
  component just for that summary).

## If D gets approved, the change is small

- `settings/account/pro/page.tsx` turns the "Contracts" button into a client
  component (`ContractsProCard.tsx`) that reads `useContractsStore` and shows
  the pending count, the same way `labels/contracts/page.tsx` already does.
- The data model and signature flow aren't touched — it's purely a change in
  how "live" the Settings card is.

## What I'm NOT proposing

- Not duplicating `mockContracts` or creating a second store.
- Not moving the PDF reader/signature out of Labels (option C) — unless it's
  explicitly decided that "managing contracts" outweighs "being in the middle
  of a deal with a label" as a concept, which is the opposite of how the flow
  has been designed so far.

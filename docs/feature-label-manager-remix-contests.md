# Label-manager section: "Remix & Contests" (working name)

## Method

Same as `docs/label-contracts/label-manager-contracts.md` — the user
describes a producer-view-mirrored capability, I capture it as a spec.
Nothing here is built as a result of this doc; it's the plan, not the
change.

## Naming

No name was settled on yet — "una parte que todavía no se me ocurre el
nombre." Using **"Remix & Contests"** as a working label in this doc so
there's something to refer back to. Candidates to revisit:
- Remix & Contests
- Remix Desk
- Remix Program
- A&R (industry term for exactly this kind of catalog/talent activity, but
  may read as too jargon-heavy for the UI)

## What this section needs to do

Three things, from the label's side:

### 1. Enable remix on a song

A label should be able to open up one of their own tracks for remixing.

**Open question, not yet resolved:** today, whether a track is
remix-eligible is driven by **artist-level** `Artist.openToRemix` (the
*artist* opts in, once, for all their tracks) combined with a label
*contest* existing that references that `trackId` — see the 2-step gate
described in `docs/feature-contest-flow.md`. There is no dedicated,
standalone "enable remix on this specific song" toggle on the label side
independent of creating a contest. So: is "enable remix" meant to be its
own action (a track-level flag the label sets, separate from running a
contest), or is creating a contest *itself* the enabling action, and this
ask is really about surfacing that more clearly as its own named place in
the label-manager nav? Needs a decision before this can be scoped as
either "new field" or "better entry point to something that already
exists."

### 2. Create a contest

**This already exists**, built in a previous session:
`(label-manager)/contests/page.tsx` — scoped to the active label (or all
labels), lists existing contests (seeded + created), and a "+ New contest"
form (track picker restricted to that label's own catalog, title,
description, deadline, prize). Writes to
`lib/store/label-manager/contestsStore.ts`. Whether this "Remix & Contests"
section reuses that page as-is, or this is prompting a rework of it, isn't
clear yet — flagging the overlap so it doesn't get rebuilt from scratch
without checking what's there first.

### 3. See artists' requests to remix a label song

**This also already exists**, same previous session:
`(label-manager)/requests/page.tsx` — filters the conversations already
created on the producer side (`producer_request` with `kind: "remix"` or
`"contest"`) by active label, with its own chat view
(`(label-manager)/requests/chat/[id]`). Per the earlier `README-tech-debt`
style re-audit conversation, this page's chat UI was flagged as looking
inconsistent with the producer-side conversation UI — worth keeping in
mind if this section gets rebuilt/renamed, since that's a real, already-
identified issue on the exact page this ask maps to.

## Immediate next step

Before treating this as new work: confirm with the user whether "Remix &
Contests" is meant to **replace/rename/merge** the existing separate
`Contests` and `Requests` pages into one unified section (which would also
be a natural place to resolve the chat-UI-consistency issue already
flagged), or whether this is describing something net-new alongside them.
That answer changes whether this is a build task or a reorganization task.

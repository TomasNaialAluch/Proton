# Label-Manager QA — findings and work plan

Re-testing the manual checklist left at the end of `docs/ultima-sesion.md`
(the "toolkit de label-manager" section). Going item by item; the user is
driving the browser and reporting what they see, I'm capturing it here so
it turns into a real fix plan instead of getting lost. Nothing in this doc
is fixed yet — this is findings + plan, not a changelog.

---

## Checklist item: Scouting → scope to Sudbeat, see suggestion cards

**Status: incomplete — real product issues found, not just visual bugs.**

### 1. "Reach out" should let you start a real chat with the person

Current behavior needs to actually open/start a conversation the way
starting a chat normally works — not (as it stands) a form that feels
disconnected from "now you're talking to this person."

### 2. Artist name isn't clickable to their profile

Tapping the suggested artist's name (e.g. "Solene Frost") on the scouting
card should navigate to their profile, the same way any other artist name
in the app links out. Right now it doesn't.

### 3. "View conversation" opens an inconsistent chat UI

The chat reached from Scouting's "View conversation" link doesn't look
like the chat UI already built and working on the producer side
(`ConversationThread` / the unified inbox from
`docs/feature-unified-chat-inbox.md`). Should be the same component/UI,
not a separate, different-looking one.

### 4. Missing "pull" (needs more detail — polish/refresh behavior TBD)

Flagged as missing — need to pin down exactly what this refers to before
scoping a fix. Revisit when there's a concrete example.

### 5. Label scope switching is fundamentally wrong — biggest item

Right now the label-manager view lets you freely switch between **any**
label via a dropdown ("All labels", Proton Music, Sudbeat, Bedrock, ... all
19), as if one account manages every label on the platform simultaneously.
Called out directly as wrong ("cualquiera").

**How it should work instead:** same model as the producer view — you are
logged in *as* the manager of **one specific label**. You pick which label
you are (once, like an identity), not switch freely between all of them on
every page as a superuser. This is a scoping/identity model change, not a
UI tweak — affects `lib/store/label-manager/labelScopeStore.ts` and every
page that currently reads "all labels" as a valid state (Scouting,
Requests, Contests, Demo policy, Roster, Catalog, Revenue, Statements).

---

## Open questions to resolve before this becomes a fix plan

- What does "falta pull" mean concretely — need an example.
- Does removing free label-switching mean: (a) a one-time "which label are
  you" selection at login/session start, (b) dropping "All labels" entirely
  and always requiring one label picked, or (c) something else? Needs a
  decision before touching `labelScopeStore`.
- Scope of the chat-UI-unification fix (item 3): does it mean literally
  reusing `ConversationThread`/`ConversationList` for the Scouting outreach
  flow, or does Scouting's chat need its own variant for another reason?

---

## Items still to review (rest of the checklist)

Not yet covered — user hasn't reached these:

- Scouting: Bedrock scope, "All labels" scope, Dismiss persistence
- Requests (label-manager inbox)
- Bottom nav mobile (label-manager)
- Contests (creation flow)
- Demo policy (editing flow)
- Full checklist re-run as producer view

# Contracts — label-manager mirror (spec only, not built)

## Method

The user is walking through the producer-side dashboard, page by page, and
describing what the mirror-image feature should be on the label-manager
side. This doc captures each ask as a spec, not as code — nothing here is
implemented yet. One label-manager area at a time; **Contracts** is first.

This replaces the earlier QA-checklist approach
(`docs/label-manager-qa-plan.md`) for now — that doc is paused, not
resolved. Note the biggest open item from that doc still applies here and
to everything that follows: **label-manager should be scoped to one label
at a time, like a real identity** (mirroring how the producer view is
scoped to one producer), not a free switcher across all 19 mock labels.
Whatever gets built for Contracts should assume that scoping model, even
though it isn't built yet.

---

## Contracts (label-manager) — what's needed

From the producer side, `Contracts` shows *the producer's own* contracts —
one row per release/label deal, each linking to `ContractSignClient` (for
contracts still awaiting signature) or `ContractRecordClient` (for closed,
real contracts). See `docs/label-contracts/README.md` for how signing
itself works.

The label-manager mirror is **not** "the same list, other side of the
signature" — it's structured around the label's **artist roster** first,
contracts second:

### 1. See the label's artists

A view of the artists signed to / working with this label — same
underlying data as `(label-manager)/roster` today (`mockRosterArtists`),
but this is the entry point for Contracts specifically, not the
label-wide KPI dashboard `roster/page.tsx` already is. Whether this reuses
`roster/page.tsx` outright or is its own artist-list view scoped to
Contracts needs a decision — flagging, not deciding, here.

### 2. Create an artist profile

Today, artists only exist as pre-seeded mock data
(`lib/mock/label-manager/rosterArtists.ts`, `types/artist.ts`) — there is
**no creation flow anywhere in the app**. This is new: a label manager
needs to be able to create a new `Artist` record (name, bio, avatar,
country, genres, social links — the existing `Artist` shape) from
scratch, presumably when onboarding someone not yet in the system.

### 3. Inside an artist's profile: see their contracts with this label

Opening one of the label's artists should show — among whatever else an
artist profile has — the contracts specifically **between this artist and
this label**. Filtering `Contract[]` by `labelSlug` (already on the type)
and by which artist the release belongs to — today `Contract` has no
artist reference field at all, only `release`/`label`/`labelSlug`. That's
a gap: **`Contract` needs an artist/producer identifier** to support this
view (currently contracts are only ever listed from the producer's own,
implicit "these are all mine" context — there's no reverse lookup
"contracts for artist X" anywhere in the data model).

### 4. Create a new contract for that artist

From inside the artist's profile, a label manager should be able to draft
a new contract — presumably producing a new `Contract` record scoped to
that artist + this label, landing in `pending_signature` so it shows up
on the *producer's* side (`(producer)/contracts`) as "Awaiting your
signature," the same way `c7` (JIK / Never Leave — Dear Deer Music)
already does today, just manually seeded instead of created through a
label-manager flow.

---

## Data model gaps this surfaces (not fixed yet)

- **`Contract` has no artist reference.** Needs something like
  `artistId: string` (or `producerId`, depending on what identifier the
  rest of the app uses for "the person on the other side of the deal") to
  make "this artist's contracts" queryable at all.
- **No artist creation exists anywhere.** `mockRosterArtists` is a static
  seed array; there's no store, no form, no "new artist" action in the
  entire codebase today.
- **No contract creation flow exists anywhere**, on either side. Every
  `Contract` in `lib/mock/contracts.ts` is hand-seeded. Building "create a
  new contract" here would be the first real creation flow for this data
  type.

---

## Explicitly not decided yet

- Whether artist creation belongs *inside* Contracts, or is a roster-wide
  feature that Contracts just links into.
- Whether "create a contract" reuses any part of the existing
  `ContractSignClient` PDF/signature machinery, or is a separate
  "draft" step that only later becomes a signable PDF.
- How this interacts with the still-unresolved label-scoping model (one
  label at a time, per the note at the top).

---

## Next in this doc

More label-manager mirror specs get added here as the user walks through
more producer-side pages, following the same method: describe it as a
producer-view mirror, capture the gap, don't build yet.

# Rebuilding "Contracts" with our design — plan

I inspected the real page (`soundsystem.protonradio.com`, with your account) so
that this isn't a guesswork rebuild. This doc is the plan — it doesn't touch
code except for what's already marked as done further below.

Reordered so it reads straight through as a guide (no content was deleted —
the sections that became obsolete along the way are at the end, in
"Appendix: discarded decisions").

## The separation (read this first)

They are **two separate sections**, not one with tabs:

- **Labels** = Browse + Submissions. Discovering platform labels and
  sending them a demo. No contracts live here.
- **Contracts** = everything else. What already exists on the official page (the
  Date/Release/Label/Status/View table) **plus** the signing part
  we added (in-app PDF reader + signature). It's its own section,
  with its own nav item — not a tab inside Labels.

**Explicit clarification — from "Labels" (today "Label Deals" in the nav) only
the Contracts part gets pulled out.** Browse and Submissions are **not touched
or removed**, they stay living in Labels exactly as they are today. The only
thing that moves is the Contracts tab/logic, to its new section.

## Why this page exists (it's not our idea)

"Contracts" isn't a section we're proposing — **it was already decided**
in the real product (the people who are going to be our bosses built it this way in
`soundsystem.protonradio.com`, with real artist data right now). What we're
doing here is rebuilding it with our design, not inventing it from scratch. That
pins down what the page absolutely has to be able to do:

1. **Sign** contracts that aren't signed yet.
2. **View** the ones already signed (history).
3. **Access the PDF** of each contract, signed or not.

These three points are the minimum floor — all three exist on the real site
(though the real one only fully covers 2 and 3; signing doesn't exist there
at all, it's all done by mail). Our version already covers all three, and on
point 3 it goes a step further: instead of a link that takes you off the
page, **the PDF is viewed directly inside**
(`PdfContractViewer`, see `ContractDetailClient.tsx`) — that's a real
improvement over the product they decided on, not a luxury we added.

## What I saw on the real site (source of truth)

It's **a single monolithic page**: `main.php?tab=accounts`, with 4 sub-tabs by
URL hash (`#artists-tab`, `#performance-tab`, `#royalties-tab`,
`#contracts-tab`) — all the HTML for the 4 tabs is rendered server-side at once
and JS just shows/hides based on the hash. **There's no separate JSON API
for contracts** — I didn't capture any network request when entering that
tab; the table is already in the initial HTML and the table library (DataTables-
style) just adds sorting/search/pagination in the browser.

**Real structure of the contracts table:**

- Title: *"Here are all your contracts. Have you signed them all?"*
- Search box (free-text input, filters the table)
- "Per page" selector (10 / 25 / 50 / 100)
- Columns: **Date · Release · Label · Status · ["View Contract" button]**
- Status as plain green text: `SIGNED`
- Numbered pagination below + "Showing 1 to 4 of 4 entries"
- The **"View Contract"** button is a link to
  `index.php?cid={id}&p={token}` — a contract id + a per-contract access token
  (no dedicated viewer, it opens another screen / direct download).

With your real account I saw 4 contracts — they are **the same 4 I had already
put in as mock** in the prototype before this round (Tied Inside, Mind Altered,
Balance, Beyond Living, with the same dates) — meaning the previous mock was
already a carbon copy of your real account. Good sign: no need to invent any
new data structure, just confirm fields.

### Update — what "View Contract" actually is (I opened it to confirm)

Corrected assumption: **it's not a PDF.** It's a standalone HTML page,
`contracts/proton_contract_v7.php?cid={id}&p={token}` (the real link the
button opens, different from the `index.php?cid=...&p=...` in the table —
that one probably redirects here). Real format, end to end:

- Header with "Proton" logo + title "RECORDING CONTRACT".
- Black instructions box: *"This contract must be approved digitally.
  Read the entire document and click 'Accept Contract.' Do not mail us
  physical copy of this contract."*
- "prepared on [date] by: Proton L.L.C. [address]" / "prepared
  for: [artist] [address]" block.
- "HEADS OF AGREEMENT" — free text with a summary of the release and the label.
- **TRACK(S) · GENRE · ROYALTY · TERMS** table (one row per track).
- "KEY NOTES" — bullets with payment/reporting conditions.
- Numbered legal clauses (1 to 11 in the one I saw) — full terms,
  jurisdiction, duration, royalties, renewal, termination, and clause number 11
  clarifies: *"This agreement may be approved digitally... This agreement does
  NOT require counter-signature by Proton, Inc."* — meaning the label/Proton
  doesn't counter-sign, it's unilateral acceptance by the artist.
- **The "signature" is plain text**, not an image or a stroke: at the bottom
  it says `Signed by: Tomas Naial Aluch` and `Date: Saturday 19th of August 2023`.
  The "Accept Contract" button (mentioned in the black box, I didn't see it
  active because this contract was already signed) is what generates that
  text — no drawing, styled typing, or uploaded image like in our version.

**What this changes:** our signing mechanism (draw/type/upload/photo + place
it over a PDF) is a more elaborate mechanism than Proton's real one — the real
one is literally a button that stamps your name as text. This doesn't
invalidate what we built: the real case that motivated all of this (the Dear
Deer contract) is a real PDF, sent by an external label via email — that's
exactly where what we built is needed. But contracts that come directly from
Proton (like these 4) are HTML with button-based acceptance, not PDF.
It's probably worth having Contracts support both cases: **HTML with "Accept
Contract"** for Proton-generated contracts, and **PDF with drawn signature**
for the ones an external label sends on its own (like Dear Deer) — to be
defined whether we need to differentiate them or unify everything under the
signing flow we already have (cleaner, and already works).

**User correction — resolved, not left open.** What you see in
"View Contract" (the HTML page with a text signature) is the **archived copy
of a deal that was already closed outside the platform** — today the real
process is: the label sends you the PDF by email, you sign it however you can
(print/sign/scan, or whatever), and you send it back by email; at some point
that gets recorded in SoundSystem as "SIGNED" with that summary page. **It's
not an alternative signing mechanism we need to match** — it's the symptom of
the problem this project exists to solve. Our real-PDF flow + drawn/typed/
uploaded/photo signature **stays exactly as it is, without splitting into two
formats** — it's specifically the solution to that back-and-forth email. The
real site's HTML page is, at most, a reference for what data to show in the
"Signed & verified" summary (name, date) once signed inside Proton — not a
format to replicate.

## What stays the same (parity with the real site)

- The same base columns: date, release, label, status, action on the
  document.
- Search + per-page count selector — we don't have those today, and with
  more than 4-5 contracts they'll be needed.
- The direct tone of the copy ("Have you signed them all?") — our
  `"You have N contracts waiting on your signature"` already goes in that
  direction.

## What the redesign improves (it's not a 1:1 clone)

- The real site is a flat Excel-in-a-browser table (generic DataTables, no
  visual identity). Our version uses cards, status badges colored per label,
  "By label" grouping, mobile-first — that's already better and stays.
- On the real site, tapping "View Contract" **takes you off the page** to
  `index.php?cid=...` — no reading or signing in-app, it's a link with a
  token. Our version already surpasses that: in-app PDF reader + overlay
  signature + download — this is straight-up better than the original, no
  need to step back here.

## Migration strategy

Contracts is split off as its own section, it doesn't stay as a tab
inside Labels.

**Phase 1 — move/copy what already works, as-is.** Everything we built for
signing and reading the PDF is good and stays without a rewrite:

- `components/dashboard/producer/labels/PdfContractViewer.tsx`
- `components/dashboard/producer/labels/SignatureOverlay.tsx`
- `components/dashboard/producer/labels/SignatureCanvas.tsx`
- `components/dashboard/producer/labels/ContractKeyDates.tsx`
- `app/(dashboard)/dashboard/(producer)/labels/contracts/page.tsx` and
  `.../contracts/[id]/ContractDetailClient.tsx`
- `lib/store/contractsStore.ts`, `lib/mock/contracts.ts`,
  `types/contract.ts`, `types/signature.ts`, `lib/pdf/*`

These get copied/moved to the new Contracts location as its own section.
After moving, the internal `href`s (breadcrumbs, "Back to contracts", links
from Settings/Pro Access) need to be updated to point to the new location.

**Destination folder for the components.** The 4 components in
`components/dashboard/producer/labels/` (`PdfContractViewer`,
`SignatureOverlay`, `SignatureCanvas`, `ContractKeyDates`) move to their own
folder — `components/dashboard/producer/contracts/` — following the same
pattern the repo already uses (one folder per section under `producer/`, see
`components/dashboard/producer/labels/` as reference). No new or rewritten
code, it's moving files + updating imports. Keeps the project scalable: each
section (`labels/`, `contracts/`) owns its own components, without one
depending on the other's folder.

**User correction — it's not a rename, it's adding alongside.**
The struck-through text below said "Label Deals" had to be renamed to
"Contracts" in the nav. That's wrong: **"Label Deals" is not touched** —
it stays as its own section (Browse + Submissions, for sending demos),
separate from Contracts. What's correct is that the nav has **both items
separately**: "Contracts" (new) alongside "Label Deals" (as it already was),
not one replacing the other. `AppSidebar.tsx` already reflects this —
"Contracts" was added as a new item, "Label Deals" was restored as it was.

~~The nav name is already decided, it's not up to us to choose: the nav
currently says "Label Deals" where it should say "Contracts". On the real
site, the tab bar is literally `Artists | Performance | Royalties | Contracts`
(I saw it with your account) — same order, same fourth item. If we leave
"Label Deals" there we're not respecting the original page.~~ *(the
comparison with the real tab bar was still valid as a reference for where to
place "Contracts" in the order, but it did not imply deleting "Label Deals" —
that was a misreading on my part.)*

- ✅ **Desktop** (`AppSidebar.tsx`) — done: "Contracts" added as its own
  item (`/dashboard/contracts`), "Label Deals" restored
  (`/dashboard/labels`), both coexist.
- ⬜ **Mobile** (`BottomNav.tsx`, `HamburgerMenu.tsx`) — pending: add
  "Contracts" as a new item, **without touching** the "Label Deals" that's
  already there.

Cleaning up "Label Deals" (reviewing name/icon, Browse + Submissions content)
is left for later — the user does it later, and it doesn't include deleting
or renaming it.

**Side note:** while looking at the real account I didn't open any "View
Contract" (they're your real legal documents, with an access token) — I only
read the table and the page structure. If at some point we need to see the
real content of a signed PDF to compare the format, let me know and we'll do
it on purpose.

## What Contracts will look like — proposed flow

Designed from what you asked for: first see the contracts like on the real
page, then a notice that "you need to review this," and from there enter
the contract. Three layers, from more passive to more direct:

**1. The main view — the list, with the look of the real one.**
On entering Contracts (from the nav, today "Label Deals" on mobile /
"Contracts" on desktop) the first thing you see is the full list, on par
with `soundsystem.protonradio.com`: Date · Release · Label · Status, search,
pagination — but with our look (cards, color badges), not the flat table of
the real site. This already exists today in `labels/contracts/page.tsx`, it
stays the same when migrated.

**2. The notice — something you notice without having to go look.**
Today the notice that "you have contracts to sign" only exists *inside* the
list (the amber banner "You have N contracts waiting on your signature") —
meaning you already have to have entered to find out. For it to warn before
entering, two things are needed, not just one:

- **A dot/badge on the "Contracts" nav item** (sidebar and bottom nav) —
  visible at all times, without opening anything. It's the most direct
  notice: you enter the dashboard and already see Contracts has something
  pending, before touching it.
- **The notifications bell, but for real.** There's already a mock item
  there ("Pending contract — The contract with Stellar Records requires your
  signature") that doesn't read from any real data or link anywhere. The idea
  is for that item to come from the real `contractsStore` and lead straight
  to the pending contract (`/dashboard/labels/contracts/c7`, for example) —
  today it's pure static copy, it needs to be connected.

The amber banner in the list (point 1) also stays — it's the reinforcement
once you've already entered, it doesn't get replaced by the other two.

**3. Entering the contract.** From any of the three (nav badge →
list → row; notification → straight to the contract; or the list without
a notice, just navigating) you land in the same place: the contract detail
(`ContractDetailClient.tsx`) with the PDF reader and signature. There's no
"correct" path — the three are different entry points to the same
destination.

This is design/flow, the nav badge and the real notification connection
aren't implemented yet — that's left for the Roadmap below.

## List and detail order by status

**List order.** A single list with all contracts (signed + unsigned) — not
two separate lists. **Unsigned ones go first**, then signed ones. Today
`labels/contracts/page.tsx` shows them in mock order; they need to be sorted
by status before display (pending_signature on top, signed at the bottom).

**The detail isn't two components — it's one that changes based on status.**
You tap a contract → `ContractDetailClient.tsx` opens with the PDF always
visible. What changes inside is the block at the bottom:

- If it's **unsigned**: the signature block — create/choose a signature,
  place it over the PDF, confirm. This already exists.
- If it's **signed**: the "Signed & verified" block — read-only, name,
  date, hash. This also already exists.

So what you're asking for is already resolved this way, it just needs to be
kept as-is when migrating — not split into two separate screens/routes, it's
a single one with a conditional branch based on `contract.status`.

**Connect to the real API (future, not now).** Today `documentUrl` is mock
(a static file in `public/contracts/` or a `blob:` generated client-side when
signing). The real equivalent would be hitting the
`soundsystem.protonradio.com` backend (the pattern we saw: `index.php?cid={id}&p=
{token}`) to fetch the real contract and its PDF. This isn't done yet —
we're still on mock — but it's noted as the integration point for when
there's a real backend for this section.

### Correction — there ARE two detail components, not one

This replaces the conclusion above ("don't split into two screens") —
the user clarified the real criteria and it changes the approach:

The data Contracts brings into the prototype are **Naial's real contracts** —
the 4 that are already signed on the real account (Tied Inside, Mind
Altered, Balance, Beyond Living) **plus** the JIK/Never Leave (Dear Deer)
one, which is hardcoded as the only one **unsigned**.

- **JIK (unsigned)** → uses the detail we already built entirely:
  `ContractDetailClient.tsx` with `PdfContractViewer` + the signing flow
  (create signature, place it, confirm). It's the piece we show to
  demonstrate how the finished feature will look.
- **The 4 real ones (already signed)** → **also get their own detail
  inside the app** (not a button that takes you out). User correction on
  what had been noted before: it's not "click → new tab with the real
  link". It's a detail with the same look as the other one (same type of
  viewer), and **inside** that detail is where you access the real contract
  (`contracts/proton_contract_v7.php?cid={id}&p={token}`, confirmed by
  opening the Beyond Living one). The idea is to leave it visually set up
  for how this will look in the future: **the real link will eventually
  open embedded inside a viewer-type component** (similar to the
  `PdfContractViewer` we already have, not a plain external link) — for now
  it's enough to leave the detail with that look/structure, even though the
  real embed isn't wired up yet.

**That's why there are 2 "contract detail" components, not 1 with a branch:**
1. `ContractDetail` (the one that already exists) — for the contract to be
   signed (JIK), with `PdfContractViewer` + signature.
2. A new one — same type of screen (detail + viewer), but instead of
   `PdfContractViewer` with our PDF, it has a viewer that will show the real
   contract embedded (`proton_contract_v7.php?cid=...&p=...`) — no
   signature, because those are already signed. It's not "leaving the app",
   it's "viewing inside, with our look".

The `cid` + `p` of the 4 real ones, already confirmed by browsing the
account:

| Release | cid | p |
|---|---|---|
| Tied Inside | 951070 | dadd4115e8f558a8544b7b848c555701 |
| Mind Altered | 797449 | c617f159f3d73aac62dd2f0a00ab6ea0 |
| Balance | 717531 | 3a21c9d96e6f13f785757bcc3c9e4c38 |
| Beyond Living | 624386 | 082e18675fde0b70f53946b98b659576 |

These are real access credentials to real legal documents — hardcoding them
in the prototype's mock is a decision to confirm with the user before
putting this anywhere public, though for local development it's not a
problem.

## Layout and interaction of ContractSignClient (redesign of the current order)

Changes the top-to-bottom order and adds new interaction on top of the
viewer. This is only for `ContractSignClient` (the signing one) — it doesn't
apply to `ContractRecordClient`.

**New order:**

1. **Key Dates first.** Today they're after the PDF viewer; they become the
   first thing you see on entering — it gives context (deadlines, due date)
   before diving into the document itself.
2. **PDF viewer, collapsed by default.** Starts minimized (a compact bar
   with the document name, like a "closed accordion") and expands when
   tapped.
3. **Hover with a pencil + click opens a modal — user correction on what
   that modal does.** When hovering over the expanded PDF, the cursor
   changes to a pencil icon. Clicking opens a **modal**, but **the modal is
   only to get the signature image** — it doesn't sign anything by itself:
   - If there's already a saved signature (`useSignatureStore`): the modal
     shows it to confirm "use this one".
   - If there's no saved signature: the modal shows the create-signature
     selector (draw/type/upload/photo — what's already `SignatureCanvas`)
     right there, it doesn't take you elsewhere on the page.
4. **After the modal: place the signature over the PDF, as it already
   works today.** Once the modal is closed (with a signature image ready,
   new or saved), the PDF viewer stays expanded and enters "place
   signature" mode — exactly the `SignatureOverlay` that already exists:
   drag, resize, rotate the signature over the document.
5. **Save → generates the valid PDF.** On confirming the position
   ("Confirm & sign" / "Save"), it runs what's already built
   (`embedSignatureInPdf`): embeds the image into the real PDF and that new
   file — not the original — becomes `documentUrl`, the signed contract's
   valid PDF. This isn't new, it's the mechanism that already exists in
   `ContractSignClient` — the only thing that changes is *how you get* to
   this step (before: inline "Add signature to document" button; now:
   hover + click + choose/create-signature modal).

**My take on what you asked (repeated signature component in Settings,
is that fine?):** yes, keeping it in both places is fine —
they're two different moments of use, not a real duplication: Settings is
for "get my signature ready ahead of time" (proactive, before there's a
contract waiting), and the block at the end of the contract is for "I need
it now and don't have one" (reactive, in the moment). Both already write to
the same `useSignatureStore`, so there aren't two sources of truth — it's
the same data, with two entry points depending on when the user needs it.

**A tension worth keeping in mind (not resolving it here, just noting it):**
collapsing the PDF by default reduces the chance someone signs without
having read the contract — today the viewer is open by default, which
pushes more toward reading it before reaching the sign button. Minimizing it
improves scroll/visual order (especially on mobile), but it's a product
decision, not just a visual one: it prioritizes space over "forcing"
reading. Worth keeping in mind, though it doesn't block implementing it this
way if that's what's wanted.

## Final folder structure — where everything goes

Everything under its own section, nothing shared "by hand" between `labels/`
and `contracts/` — each one owns its own stuff. Same pattern the repo
already uses (one folder per section under `producer/`).

```
app/(dashboard)/dashboard/(producer)/contracts/
├── page.tsx                    # the list: Date/Release/Label/Status/View,
│                                # search, pagination, unsigned first
└── [id]/
    ├── page.tsx                 # decides which component to render (see below)
    ├── ContractSignClient.tsx   # ex ContractDetailClient.tsx — PDF + signature,
    │                            # for unsigned contracts (JIK)
    └── ContractRecordClient.tsx # NEW — its own detail (not a link that
                                  # takes you out of the app), with a viewer that will
                                  # embed the real proton_contract_v7.php
                                  # inside (same idea as PdfContractViewer,
                                  # but for the real contract) — for the
                                  # 4 real contracts already signed

components/dashboard/producer/contracts/
├── PdfContractViewer.tsx        # moved as-is from producer/labels/
├── SignatureOverlay.tsx         # moved as-is
├── SignatureCanvas.tsx          # moved as-is
├── ContractKeyDates.tsx         # moved as-is
├── ContractStatusBadge.tsx      # NEW — today the status badge is
│                                # built inline in contracts/page.tsx
│                                # (STATUS_CONFIG); it's split out to avoid repeating
│                                # that object if it's needed in more than
│                                # one place in the future (e.g. the nav badge)
└── ContractListRow.tsx          # NEW — the list row, today also
                                  # inline in contracts/page.tsx; splitting it
                                  # keeps page.tsx short and easy to read

lib/store/contractsStore.ts      # moved as-is
lib/mock/contracts.ts            # moved as-is, + the 4 real ones + JIK
lib/pdf/                         # moved as-is (embedSignature.ts,
                                  # extractSignatureFromPhoto.ts, hashBytes.ts)
types/contract.ts                # moved as-is, + the new `kind` field
types/signature.ts               # moved as-is
```

**How `[id]/page.tsx` decides which of the two components to show.** Not by
guessing (e.g. "if it has a signature, it's of one type") — an explicit
field in the `Contract` type:

```ts
// types/contract.ts
interface Contract {
  // ...what already exists (id, release, label, status, keyDates, signature, etc.)
  kind: "signable" | "record";
}
```

- `"signable"` → JIK. `[id]/page.tsx` renders `ContractSignClient`.
- `"record"` → the 4 real ones. `[id]/page.tsx` renders `ContractRecordClient`.

It's an explicit, typed field instead of inferring the component from
another piece of data (`documentUrl`, `status`, etc.) — so the day there's a
third case, a value gets added to the union type and the compiler flags
every place that's missing coverage. This is the part that makes it
scalable: adding a new contract type doesn't require touching scattered
conditional logic, just adding the case.

## Roadmap — everything left to do

In order. None of this is done yet except what's marked ✅.

1. ✅ **Split Contracts from Labels into its own section** — done: the 4
   components live in `components/dashboard/producer/contracts/`, the
   routes in `app/(dashboard)/dashboard/(producer)/contracts/`, and
   `ContractDetailClient.tsx` was renamed to `ContractSignClient.tsx`.
2. ✅ **Update internal `href`s** — done: breadcrumbs, "Back to
   contracts", the "Contracts & Reports" link in
   `settings/account/pro/page.tsx`, and `dashboardShellRouting.ts` (added
   `/dashboard/contracts` to `isProducerShellPath`).
3. ✅ **Nav — add "Contracts" alongside "Label Deals"** (not
   replacing it — see "User correction" in "Migration
   strategy") — done in all 3 places:
   - ✅ Desktop (`AppSidebar.tsx`).
   - ✅ Mobile (`BottomNav.tsx`, `HamburgerMenu.tsx`) — both items
     coexist, same order as desktop.
4. ✅ **Search box in the contracts list** — done: free-text filter
   over release/label in `contracts/page.tsx`, "N of M" counter when a
   search is active, and empty state if nothing matches.
5. ⬜ **"Show N per page" selector** — low priority while there are
   few mock contracts.
6. ✅ **Badge/dot on the "Contracts" nav item** — done in all 3 places
   (`AppSidebar.tsx`, `BottomNav.tsx`, `HamburgerMenu.tsx`): amber dot
   over the icon when `contractsStore` has at least one `pending_signature`
   contract.
7. ✅ **Connect the "Pending contract" notification to real data** — done:
   `NotificationsPanel.tsx` generates a notification for each
   `pending_signature` contract in `contractsStore`, with a direct link
   (`/dashboard/contracts/{id}`). It isn't part of the "clearable" state — it
   can't be dismissed without signing, it disappears on its own once
   signed, same as the nav dot. *(Bug found and fixed along the way: the
   selector `s.contracts.filter(...)` returned a new array on every render
   and broke Zustand's `useSyncExternalStore` — the fix was to select the
   stable `contracts` array and filter outside the selector, in the
   component body.)*
8. ✅ **Sort the list** — done: `STATUS_ORDER` in `contracts/page.tsx`
   orders `pending_signature` → `expired` → `signed`, applied after the
   search filter.
9. ⬜ *(future, not now)* **Connect `documentUrl` to the real API** —
   replace the mock/blob with the real pattern `index.php?cid={id}&p={token}`
   once there's a backend for this section.
10. ⬜ **Labels cleanup** (Browse + Submissions without the Contracts tab,
    review nav name/icon) — the user does this later, it's not on this
    roadmap for us.
11. ~~⬜ Pending decision — two contract formats or just one?~~
    **Resolved — see "User correction" in the section above.** A
    single format: real PDF + drawn/typed/uploaded/photo signature, as-is.
    The real site's HTML page isn't a format to match, it's the record
    of a deal closed by email — exactly the problem this flow replaces. There's
    nothing to do here, the row stays only as a record that the idea of
    two formats was evaluated and discarded.
12. ✅ **Load Naial's 4 real contracts into the mock** — done:
    `lib/mock/contracts.ts` has all 4 (`r1`-`r4`, Tied Inside, Mind
    Altered, Balance, Beyond Living) with `kind: "record"` and
    `realContractUrl` pointing to each one's real
    `proton_contract_v7.php?cid=...&p=...`, alongside the JIK one
    (`kind: "signable"`). Also added the `kind` and `realContractUrl`
    fields to `types/contract.ts`. Verified: Total 5, Signed 4 of 5, grouped
    correctly in "By label".
13. ✅ **Create the second detail component** — done:
    `ContractRecordClient.tsx` + `RealContractViewer.tsx` (same type of
    chrome/header as `PdfContractViewer`, no PDF or signature — card with
    "Open contract record" that links to the real `proton_contract_v7.php`).
    `[id]/page.tsx` now reads `contract.kind` and chooses between
    `ContractSignClient` (`"signable"`) and `ContractRecordClient`
    (`"record"`). It doesn't embed the real page yet (see the note in
    the component about why) — that's left for when there's a sanctioned
    way to embed it (the real site's X-Frame-Options probably
    blocks it).
14. ✅ **Reorder `ContractSignClient`** — done: `ContractKeyDates` is the
    first block inside `<div className="space-y-4">`, before
    `PdfContractViewer`.
15. ✅ **Collapsible PdfContractViewer** — done in `ContractSignClient.tsx`:
    compact bar ("{release}.pdf" + chevron) that starts closed, expands
    when tapped, and shows `PdfContractViewer` inside.
16. ✅ **Pencil cursor + modal to choose/create the signature** — done:
    overlay over the expanded PDF's surface with a pencil cursor (inline
    SVG via `style.cursor`, amber), click opens the modal — saved
    signature with "Use this signature", or `SignatureCanvas` if there's
    none. Also added an explicit "Sign this contract" button below (expands
    the PDF + opens the modal) as a fallback in case the hover isn't
    discovered on its own.
17. ✅ **After the modal, automatically enter "place signature" mode**
    — done via `startPlacing()`: resets the frame, activates `placing`,
    closes the modal. Reuses `SignatureOverlay` + `embedSignatureInPdf`
    unchanged. Tested end to end in the browser: create typed signature →
    modal closes → PDF expanded with active overlay → "Confirm & sign" →
    ends up "Signed & verified" with a new hash. The bottom block was
    simplified to avoid duplicating the flow (it no longer has its own
    "Add signature to document" button or the inline `SignatureCanvas" —
    all of that lives in the modal).

What's **not** in this roadmap because it's already resolved: signing the
contract in-app, reading the PDF inside the page, downloading the document
(original or signed), and the real data of the 4 existing contracts.

---

## Appendix: discarded decisions

Old content, no longer current — kept here instead of deleted, as a
record of how the decisions above were reached.

### "The concrete problem to fix" (original version)

Replaced by "The separation" at the top of the doc. This was the finding
that led to that decision:

In our Labels section, **the 3 tabs (Browse / Submissions /
Contracts) all show the same fixed `<h1>Labels</h1>`** — neither the breadcrumb
nor the title change depending on which tab you're on. That's why "it's not
called Contracts": technically the tab exists, but the page never confirms
which section you're standing in. It's a labeling bug, not an architecture
problem.

### "Rebuild plan" (original version, assumed Contracts as a Labels tab)

Replaced by "Migration strategy" — step 1 below assumed
that Contracts stayed as a tab inside Labels, which is no longer the case:

1. **Dynamic title per tab.** `labels/page.tsx` → "Labels" (it's the
   directory/browse), `labels/submissions/page.tsx` → "Submissions",
   `labels/contracts/page.tsx` → **"Contracts"**. A one-line change per
   file, but it's the fix you actually asked for.
2. **Search box in the contracts list** (`labels/contracts/page.tsx`) —
   free-text filter over release/label, same pattern `FilterDropdown`
   already uses in other dashboard lists, no need for a new
   library.
3. **"Show N per page" selector** — optional until there are more than ~10
   real contracts; noted but not urgent with 1 mock contract.
4. **Confirm breadcrumb** — it already says "Labels › Contracts", that's fine,
   it's the `<h1>` that needs fixing, not the breadcrumb.

## Roadmap — signing flow bugs (reported by the user, unfixed)

Tested by me before and it worked end to end, but the user tested it
later in their own browser and found 3 real problems. Noted for the
next coding session — nothing has been touched yet.

1. ✅ **The pencil doesn't register across the whole PDF viewer** — fixed:
   `PdfContractViewer.tsx` now has a new prop, `frameOverlay`, separate
   from `children`. `children` still serves the
   `SignatureOverlay` (it has to sit exactly over the page, so the
   `embedSignatureInPdf` math doesn't get misaligned). `frameOverlay` is
   rendered as a sibling of `onPageSurfaceRef`, inside the scrollable
   container (`relative flex justify-center overflow-auto ... p-4
   max-h-[70vh]`, to which I added `relative`), so with `absolute
   inset-0` it covers **the entire visible frame**, not just the page's
   canvas. `ContractSignClient.tsx` passes the "click to sign" button
   through `frameOverlay` instead of `children`. Verified with
   `getBoundingClientRect`: the overlay now measures the same as the
   container (minus the scrollbar gutter), instead of being confined to
   the size of the page alone — and the modal still opens correctly on
   click.
2. ✅ **After placing the signature, it wasn't clear you had to
   confirm** — fixed: the "Confirm & sign" / cancel controls were
   moved from the separate card to a block right below the
   PDF viewer, inside the same expanded accordion (in
   `ContractSignClient.tsx`). The card below ("Sign this contract") now
   hides while `placing` is active, so the action isn't duplicated in two
   places. Tested end to end: create signature → place it → "Confirm &
   sign" right by the PDF → "Signed & verified" with a new hash.
3. ✅ **The PDF doesn't update with the embedded signature** — retested
   after fixing points 1 and 2, and **it already works without touching any
   new code**: with the flow done end to end (create signature → place →
   Confirm & sign, right by the viewer), the accordion stays open,
   `PdfContractViewer` reloads on its own with the new `blob:` (react-pdf
   reacts to the `file` prop changing), and the signature appears burned
   into the page, on the "On behalf of the ARTIST" line — confirmed
   visually by zooming in the browser. This was a symptom of points 1 and 2
   (the user couldn't actually reach confirmation, so there was never a new
   PDF to show) — not a bug of the viewer itself. No code needed to be
   written for this point.

**Note:** I tested this whole flow in my preview browser and it worked
(ended up "Signed & verified" with a new hash) — so the underlying mechanism
(`embedSignatureInPdf`, `signContract`) works at least in that case. The 3
points above are **UX/discoverability** issues (not finding the clickable
area, not seeing the confirmation) and possibly a real viewer-refresh bug —
not necessarily that the PDF-lib is broken.

## The signing process, plain and simple (spec agreed with the user)

This is what has to happen, in simple words, and it defines how to close
points 2 and 3 above:

1. The producer sees the real PDF inside the app — the same document the
   label sent, page by page, not a generic icon.
2. They bring their signature (drawn/typed/uploaded/photo) once, it gets
   saved.
3. They drag it as an object over the PDF, to the exact place that says
   "Authorized Signature" — enlarge, shrink, rotate it, until it's well
   placed there, in real time, over the real document.
4. On confirming, **no separate "signed" record is saved** — a real new
   PDF is generated: the original + the signature embedded on that page,
   at those exact coordinates, as if it had been drawn by hand there. That
   new file (not the original) becomes the valid document from then on.
   This already exists (`embedSignatureInPdf` + `pdf-lib`), it doesn't
   change.
5. **What's missing (this is the new thing that needs to be built):** the
   PDF generated in step 4 has to **replace the one being shown in the
   viewer**, right there, without the user having to reload the page or
   reopen anything — so there's clear visual proof that it got signed
   (they see the signature already in place, on the real document, where
   they left it).
6. **And an explicit confirmation** — a clear message that it went well
   ("you signed correctly" / what today says "Signed. This contract is
   now active." but more visible, attached to the action, not lost in
   another card) — and, in the future, also consider reading confirmation:
   confirming the user actually saw/read the document before signing, not
   just that they tapped the button (see the tension already noted in
   "Layout and interaction of ContractSignClient" about the PDF collapsed by
   default).

This expands (doesn't replace) points 2 and 3 of the roadmap above — that's
where the reported symptoms stay, here's **the criterion for what
"fixed" means**: viewer updated with the new PDF + visible confirmation.

## The REAL root cause of the 3 bugs (found by debugging with measurements)

**Important correction:** the ✅ marks I put earlier on points 1-3 were
wrong — I "fixed" them by testing in a large window where the bug didn't
manifest, and the user reported them again. Debugging with
`getBoundingClientRect` I found that **the 3 symptoms all came from a single
cause**, and it wasn't any of my previous hypotheses:

**The PDF's scrollable container (`PdfContractViewer`) used `flex
justify-center` without `items-start`.** In a flex row, `align-items` is
`stretch` by default, so flexbox **stretched the page surface**
(`onPageSurfaceRef`) vertically to the height of the visible container
(~588px) instead of letting it measure the real height of the PDF (734px).
That broke two things at once:

1. **The pencil (bug 1):** the `absolute inset-0` overlay that was on the
   scrollable container (my earlier "fix" with `frameOverlay`) only covered
   the visible height (~620px), not the full canvas (734px). Scrolling
   down, the pencil disappeared → "only shows up in one part".
2. **The signature misplaced / PDF "unchanged" (bugs 2 and 3):**
   `handleConfirmSignature` computes `yPct = frame.y / surfaceHeight`. With
   `surfaceHeight` stretched to 588 instead of 734, the signature got
   embedded **too far down or straight off the page** (if `frame.y`
   exceeded 588, `yPct` gave >100% → negative coordinate → signature below
   the edge, invisible). That's why "the PDF looks the same": the signature
   was being embedded but in a place that wasn't visible. That's also why
   it worked for me in a large window: there the PDF fit without scrolling
   (70vh > 734), it didn't stretch, and the math happened to come out right.

**The real fix (corresponding commit):**
- `PdfContractViewer.tsx`: add `items-start` to the scrollable container →
  the surface measures the real PDF height (734), not the stretched one.
  Confirmed with measurements: `pageSurfaceHeight === canvasHeight === 734`.
- Move the pencil overlay from `frameOverlay` to `children` (inside the
  page surface) → covers the full page (734) and scrolls with it.
  Confirmed: reachable with the pencil even scrolled all the way down.
  The `frameOverlay` prop was removed (no longer needed).
- `key={fileUrl}` on `<Document>` → guarantees react-pdf reloads with the
  signed blob (defensive).

**Verified end to end with the bug reproduced** (1280×900 window,
where the PDF does scroll): typed signature → placed → confirmed →
`placement` saved with the correct `yPct` (51.77% = 380/734, before it would
have been 64.6% = 380/588) → and the signature "Naial" **shows burned into
the displayed PDF**, confirmed with a pixel zoom on the canvas.

## The full funnel: Browse → Submit → Accepted → Chat → Contract → Signed

**Starting point:** in the submissions mock, `s4` (JIK / Never Leave →
Dear Deer Music) is at `status: "accepted"`. Separately, in the contracts
mock, `c7` (JIK/Never Leave, Dear Deer Music, `kind: "signable"`) already
exists as the real contract the producer signs in the
`ContractSignClient` flow. Today those two things **aren't connected** —
they're two separate entities that happen to talk about the same subject.
What's missing isn't "adding a chat": it's **wiring up the entire funnel**
so it's a single narrative thread, not loose pieces. The chat is the missing
piece in the middle, but designing it well requires first mapping out the
whole journey.

### The funnel steps, as they exist (or should exist) today

1. **Browse** (`/dashboard/labels`) — the producer discovers a label, sees
   its accepted genres. *Already exists.*
2. **Submit** (`SubmitTrackForm` on the label's detail) — uploads a demo
   (.wav/.mp3), picks a genre (restricted to what the label accepts),
   optional note. A `LabelSubmission` is created with `status: "sent"`.
   *Already exists, recently redesigned.*
3. **The label responds** — today this is a mock status change with no
   visible event other than the badge in `/dashboard/labels/submissions`
   (`sent → listening → accepted | passed`). *The state already exists, not
   the event.*
4. **Accepted opens a conversation** — **this is what's missing.** Today
   tapping an `accepted` submission does nothing (the `<li>` in
   `labels/submissions/page.tsx` isn't clickable). It has to:
   - Be clickable only when `status === "accepted"` (or `"listening"`,
     debatable — can the label open the chat before deciding, to ask for a
     different version? Probably yes, but the strong case is `accepted`).
   - Lead to a 1:1 chat with that label, with an already-generated seed
     message (server-side / mock) that gives context: something like
     *"We loved JIK / Never Leave! We want to move forward with a licensing
     deal — when could you have the contract ready to sign?"* followed by a
     brief exchange where dates are agreed on, ending in *"We're sending you
     the contract, let us know when you sign it."* — the seed conversation
     the user asked for.
5. **The contract arrives** — today this is instant/magic: `c7` already
   exists in the mock with `status: "pending_signature"`, there's no event
   that "sends" it. With the chat in between, it makes sense for the
   **label's last message in the conversation to include a link to the
   contract** (`/dashboard/contracts/c7`) — so the contract doesn't appear
   out of nowhere in `/dashboard/contracts`, but is instead received by the
   producer *from someone*, in the thread where dates and terms were
   discussed. Reinforces that Contracts and Label Deals are separate
   sections but **the narrative connects them**.
6. **Sign** (`ContractSignClient`) — the producer signs. *Already exists,
   recently fixed.*
7. **(Optional loop) Back to chat** — after signing, should the producer be
   able to return to the same thread to say "done, signed"? It's coherent
   with point 5 (the label asked to be notified) and avoids the chat feeling
   "cut off" right when the contract comes into play. Probably yes, but
   it's not a blocker for v1 — can be noted as a follow-up.

### The other case: the label reaches out first (no submission involved)

The user explicitly asked to account for this: **a label wants to talk
about a project without there being an accepted track**. Real examples: a
label saw the producer in Discover and wants to propose a remix; wants to
chat about an EP before any demo exists; wants to reconnect with a producer
they've worked with before. This **can't depend on `LabelSubmission`** as a
trigger — it needs to be an independent outreach flow.

This has an important design consequence for the data model: a conversation
with a label **can't require a `submissionId`** as a mandatory field. It has
to be able to be born from:
- an accepted submission (case 1, more common today),
- or direct contact initiated by the label (case 2, no submission).

### Reuse the chat infrastructure that already exists (Connections), don't invent another one

Before designing a new chat specific to labels, it's worth noting that
**a complete chat system already exists** for artist↔artist connections:
- `types/message.ts`: `Conversation { id, peer: FeedbackProducer, connectionId,
  createdAt }` and `ChatMessage { id, conversationId, fromMe, text, createdAt }`.
- Page `/dashboard/connections/chat/[id]/page.tsx` — bubble UI, input,
  sending, already built and working.

The problem is that `Conversation.peer` is a `FeedbackProducer` (`{id, name}`)
and `connectionId` assumes it always originates from a `ConnectionSuggestion`
between two producers. To reuse this with labels there are two paths:

- **(A) Generalize `Conversation`** — `peer` becomes a discriminated union
  (`{ type: "producer", ...FeedbackProducer } | { type: "label",
  ...ProtonLabel }`), and `connectionId` becomes optional, replaced by a
  more generic `origin: { type: "connection", connectionId } |
  { type: "submission", submissionId } | { type: "label_outreach" }` field.
  A single chat system for everything (artist↔artist and label↔artist). More
  refactor work now, but avoids having two parallel messaging systems
  that need to be kept in sync (unread badges, notifications,
  etc. — all in one place).
- **(B) Separate chat system for labels** — its own `LabelConversation`,
  with its own route (`/dashboard/labels/chat/[id]`), copying the UI
  pattern but with its own type. Less risk of breaking Connections (which
  already works and is tested), but duplicates messaging logic that later
  has to be maintained twice if features are added (attachments, "typing"
  indicators, etc.).

**Recommendation:** (A) — the user's explicit request is to "boost
communication both between artists and between labels and producers", which
suggests that in the future they'll want to see *all* chats in one place
(a unified inbox), not two messaging sections that don't talk to each
other. Generalizing now is more work but avoids a painful migration
later.

### Where this lives in the navigation

Right now "Connections" is its own sidebar item with its own chat.
If we generalize the chat (option A), there's an open question: do chats
with labels show up mixed into `/dashboard/connections` (a single inbox), or
does "Label Deals" get its own chats tab separate from Browse/Submissions but
reusing the same UI component? Leaning toward: adding a **"Messages"** tab
inside "Label Deals" (alongside Browse/Submissions) that lists
conversations with labels, but internally renders the same chat page that
already exists in Connections — so "my producer network" and "my labels"
don't get conceptually mixed, but the chat UI itself isn't duplicated
either.

### What needs to be defined before building (not blocking, but has to be decided)

1. Does the "open chat" button appear in the Submissions list (`accepted` ⇒
   clickable) or in the submission's detail (if a detail ever exists)?
   Today there's no submission detail page, only the `<li>` in the list.
2. Who can initiate direct outreach (case 2)? In this prototype the
   producer is the only real user — the "label" side is simulated. So in
   practice this looks like: mock data already brings in a conversation
   "started by the label" with `fromMe: false` messages waiting for a
   reply, appearing in a "Messages" inbox without the producer having done
   anything. Consistent with how the rest of the prototype already works
   (everything "the other party does" is pre-scripted in mock data).
3. Is the contract link inside the chat (step 5) a text message with a
   normal link, or a special message type ("attachment card") with the
   contract's name and a "View contract" button? The second is cleaner and
   sets a precedent for attaching things to the chat in the future (audio,
   PDFs).
4. If (A) generalizes `Conversation`, is it necessary to migrate Connections'
   Zustand `persist` (users who already have conversations saved in
   localStorage) or, since it's a prototype with no real users, can it be
   broken without looking back? Probably the latter, but noted just in
   case.

**None of this is implemented yet** — this block is the map before touching
code, as requested. Next step, once the above is resolved: implement (A),
the JIK/Dear Deer Music seed conversation, and the "Accepted" → chat link in
`labels/submissions/page.tsx`.

## Resolving the 4 questions: designed for human connection, not pressure

The explicit request was: not a typical product-chat solution (the one that
copies WhatsApp/Slack without thinking), but something that **feels real,
trustworthy, friendly, and doesn't generate pressure**. Before resolving the
4 questions, I researched what UX design says and how this is handled in
the real industry (A&R at record labels) — not to copy a pattern, but to
have a sense of **what to avoid**.

### What I found (and why it changes the decisions below)

- **Presence and read indicators generate pressure, not trust.**
  Discord explicitly decided not to have "seen" / double-check marks — its
  co-founder Jason Citron sums it up like this: *"we want chats to feel relaxed"*.
  A "seen at 2:32 PM" turns every message into a test: if you don't reply
  fast, it looks like you're ignoring someone. ([Does Discord
  Have Read Receipts? — socialagechecker.net](https://socialagechecker.net/blog/does-discord-have-read-receipts/))
- **Well-designed async respects the other person's time, it doesn't interrupt it.**
  Basecamp/37signals' philosophy is "real-time sometimes, async most of the
  time" — they avoid false urgency on purpose, because a green "available"
  dot is, in practice, an invitation to be interrupted all the time.
  ([Basecamp — The 37signals Guide to Internal
  Communication](https://basecamp.com/guides/how-we-communicate))
  Twist (Doist) built its entire team chat around removing that
  anxiety: threads instead of a continuous stream, so each conversation
  can be picked back up when the person has the headspace for it, not when
  the notification pops up. ([Twist by Doist: Transforming Team Chat From Chatty to
  Calm](https://crm.org/news/twist-it-up-with-doists-team-chat-app))
- **In the real industry, what builds trust between a label and an artist is
  personal treatment, not efficiency.** A senior Columbia Records executive
  puts it this way: *"if someone entrusts you with their career, never treat
  them like a commodity or a flash in the pan — you're part of the team that
  helps launch their dreams"*. The A&R↔artist relationship is, literally, the
  part of the label business that most depends on feeling human and not
  transactional. ([Building Trust Between Artists and Music Labels — Fira
  Music](https://www.fira-music.com/blog/youtubeformusicians-cbdar-kpm4e))
- **A warm, personal tone builds measurable trust, a corporate tone doesn't.**
  Addressing someone by name, using contractions, sounding like a person
  and not a system — this is what makes a message feel trustworthy instead
  of robotic. ([UX Microcopy: Tiny Words That
  Build Massive Trust — Medium](https://medium.com/design-bootcamp/ux-microcopy-tiny-words-that-build-massive-trust-c5ebb53388e1))
- **Marketplace messaging (Airbnb) builds trust by showing the other party
  as a real person before any money is involved** — profiles, context,
  messages that confirm and give clear instructions, not just a "contact"
  button. ([Airbnb UX Design Case Study —
  rockpaperscissors.studio](https://rockpaperscissors.studio/airbnb-ux-design-case-study-building-trust-in-peer-to-peer-travel/))

**Translated into concrete design principles for this chat:**

1. **No "seen".** The message shows it was sent (✓ sent), never that it was
   read nor at what time. No one knows if the other party has already seen
   it — so no one feels "they're being ignored" or that "they have to
   reply now".
2. **No "online" indicator or last-seen.** Neither the producer nor the
   label broadcast real-time availability. This is async by
   design, like Basecamp — you reply when you can, not when the green
   dot says you have to.
3. **No urgency badges or SLAs.** No "reply within 24h" and no
   countdown. The unread badge (if it exists) is a neutral number, not a
   red icon with an exclamation mark.
4. **First-person, specific tone, never generic.** The seed message
   doesn't say "Your submission has been reviewed" (system language) — it
   says something like what I already wrote in point 4 of the funnel:
   *"We loved JIK / Never Leave!"*, with the real track name, like a
   person who actually listened to it would write it.
5. **The contract is handed over, not "attached".** See question 3 further
   below — the difference between a system that uploads a file and a
   person who tells you "here's the contract" matters for the tone.

### Question 1 — Where does the "open chat" button live?

**Resolved: directly in the `Submissions` row, no intermediate detail
page.** Adding a detail page just to put a button there would be extra
friction for no reason — the goal is to bring the person closer, not add a
step. When `status === "accepted"` (and also `"listening"`, because
the label may want to talk before deciding — ask for another version,
ask something about the track — and forcing them to wait until "accepted"
to be able to write would be exactly the kind of artificial friction we
want to avoid), the row becomes clickable and leads straight to the chat.

### Question 2 — Who triggers a label's direct contact (no submission)?

**Resolved: mock data preloads conversations already started by the
label**, with `fromMe: false` messages waiting for a reply, appearing in a
"Messages" inbox — same pattern the rest of the prototype already uses
(everything "the other party does" is pre-written, because there are no
real labels on the other side). What matters, given the anti-pressure
principle above: that it **appears without alarm** — no aggressive push
notification, no blinking red badge. It appears in the inbox as something to
read when there's a moment, not as an emergency. Consistent with points 2
and 3 of the design principles.

### Question 3 — Does the contract arrive as a text link or as an attached "card"?

**Resolved: attached card, but rendered as part of the label's message,
not as a separate system notification.** The difference matters for
the tone: a system message like *"📎 Document uploaded:
dear-deer-licensing-agreement.pdf"* feels like an audit log. Instead,
the label writes something like *"Here's the contract — any questions while
you read it, let me know"*, and **below that text**, inside the
same bubble, the contract card appears (name, icon, "View
contract" button → `/dashboard/contracts/c7`). It's the person handing it
to you, the file is part of what they said, not a separate event. This also
sets the right pattern for attaching things in the future (a demo, a notes
PDF) without the chat starting to fill up with cold system messages.

### Question 4 — Does Connections' `persist` need migrating when generalizing `Conversation`?

**Resolved: no.** There are no real users yet — all the state persisted
today is just the initial mock plus whatever each person generated testing
locally. Generalizing the type (option A) without a migration path is
acceptable here; if this ever goes to production with real users, that's
when the Zustand store needs to be versioned (`persist` supports `version` +
`migrate` for that, noted for when it applies, not now).

### What's left to implement (with this map already resolved)

1. Generalize `types/message.ts`: `Conversation.peer` → discriminated union
   producer/label; `connectionId` → optional `origin`
   (`connection` | `submission` | `label_outreach`).
2. New **"Messages"** tab in `LabelsTabs.tsx`, listing conversations
   with labels (same chat component already in Connections,
   reused, not duplicated).
3. Submissions row clickable at `accepted`/`listening` → opens/creates the
   conversation.
4. JIK/Never Leave ↔ Dear Deer Music seed conversation in mock data:
   brief date negotiation, ending with the `c7` contract card
   attached to the label's last message.
5. At least one mock "direct outreach" conversation (label with no
   submission involved) to test that the data model truly
   doesn't depend on `submissionId`.
6. No "seen"/"online"/urgency indicators in the chat UI —
   validate that the reused Connections component doesn't already have
   them (if it does, remove them there too, since the principle
   applies to all platform messaging, not just labels).

## Important boundary: what the app controls vs. what the label manager controls

Necessary correction to everything above: the 5 anti-pressure design
principles (no "seen", no "online", no urgency badges, warm
tone in seed messages, contract "handed over") are decisions **the app can
make** — they're product mechanics, UI, defaults. But **the actual content
of what a label manager writes to a producer isn't controlled by the
app**. Whether they reply fast or take a week, whether their tone is
warm or curt, whether they actually read the track before accepting it —
that's decided by the person on the other side of the chat. We can't
design that, only the frame in which it happens.

This separates two things that got mixed together in the previous block:

- **What IS the app's responsibility** (and where the 5
  principles apply): that the UI never *forces* a feeling of
  urgency or surveillance that the label manager has no control over —
  no one should feel pressure from a "seen" mark the app decided to
  show, even if the label manager on the other end is the warmest person
  in the world. These are mechanical decisions, not content ones, and
  they're 100% controllable.
- **What is NOT the app's responsibility**: the JIK/Dear Deer Music
  seed conversation I wrote as an example (*"We loved JIK / Never
  Leave!..."*) is **mock** content, useful for testing the prototype and
  showing what a good interaction would *look* like — but in the real
  product that text is written by the label manager, not a template the
  app imposes on them. There's no way to guarantee, through design, that a
  real label manager will be warm and human; you can only prevent the
  app itself from adding friction or coldness on top.

**Concrete consequence for what's worth building:** instead of
trying to control the label manager's tone (impossible), what the app
can offer are **optional aids, never mandatory**, to make writing
a warm message easier than writing a cold one — for
example, when opening the chat for the first time from an accepted
submission, a placeholder like *"Tell {producer} why you liked
{track}…"* instead of an empty field with no guidance. This is a
pending UX suggestion to evaluate for the label-manager side of the app
(which doesn't exist yet today — everything built so far is the producer's
view), not something to implement now.

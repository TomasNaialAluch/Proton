# Unify only "Contracts" + restore the document download

Trimmed-down version of the earlier doc (`unification-idea.md`, which talked
about Labels vs. Pro Access in general). Here the scope is smaller: **a
single place for "Contracts"**, and fixing something that got lost along the
way — the ability to download/open the original PDF.

## Unifying "Contracts" (narrow scope)

Browse and Submissions are untouched. The idea is that **"Contracts" has one
real home** — `Labels → Contracts` — and that Settings/Pro Access stops
having its own separate button, so it doesn't feel like there are two
distinct contract lists.

- Today: Pro Access has a "Contracts" button that **links** to
  `/dashboard/labels/contracts` (it doesn't duplicate anything, but visually
  it looks like its own section inside Settings).
- Idea: instead of a button that takes you elsewhere, make it explicitly a
  shortcut — same text, same icon, but maybe with the pending count next to
  it (`"2 awaiting signature →"`) so it's clear it's a *direct access point*
  to Labels, not a separate section.

This is small: no data or route restructuring, just a copy/UI tweak in
`settings/account/pro/page.tsx` so it doesn't compete with Labels as if it
were "another place for contracts."

## What got lost: downloading/viewing the original document

On the old page (`contracts/page.tsx`, before the redesign), each row in the
table had a **"View"** link that opened `contract.documentUrl` directly in a
new tab — that was the way to download/read the raw PDF.

When I rebuilt the section as `labels/contracts/page.tsx` +
`contracts/[id]/`, that link disappeared in two places:

1. **The list** (`labels/contracts/page.tsx`) — now each row is an entire
   link to the detail page, but there's no longer an icon/action to open the
   PDF without going into the detail.
2. **The detail** (`ContractDetailClient.tsx`) — the PDF is read *inside*
   the page (`PdfContractViewer`), but there's no "Download" or "Open in new
   tab" button. If someone wants the actual file (to save it, send it to an
   accountant, etc.), there's currently no way to do that.

It's a real regression, not a design decision — it happened because when I
added the in-app reader I assumed "reading it inside" replaced "opening it
outside," but they're different needs: **reading** vs. **keeping a copy of
the file**.

## Proposed solution

Add a download action to **the contract detail**, not the list (there,
entering is enough) — two cases:

- **Unsigned contract** (`documentUrl` is the static path in
  `public/contracts/...`): a "Download original" button that simply
  downloads that file as-is.
- **Already-signed contract** (`documentUrl` is the `blob:` generated when
  signing): same button, but now it downloads the PDF *with the signature
  embedded* — which is exactly the document someone will want to keep.

In both cases it's the same button / same code (`<a href={documentUrl}
download>`), because `documentUrl` already points to whatever's appropriate
for each state — no new logic is needed to decide which one to show, just
adding the button that was missing.

## Summary of what would change (idea-level, no code yet)

1. `ContractDetailClient.tsx`: add a "Download document" button next to the
   PDF reader (same style as the rest of the actions).
2. `settings/account/pro/page.tsx`: the "Contracts" button becomes a
   shortcut to Labels (with the pending count), rather than its own section
   — without touching routes or data.

None of this touches the signing flow that already works — it's about
completing what was missing (downloading) and smoothing out the duplicated
navigation (Settings vs. Labels).

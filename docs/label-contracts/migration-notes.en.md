# What happened to the old Contracts section

Note to leave a record of the reconciliation between what already existed and
the new Labels section. Without this, someone looking at the repo might think
there are two overlapping contract systems — there aren't, but it's worth
documenting why.

## What was there before the redesign

Commit `9a70295` ("feat(dashboard): contracts, royalties detail,
notifications, collapsible sidebar") created, before the Labels section
existed:

- `app/(dashboard)/dashboard/contracts/page.tsx` — flat contracts page:
  3 summary cards (Total / Signed / Labels), pending banner, list
  with different layout on mobile/desktop.
- `lib/mock/contracts.ts` — 4 mock contracts with `CONTRACT_LABEL_COLORS`.
- `types/contract.ts` — the original `Contract` type (`signed | pending |
  expired`, without `keyDates` or `signature`).

This is documented (as a changelog, now outdated) in `READMEMAIN.md`,
section **"1. Contracts Page — `/dashboard/contracts`"**.

## What the Labels section did with it

**It didn't duplicate it — it extended it.** `lib/mock/contracts.ts` and
`types/contract.ts` are *the same files*, not a parallel copy:

- `Contract` gained `keyDates`, `signature` (with `placement`), and the status
  `pending_signature` replaced `pending`.
- `mockContracts` now includes the real Dear Deer Music contract (`c7`) with
  the PDF served from `public/contracts/`.
- The original flat page (`.../contracts/page.tsx`) was **deleted** — it
  shows as `D` (deleted, uncommitted) in `git status` right now — and was
  replaced by `app/(dashboard)/dashboard/(producer)/labels/contracts/page.tsx`
  + `.../contracts/[id]/page.tsx`, which group by label and have the PDF
  viewer with in-app signing.

That deletion still needs to be committed — today the new file and the old
file's uncommitted `D` coexist in git.

## Entry points — already wired up, nothing to touch

- `settings/account/pro/page.tsx` (the "Contracts & Reports" section) already
  links to `/dashboard/labels/contracts` — the comment in the code says
  *"unified in the redesign"*, so this had already been anticipated.
- The nav (`AppSidebar`, `BottomNav`, `HamburgerMenu`) had a "Contracts" item
  → `/dashboard/contracts`; it's now **"Label Deals"** → `/dashboard/labels`.

## Loose references — cosmetic, nothing broken

These three do NOT read from `mockContracts` or `contractsStore` — they're
static text that mentions "contracts" in a different context. No need to
touch them, but they're noted here in case someone wants to wire them up for
real at some point:

- `components/dashboard/NotificationsPanel.tsx` — mock item *"Pending
  contract — The contract with Stellar Records requires your signature."*
  It doesn't link to any real id; it would be natural to point it to
  `/dashboard/labels/contracts/c7` if the notification should actually work.
- `components/dashboard/widgets/meta.ts` — a widget description says
  *"Art, metadata, contracts (mock)"*, it's just copy.
- `components/dashboard/DashboardPersonaChip.tsx` — a descriptive phrase for
  the dashboard, mentions "contracts" in passing.

## Pending

- [ ] Commit the deletion of `app/(dashboard)/dashboard/(producer)/contracts/page.tsx`.
- [ ] Update (or optionally delete) the contracts section in
      `READMEMAIN.md` — it describes the old page, which no longer exists.
- [ ] Optional: wire the "Pending contract" item in `NotificationsPanel`
      to the real contract (`c7`).

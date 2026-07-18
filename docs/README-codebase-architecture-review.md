# Codebase architecture review — maintainability & scalability

A structural pass over the repo (292 TS/TSX files, 35 docs) requested
directly — not tied to a specific feature — to check whether the codebase
is holding up as it grows. Findings below, evidence-based (grepped/counted,
not guessed).

## What's solid

1. **Two genuinely separate products in one repo, on purpose.** `(public)`
   is the real site backed by Proton Radio's GraphQL API
   (`lib/api/protonApi.ts`, real `fetch` calls, 5-minute revalidation).
   `(dashboard)` is the mock-data B2B producer/label-manager prototype.
   They share vocabulary (Artist, Label) because the domain overlaps, not
   because one copy-pasted the other — this isn't the kind of duplication
   worth collapsing.
2. **Real type discipline.** `tsconfig.json` has `strict: true`, and a
   full-repo grep for `: any` / `as any` across `app/`, `lib/`,
   `components/`, `types/` returns **zero matches**. Uncommon to hold that
   line consistently at this size.
3. **The pattern from this session's work holds up under reuse.** Composer
   page + sub-components per entity (Track/Artist/Label Detail), action
   cards that self-guard with an internal `return null` instead of the
   parent branching on role/ownership, shared primitives in
   `components/dashboard/_shared/` (`BackButton`, `LoadMoreButton`,
   `AvatarGradient`). Applied consistently, not just on the first page it
   was invented for.
4. **Docs-as-you-go culture.** Most feature areas have a
   `docs/feature-*.md` or `docs/README-*.md` explaining what's real vs
   mock, what was explicitly rejected and why, and an open roadmap —
   genuinely useful for picking work back up cold, unusually well kept up
   for a prototype.
5. Design tokens centralized as CSS custom properties in `app/globals.css`
   — no hardcoded colors found in components, dark/light handled through
   one attribute (`data-theme`).

## Real debt, ranked by impact

1. **No ESLint config is committed.** No `.eslintrc*` / `eslint.config.*`
   anywhere in the repo, despite `package.json`'s `lint` script being
   `next lint` and `ARCHITECTURE.md` listing `npm run lint` as a normal
   command. Today that command has nothing to run against. This is
   probably *why* several of the items below accumulated unnoticed —
   nothing was ever checking for them.
2. **Producer nav links are tripled, not shared.** `AppSidebar.tsx`,
   `HamburgerMenu.tsx`, and `BottomNav.tsx` each hardcode their own copy of
   the producer nav item list. `ARCHITECTURE.md` already flags this as
   known debt (item #1 in its "known issues" section) and it's still
   unresolved. The fix already has a working precedent in the same
   codebase: the **label-manager** side of nav *is* centralized
   (`lib/dashboard/dashboardShellRouting.ts`, imported by all three nav
   components) — extending that same module to cover the producer item
   list is the whole fix, not a new pattern.
3. **`StatCard` and `KpiCard` are the same component**, defined separately
   in `components/dashboard/DashboardContent.tsx:516` and
   `app/(dashboard)/dashboard/(producer)/performance/page.tsx:275`.
   `ARCHITECTURE.md` already flags this too (item #3) — still open.
4. **`ARCHITECTURE.md` itself is stale.** It lists "BottomNav doesn't
   navigate, hardcoded active state" as an open bug (item #2), but
   `BottomNav.tsx` already uses `<Link>` + `usePathname()`-driven active
   state — that one's fixed. A debt doc asserting debt that no longer
   exists costs the next reader time re-verifying something already done.
   Worth a pass to reconcile it against current code, not just add to it.
5. **`docs/` has grown to 35 files** with no reliable index of which are
   current vs superseded. `ARCHITECTURE.md` has a doc-map table, but it's
   maintained by hand and already missing entries (this file and
   `docs/README-navigation-back-flow.md` weren't in it before this pass —
   fixed below, but nothing enforces it stays in sync going forward).
6. **A handful of large, monolithic files** that predate this session's
   composer/sub-component convention: `AppSidebar.tsx` (631 lines),
   `DashboardContent.tsx` (544), `HamburgerMenu.tsx` (442). Not urgent, but
   inconsistent with the pattern now established on Track/Artist/Label
   Detail — worth splitting the next time any of them is touched for an
   unrelated reason, rather than as a dedicated pass.
7. **The mock data model is implicitly single-tenant** — `mockArtist` is
   "the current logged-in user," `LABEL_SAMPLE_TRACKS` is one shared
   catalog rendered identically on every label's page (documented, not
   accidental — see `lib/mock/labelSampleCatalog.ts`). This is a
   deliberate prototype simplification, but it's also the direct cause of
   the breadcrumb bug fixed in `docs/README-navigation-back-flow.md`: any
   feature that assumes "a track has one real, unique owning label" will
   keep hitting this same class of gap until the mock model grows real
   per-entity ownership.

## Scalability read

The load-bearing structure — route groups for shared layouts without
leaking into URLs, Zustand stores split one-per-concern rather than one
giant store, the explicit `lib/mock/` → `lib/api/` swap path already
described in `ARCHITECTURE.md` — would hold up fine against a real
backend. Nothing built this session fights that shape. Everything above is
"hasn't been consolidated yet," not "wrong shape, needs a rewrite" — all
of it is a cleanup pass, none of it blocks continuing to build features on
top as-is.

## Not done in this pass

This is a review, not a fix — none of the debt above was touched except
adding this file (and itself) to `ARCHITECTURE.md`'s doc map. Cheapest
first move if/when picked up: extend `dashboardShellRouting.ts` to cover
the producer nav list (kills #2), then reconcile `ARCHITECTURE.md`'s known-issues
section against current code (kills #3 and #4 by either fixing or removing
stale claims).

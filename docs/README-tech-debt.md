# Tech Debt — Verified, Not Aspirational

`ARCHITECTURE.md` already lists some of these under "Problemas conocidos y deuda técnica," written early in the project. This file is a re-audit: what's actually still true today, what's gotten worse since it was first written, and what's new since that section was last touched. Each item below was verified against the current code, not copied from the old list.

---

## 1. Nav links tripled — still unfixed, and one detail `ARCHITECTURE.md` doesn't call out

`ARCHITECTURE.md` already correctly names all three offenders (`AppSidebar.tsx`, `HamburgerMenu.tsx`, `BottomNav.tsx`) — this isn't a new discovery, it's confirmation the fix still hasn't happened:

```
components/dashboard/AppSidebar.tsx:24    const dashboardLinks = [...]
components/dashboard/HamburgerMenu.tsx:85 const dashboardLinks = [...]
components/dashboard/BottomNav.tsx        const producerNavItems = [...]  // different shape
```

What the existing note doesn't mention: `BottomNav.tsx`'s array isn't just a third copy of the same shape — `producerNavItems` carries a different subset of fields/links than `dashboardLinks`. That means unifying these isn't a pure "extract and import" refactor; the shared source needs to account for the field/subset variance between desktop nav and the mobile bottom bar, or the unification will silently drop something one of the three currently renders. Renaming or adding a section today means touching three files by hand, with no compiler or lint check that would catch a missed one — the three lists can silently drift out of sync.

**Fix:** extract to `lib/constants/nav.ts`, exporting the link list(s) and an `linkIsActive(pathname, href, activePrefix?)` helper (as `ARCHITECTURE.md` already proposed), and have all three components import from it instead of defining their own.

## 2. `StatCard` / `KpiCard` duplicated in 4 places, not 2

```
app/(dashboard)/dashboard/(producer)/performance/page.tsx
components/dashboard/DashboardContent.tsx
app/(dashboard)/dashboard/(label-manager)/revenue/page.tsx
app/(dashboard)/dashboard/(label-manager)/roster/page.tsx
```

Each defines a near-identical metric-card component locally. `ARCHITECTURE.md`'s original note counted two occurrences (`StatCard` in `DashboardContent.tsx`, `KpiCard` in `performance/page.tsx`); it has since doubled without anyone updating that note. This is the exact failure mode `docs/README-routing-architecture.md` warns about in its closing section — the next page that needs a metric card copies the nearest existing one instead of reusing a shared component, because there isn't an obvious shared one to reach for.

**Fix:** unify into `components/ui/KpiCard.tsx` (the exact path `ARCHITECTURE.md` already proposed under "Estructura objetivo"), covering whatever prop variance exists between the 4 current versions (likely just a `small`/`compact` boolean), then point all 4 call sites at it.

## 3. `Sidebar.tsx` is still a dead placeholder file

```tsx
// components/dashboard/Sidebar.tsx
export default function Sidebar() {
  return (
    <aside>
      {/* Sidebar del dashboard — pendiente */}
    </aside>
  );
}
```

`AppSidebar.tsx` is the real, in-use sidebar. This file has been marked "delete this" in `ARCHITECTURE.md` since early in the project and was never removed. It's not imported anywhere — dead code whose only function is to confuse whoever greps for "Sidebar" and finds two files.

**Fix:** delete the file. Zero risk — confirm with a repo-wide search for `from ".../Sidebar"` first (excluding `AppSidebar`) to be certain, then `rm`.

## 4. No ESLint config exists

`package.json` wires `"lint": "next lint"`, but there is no `.eslintrc*` or `eslint.config.*` anywhere in the repo root:

```
$ find . -maxdepth 1 -iname "*eslint*"
(no output)
```

`next lint` without a committed config either falls back to Next's interactive first-run prompt (which creates one locally, not committed) or a bare default with no project-specific rules. Either way, nobody has been running a consistent, shared lint pass — `npm run lint` is a documented command that doesn't actually enforce anything repeatable across machines.

**Fix:** run `next lint` once to generate the config through its setup prompt (or hand-author `eslint.config.mjs` with the `next/core-web-vitals` + `next/typescript` presets), commit it, and consider wiring it into a pre-commit or CI step so drift doesn't reaccumulate silently the way the two duplication issues above did.

## 5. Three monolithic components, all from an earlier project phase

```
components/dashboard/AppSidebar.tsx      631 lines
components/dashboard/DashboardContent.tsx 544 lines
components/dashboard/HamburgerMenu.tsx    442 lines
```

These predate the split-by-responsibility pattern now consistently used in every `*/detail/` folder (`labels/detail/`, `tracks/detail/`, `artists/detail/` — each one composer + several single-purpose sub-components, established starting with Labels Browse/Detail and explicitly followed since). The three files above never got the same treatment, likely because they existed before that pattern was adopted and nobody's gone back to retrofit them.

**Fix:** not urgent on its own, but tackle this *after* items 1–3 above, since a chunk of what makes these three files long is exactly the inline nav-link arrays (issue 1) and inline stat-card markup (issue 2) — fixing those first will shrink all three files for free before any deliberate splitting work.

---

## If picking 3 to fix right now

1. **`lib/constants/nav.ts`** — highest-risk item; the only one where staying broken risks a real, user-visible inconsistency (a renamed section showing the old name on mobile but not desktop, for example).
2. **Delete `Sidebar.tsx`** — zero-risk, one command, no reason to keep deferring it.
3. **Unify `StatCard`/`KpiCard` into `components/ui/KpiCard.tsx`** — before a 5th call site copies one of the existing 4 and the count keeps climbing.

Items 4 and 5 are real but lower urgency — ESLint's absence hasn't caused a visible bug yet, and the monolith files, while long, aren't actively causing bugs today either.

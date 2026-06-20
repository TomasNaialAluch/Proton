# Design and product vision — April 9, 2026

Working document to pick the thread back up when development continues: what was done, what was dropped for now, and **how to think about the UI so it makes sense for a producer** (the artist dashboard user).

---

## 1. Product / UI changes already applied

- **Unified dashboard shell** (`app/(dashboard)/layout.tsx`): the sidebar, mobile top bar, and bottom nav wrap every route in the group, not just the home page. This way Performance, settings, and the rest share the same structure and don't "lose" the sidebar on desktop.
- **Dashboard home** (`dashboard/page.tsx`): only mounts the content (`DashboardContent`); doesn't duplicate the layout.
- **Breadcrumb on Performance**: `Dashboard > Performance` with a link to `/dashboard`, for orientation without reloading the chrome.
- **Sidebar**: active link based on `usePathname` (includes the `/dashboard/settings` prefix for all settings sub-routes).
- **Sidebar brand**: a typographic logo from `public/logo txt.png` ("PROTON / SOUNDSYSTEM" text) instead of plain text; links to the dashboard.

---

## 2. Explicit decisions (for now)

- **Not** adding a desktop **white top bar** with just the **isotype** (`Logo ISO.png`) centered.
  - **Reason**: on desktop there's already a **sidebar** with the brand; an extra, purely decorative strip duplicates the message, takes useful height away from content (metrics, tables), and the PNG with a **black background** would clash against white until there's a transparent or theme-specific variant.
  - **Agreed alternative**: show the isotype where there's already a natural bar (e.g. the **mobile header**), favicon / `app/icon`, marketing, empty states — instead of a second "frame" on desktop.

This decision can be revisited once **final assets** exist (transparent background, light/dark mode), or if the top bar **does something** (global search, account, context), not just brand.

---

## 3. Visual coherence (guiding lines)

- **A single surface system**: `bg-background`, `bg-surface`, borders with the `--color-border` token. Avoid "always white" blocks that ignore dark mode unless it's a conscious decision.
- **Accent** `#E67E22`: already anchors the "Proton" identity; the orange isotype fits when used over neutral or transparent backgrounds.
- **Less chrome, more data**: the producer opens the dashboard for **numbers and actions** (streams, royalties, releases). Every pixel spent on a repeated bar competes with that read.
- **Hierarchy**: sidebar = navigation + brand; content = page title + breadcrumb where it helps; no three levels of logo without a function.

---

## 4. Vision: what the producer needs to be pleased

Think of the user as someone who **lives off music** and drops into the panel occasionally: they want **trust, clarity, and little friction**, not a portfolio of effects.

1. **Trust**: readable data, honest loading states, understandable errors; the brand has to feel **professional**, not amateur.
2. **Fast scanning**: KPIs and tables first; decoration after. If something doesn't help decide or navigate, it's a candidate to trim or move to marketing.
3. **Continuity** between "radio/streaming" and "backoffice": same type family, same color tokens, same tone (technical but human).
4. **Real mobile**: many artists check metrics from their phone; the bottom nav + compact header are the natural place for brand reinforcement **without** duplicating it on desktop.

When in doubt between "more branding" and "more room for data", **default to data**; strong branding can live in login, landing pages, and the site icon.

---

## 5. Suggested next steps (when it's time)

- Export the **isotype logo** (and the wordmark, if applicable) with a **transparent background** and, if the design calls for it, a dark-background variant.
- Replace the "Proton" text in the **mobile navbar** with the isotype or a small lockup, in line with the decision not to duplicate it on desktop.
- Review `logo txt.png` in **light mode**: the PNG's black background can read as a "patch"; consider a wordmark over transparent, or a container that respects the tokens.

---

*Document last updated: April 9, 2026.*

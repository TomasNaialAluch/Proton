# Dashboard routes

This tree uses Next.js App Router **route groups**: folders in parentheses are **not** part of the URL.

## `(producer)`

Producer routes: home at `/dashboard`, performance, contracts, royalties, platform, settings, etc. This is the "classic" artist/producer view.

## `(label-manager)`

Routes for the **label manager** prototype: roster, catalog, revenue, statements. They share the same dashboard layout as the producer.

## `releases` (outside the groups)

The URL **`/dashboard/releases`** is unique: two `page.tsx` files cannot exist for the same route. That's why this page lives here and **orchestrates** based on the active role (`usePrototypeViewStore`):

- **Label manager** view: uses components in `components/dashboard/label-manager/` (e.g. `LabelReleasesPipeline`).
- **Producer** view: placeholder in `components/dashboard/producer/` until real UI exists.

## Related code

| Area | Location |
|------|-----------|
| Shared UI (breadcrumb, etc.) | `components/dashboard/_shared/` |
| Label-manager-only UI | `components/dashboard/label-manager/` |
| Producer-only UI (placeholders) | `components/dashboard/producer/` |
| Label manager mocks | `lib/mock/label-manager/` |
| Label/artist scope state | `lib/store/label-manager/labelScopeStore.ts` |
| Entry routes and label vs producer nav | `lib/dashboard/dashboardShellRouting.ts` |

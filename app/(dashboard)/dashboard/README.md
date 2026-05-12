# Rutas del dashboard

Este árbol usa **route groups** de Next.js App Router: las carpetas entre paréntesis **no** forman parte de la URL.

## `(producer)`

Rutas del productor: home en `/dashboard`, performance, contratos, regalías, plataforma, ajustes, etc. Es la vista “clásica” del artista/productor.

## `(label-manager)`

Rutas del prototipo **label manager**: roster, catálogo, ingresos, estados de cuenta. Comparten el mismo layout del dashboard que el productor.

## `releases` (fuera de los groups)

La URL **`/dashboard/releases`** es única: no puede existir dos `page.tsx` para la misma ruta. Por eso esta página vive aquí y **orquesta** según el rol activo (`usePrototypeViewStore`):

- Vista **label manager**: usa componentes en `components/dashboard/label-manager/` (por ejemplo `LabelReleasesPipeline`).
- Vista **producer**: placeholder en `components/dashboard/producer/` hasta que exista UI real.

## Código relacionado

| Área | Ubicación |
|------|-----------|
| UI compartida (breadcrumb, etc.) | `components/dashboard/_shared/` |
| UI solo label manager | `components/dashboard/label-manager/` |
| UI solo producer (placeholders) | `components/dashboard/producer/` |
| Mocks del label manager | `lib/mock/label-manager/` |
| Estado de scope label/artista | `lib/store/label-manager/labelScopeStore.ts` |
| Rutas de entrada y nav label vs producer | `lib/dashboard/dashboardShellRouting.ts` |

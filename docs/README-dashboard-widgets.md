# Dashboard widgets (Proton)

Referencia de los **widgets del tablero del artista**: catálogo en código, datos mock para los que aún no tienen API, y dónde extender.

## Dónde vive en el repo

| Pieza | Archivo |
|--------|---------|
| Orden por defecto, tipo `WidgetId`, persistencia | `lib/store/dashboardStore.ts` |
| Datos mock compartidos (nuevos widgets) | `lib/mock/dashboardExtendedWidgets.ts` |
| Registro id → componente, meta del modal | `components/dashboard/widgets/` (`registry.tsx`, `meta.ts`) |
| Orquestación: hero, DnD, modal, grilla | `components/dashboard/DashboardContent.tsx` |

Para añadir un widget nuevo hay que tocar al menos: `DEFAULT_WIDGET_ORDER` en el store, `WIDGET_META` y `DASHBOARD_WIDGETS` en `components/dashboard/widgets/`, y el nuevo archivo de widget en esa misma carpeta (más mocks si aplica).

El store usa **`merge` en persist**: si el usuario tenía guardado un orden con menos widgets, al cargar se **añaden los ids faltantes** al final sin perder el orden previo de los que ya existían. Los ids **nuevos respecto a lo guardado** quedan **ocultos por defecto**, salvo los cuatro originales (`DEFAULT_VISIBLE_WIDGET_IDS` en el store).

**Primera visita y Reset:** solo están **visibles** los cuatro widgets originales (Streams, Latest Tracks, Streams by Release, Royalties); el resto figura en **Manage widgets** y se puede activar cuando quieras. Si ya tenías en `localStorage` los 18 visibles de una sesión anterior, **Customize → Reset** vuelve a ese comportamiento.

---

## Widgets en el tablero (orden por defecto)

Todos aparecen en **Manage widgets**; el usuario puede ocultar, reordenar (drag) y restaurar. Los marcados **mock** usan datos de ejemplo hasta conectar backend.

| ID (`WidgetId`) | Título (UI) | Descripción |
|-----------------|-------------|-------------|
| `streams` | Streams | Evolución de streams (últimos 6 meses). |
| `latest-tracks` | Latest Tracks | Temas más recientes. |
| `streams-by-release` | Streams by Release | Comparación por lanzamiento. |
| `royalties` | Royalties | Avance hacia el próximo pago. |
| `listeners-growth` | Listeners | Oyentes / tendencia 7·28d · **mock** |
| `top-territories` | Top territories | Ranking por país · **mock** |
| `play-sources` | Play sources | Playlist vs perfil vs búsqueda · **mock** |
| `rising-tracks` | Rising tracks | Temas con mayor crecimiento · **mock** |
| `upcoming-releases` | Upcoming releases | Calendario singles / EP / álbum · **mock** |
| `distribution-status` | Distribution | En revisión, en tiendas, rechazos · **mock** |
| `catalog-codes` | Catalog codes | ISRC / UPC + hint del último track · **mock** |
| `royalties-by-store` | Royalties by store | Desglose por DSP · **mock** |
| `payout-history` | Payout history | Últimas liquidaciones · **mock** |
| `pending-tasks` | Pending tasks | Arte, metadatos, contratos · **mock** |
| `notifications-feed` | Notifications | Pagos, strikes, aprobaciones · **mock** |
| `smart-links` | Smart links | Pre-saves / bio link · **mock** |
| `social-overview` | Social | Posts y calendario · **mock** |
| `audio-metadata` | Audio & metadata | LUFS y avisos de campos · **mock** |

---

## De README “ideas” a implementación

Las secciones que antes estaban solo como ideas (**audiencia, catálogo, ingresos, tareas, promo, calidad**) tienen ahora un **widget mock** correspondiente en `components/dashboard/widgets/`, alineado con `docs/README-dashboard-widgets.md` histórico. Sustituir mocks por queries reales implica definir contratos de API y pasar datos vía `DashboardWidgetProps` (o props específicas por widget).

---

## Priorización sugerida (conectar a datos reales)

Suele dar más valor primero: **top territorios**, **fuentes de escucha**, **próximos lanzamientos** y **royalties por tienda**, porque encajan con streams, releases y el widget de royalties ya existente.

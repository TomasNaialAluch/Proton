# Quick Access (dashboard) — guía del rediseño Proton

Este documento describe **qué debería representar cada ítem** de *Quick Access* en el panel de artista (SoundSystem / dashboard) y **a qué rutas o productos** conviene enlazarlo dentro del concepto de **sitio unificado** (radio pública + gestión B2B).

---

## Objetivo de la sección

*Quick Access* es un puente entre:

1. **Superficie pública (B2C)** — oyente: shows, sellos, mixes on demand.  
2. **Superficie privada (B2B)** — artista: cuenta, release links, etc.

Los ítems no deberían competir con la navegación principal *Dashboard* (Artists, Performance, Royalties…); complementan con **saltos frecuentes** hacia la radio y herramientas concretas.

---

## Ítems y destinos recomendados

| Ítem | Destino propuesto (app) | Tipo | Qué es / por qué |
|------|-------------------------|------|------------------|
| **Shows** | `/shows` | B2C público | Programación / archivo de shows (equivalente lógico a “contenido episódico” de la radio). |
| **Labels** | `/labels` | B2C público | Directorio de sellos distribuidos en Proton; discovery para oyentes y referencia de marca. |
| **DJ Mixes** | `/shows` **o** `/mixes` *(si se agrega ruta)* | B2C público | Alineado con **Mixes** en protonradio.com: biblioteca on demand por género. Hoy el prototipo concentra mucho de eso en `/shows`; si más adelante existe `/mixes`, ese es el destino natural. |
| **Charts** | `/dashboard/performance` | B2B artista | Vista de rendimiento / gráficos del artista (misma área que **Performance** en la nav principal; atajo en Quick Access). |
| **Release Links** | `/dashboard/settings/account/notifications` **o** ruta dedicada `/dashboard/release-links` *(futuro)* | B2B artista | Herramienta de **promo por release** (emails / enlaces de artista). En el repo ya hay contexto en ajustes de cuenta y notificaciones; una página propia queda más clara si el producto crece. |

**No hay fila “Account” en Quick Access** — ver sección siguiente.

---

## “Account” en móvil — análisis: no debería existir en Quick Access

### Qué había en el código

En el drawer móvil (`HamburgerMenu`) existía un ítem extra **“Account”** (con ícono `DollarSign`) que **no** aparecía en el sidebar desktop (`AppSidebar`). Eso generaba lista distinta entre vistas.

### A dónde “llevaría” Account si fuera un enlace

Cualquier destino razonable para “cuenta del artista” **ya está cubierto** por la navegación principal del mismo menú:

| Necesidad del usuario | Ya existe en *Dashboard* (bloque inferior del drawer / sidebar) |
|------------------------|------------------------------------------------------------------|
| Cuenta, email, plan, notificaciones, descargas, etc. | **Settings** → `/dashboard/settings/account` (y subrutas: `…/subscriptions`, `…/payment`, `…/notifications`, etc.) |
| Ingresos por música | **Royalties** → `/dashboard/royalties` |

Si *Account* en Quick Access apuntara a `/dashboard/settings/account`, sería **el mismo sitio** que **Settings**. Dos entradas en el mismo menú que resuelven lo mismo = **ruido y duplicación**, especialmente en móvil donde el espacio es caro.

Si se interpretara “Account” como solo **pagos / suscripción**, lo natural sería `/dashboard/settings/account/subscriptions` o `…/payment` — sigue siendo **subárbol de Settings**, no un producto aparte que justifique un segundo atajo con otro nombre.

### Conclusión de producto

- **No incluir “Account” en Quick Access.**  
- La **única** entrada canónica para “mi cuenta / ajustes de producto” debe ser **Settings** (misma jerarquía en desktop y móvil).  
- Si en el futuro querés un atajo móvil extra, que sea **explícito** y no duplicado (p.ej. “Suscripción” → solo `…/subscriptions`) y evaluar si realmente mejora la tarea frecuente.

### Implementación

El ítem **Account** fue **eliminado** de `HamburgerMenu` para igualar la lista a `AppSidebar` (Shows, Labels, DJ Mixes, Charts, Release Links).

Los enlaces que abren el **sitio público** (`/shows`, `/labels`) muestran **tooltip** (`title`) y **`aria-label`** explicando que se sale del dashboard, y un ícono pequeño **“external”** al final de la fila (solo visual; el destino sigue siendo mismo sitio, otra layout).

---

## Checklist de implementación (cuando se cablee en código)

- [x] **Quick Access** incluye **Charts** → `/dashboard/performance` (sidebar + drawer).  
- [x] **Quick Access** sin ítem “Account” (redundante con **Settings**).  
- [x] Cada ítem de *Quick Access* es un `Link` de Next con `href` claro (`AppSidebar` + `HamburgerMenu`).  
- [x] Misma lista y mismos destinos en **`AppSidebar`** y **`HamburgerMenu`**.  
- [x] Cerrar drawer móvil al navegar (`onClick={onClose}` en enlaces de Quick Access).  
- [ ] Decidir destino final de **DJ Mixes** (`/shows` vs `/mixes`) y documentarlo aquí. *(Hoy: `/shows`.)*  
- [ ] Decidir destino final de **Release Links** (solo notificaciones vs página dedicada). *(Hoy: notificaciones.)*

---

## Referencia de archivos

| Componente | Ruta del archivo |
|------------|------------------|
| Sidebar desktop | `components/dashboard/AppSidebar.tsx` |
| Menú hamburguesa (móvil) | `components/dashboard/HamburgerMenu.tsx` |

---

*Documento orientado al rediseño unificado Proton Radio + SoundSystem. Actualizar cuando las rutas o el IA de producto cambien.*

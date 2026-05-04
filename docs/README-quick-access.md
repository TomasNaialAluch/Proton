# Sidebar below “Dashboard” — Producer tools, Platform & Public site

Este documento describe las **secciones** bajo la navegación principal *Dashboard* en el panel de artista (`AppSidebar`, `HamburgerMenu` del dashboard) y **a qué rutas** enlazan. Reemplaza el modelo anterior unificado bajo el título “Quick Access”. La visión de producto está alineada con `docs/README-dashboard-vision-roadmap.md`.

**Idioma en UI:** los títulos de sección en la app están en **inglés** (*Producer tools*, *Platform*, *Public site*).

---

## Objetivo

Separar tres intenciones:

1. **Producer tools** — tareas **dentro del dashboard** centradas en promo (p. ej. release links).
2. **Platform** — **Shows**, **Labels** y **DJ Mixes** abren el **hub in-app** (`/dashboard/platform?tab=…`) con copy placeholder alineado a SoundSystem. **No** incluye charts de oyente; el rendimiento del artista sigue en **Dashboard → Performance**.
3. **Public site** — accesos a la **superficie pública** del mismo prototipo (Radio, Shows, Charts, Labels) con icono de “sale del dashboard” (`ExternalLink` + `title` / `aria-label`). Sección **plegable** en desktop (y en el drawer, mismas claves `localStorage` que Platform).

---

## Producer tools

| Ítem | Destino (app) | Notas |
|------|----------------|-------|
| **Release Links** | `/dashboard/settings/account/notifications` | Herramienta de promo por release (hoy contextualizada en notificaciones). |

---

## Platform

| Ítem | Destino (app) | Notas |
|------|----------------|-------|
| **Shows** | `/dashboard/platform?tab=shows` | Panel informativo (invitación / demo a Bonnie, etc.). |
| **Labels** | `/dashboard/platform?tab=labels` | Panel informativo (SoundSystem, FAQ, email de contacto). |
| **DJ Mixes** | `/dashboard/platform?tab=dj-mixes` | Panel informativo (flujo futuro DSP / guía / Track Stack). |

Todo el bloque **permanece** bajo `/dashboard`; el copy aclara prototipo hasta integración real.

---

## Public site

| Ítem | Destino (app) | Notas |
|------|----------------|-------|
| **Radio** | `/` | Inicio público / escucha. |
| **Shows** | `/shows` | Directorio público de shows. |
| **Charts** | `/charts/progressive` | Charts por género (misma entrada que navbar público). |
| **Labels** | `/labels` | Directorio de sellos. |

Cada fila muestra **ExternalLink** y texto accesible: se **abandona** el artist dashboard.

---

## “Account” en el menú lateral

La entrada canónica para ajustes de cuenta sigue siendo **Settings** en el bloque **Dashboard**, no una fila duplicada en Producer tools. Ver historial en versiones anteriores de este doc (rama *Quick Access* + eliminación de “Account” duplicado en móvil).

---

## Checklist de implementación

- [x] Tres bloques en sidebar: **Producer tools**, **Platform**, **Public site**.  
- [x] **Platform** y **Public site** plegables (desktop); drawer alineado con mismas preferencias en `localStorage`.  
- [x] **Release Links** solo en Producer tools.  
- [x] **Shows**, **Labels**, **DJ Mixes** en Platform (hub in-app).  
- [x] **Radio / Shows / Charts / Labels** en Public site con affordance de salida del dashboard.  
- [ ] Destino final de **DJ Mixes** cuando exista gestión real (ruta B2B o pública dedicada); el hub `?tab=dj-mixes` puede redirigir o enlazar allí.  
- [ ] **Release Links**: ¿solo notificaciones vs `/dashboard/release-links` dedicada?

---

## Referencia de archivos

| Componente | Ruta |
|------------|------|
| Sidebar desktop | `components/dashboard/AppSidebar.tsx` |
| Drawer móvil (dashboard) | `components/dashboard/HamburgerMenu.tsx` |

---

*Actualizar cuando cambien rutas o el mapa de producto B2B.*

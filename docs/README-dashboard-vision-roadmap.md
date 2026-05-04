# Visión y roadmap — dashboard artista / productor

Este documento resume **lo acordado en conversación** y **lo que falta por hacer** para que podamos leerlo juntos y comprobar si la visión coincide. No sustituye los specs detallados (`dashboard-artists.md`, `README-quick-access.md`); sirve como **checklist de producto** priorizable.

**Idioma de la UI del producto:** el sitio público y el dashboard siguen la convención del repo: copy en **inglés**. Este README puede estar en **español** porque es nota interna de equipo.

---

## 1. Persona y contexto

| Tema | Visión |
|------|--------|
| **Usuario actual del prototipo** | Perfil **artista / productor** (ej. cuenta mock **Naial**). Es quien “abre” el dashboard con la navegación actual (Artists, Performance, Royalties, Contracts, Settings). |
| **Aclaración explícita** | Debe quedar documentado en repo (y, si se desea, de forma muy discreta en UI) que **esta shell es la vista productor**, no la vista “solo label manager”. |
| **Label manager (futuro)** | No está modelada aún. Se supone que tendría más peso en catálogo/roster del sello, metadatos y ventanas de release por plataforma, reporting agregado del sello, contratos y workflows de aprobación — **distinta o ampliada** respecto al foco “mis ingresos / mi carrera” del productor. |
| **Datos** | Hoy `mockArtist` / `Artist` no incluyen `role` ni `accountType`. Cuando haya multi-persona, conviene **tipar** eso en mocks y tipos. |

**Checklist**

- [x] Añadir párrafo en `docs/dashboard-artists.md` (o README principal del área dashboard) indicando persona **productor** y que **label manager** es fuera de alcance del prototipo actual salvo que se defina.
- [x] (Opcional) Chip **Producer view** arriba a la derecha (naranja) + modal de vistas prototipo — ver `DashboardPersonaChip`.
- [ ] (Futuro) Definir si label manager es **otra app**, **otra ruta bajo `/dashboard`**, o **mismo layout con nav condicionada por rol**.

---

## 2. Bloque “Dashboard” en la sidebar (nav principal)

| Tema | Visión |
|------|--------|
| **Contenido** | Mantener **como está**: Artists, Performance, Royalties, Contracts, Settings. Es la **vista canónica** que se le abre al productor y ya funciona bien como jerarquía principal. |
| **Cambios** | **No** reestructurar este bloque salvo bugs o mejoras puntuales acordadas aparte. |

**Checklist**

- [ ] Ninguno obligatorio por visión actual — solo no mezclar con los otros bloques.

---

## 3. Quick Access hoy vs secciones claras (producer / platform / público)

**Problema actual:** el título *Quick Access* agrupaba cosas heterogéneas: hub in-app (Shows, Labels, DJ Mixes), charts de oyente, radio pública y herramientas internas (Release Links).

**Visión acordada**

| Nueva sección (concepto) | Qué va adentro | Intención del usuario |
|--------------------------|----------------|------------------------|
| **A — Herramientas del productor** (*Producer tools*) | **Release Links** solamente. | Promo / enlaces **dentro** del panel. |
| **B — Plataforma** (*Platform*) | Shows, Labels, DJ Mixes (hub in-app con copy). | Áreas SoundSystem / prototipo **dentro** del dashboard. |
| **C — Sitio público** (*Public site*) | Radio, Shows, Charts, Labels (rutas públicas del mismo app). | Oyente / exploración; **sale** del artist dashboard. |

**Nombres en UI (inglés) — brainstorming a cerrar**

- Sección A: *Producer tools* · *Your tools* · *Promo*.
- Sección B: *Platform* (hub in-app Shows / Labels / DJ Mixes).
- Sección C: *Public site* (Radio, Shows, charts públicos, Labels) — charts del **oyente** en `/charts/…`; métricas del artista siguen en *Dashboard → Performance*.

**Checklist**

- [x] Renombrar en `AppSidebar` y `HamburgerMenu` la sección que hoy dice *Quick Access* (o dividir en dos `<div>` con dos títulos).
- [x] Mover **Release Links** al bloque A (herramientas productor).
- [x] Dejar **Shows / Labels / DJ Mixes** en el bloque B con título que no suene a “explorar como oyente”.
- [x] **Charts** públicos en bloque **Public site** (no en Platform). *Performance* sigue en el nav principal *Dashboard*.
- [x] Actualizar `title` / `aria-label` en enlaces que **salen** del dashboard para que sigan siendo claros bajo el nuevo título de sección.
- [x] Actualizar `docs/README-quick-access.md` para reflejar la nueva IA (posiblemente renombrar el archivo o añadir sección “Historial / rename”).

---

## 4. Shows, Labels, DJ Mixes — público vs gestión (referencia SoundSystem)

**Qué son en el producto de referencia (capturas)**

- **Shows:** gestión de emisiones en radio (subida, programación); a menudo con onboarding si el acceso es por invitación.
- **Labels:** gestión de sello y reportes diarios; onboarding para sellos nuevos (FAQ, contacto).
- **DJ Mixes:** flujo de distribución a DSPs (Spotify, Apple Music), de shi reglas (Track Stack, WAV por corte, checkboxes, borradores “in development”).

**Estado en nuestro repo**

- Enlaces desde **AppSidebar** y **HamburgerMenu** (Platform): `/dashboard/platform?tab=shows|labels|dj-mixes` → `PlatformHubClient` con losas y paneles de copy placeholder (referencia capturas SoundSystem). **Account** en el hub enlaza a royalties / settings / profile; la entrada canónica de ajustes sigue en el nav **Dashboard → Settings**.
- **Public site** en sidebar: `/`, `/shows`, `/charts/progressive`, `/labels` con indicación de salida del dashboard.

**Visión a medio plazo**

- Donde el producto lo permita, rutas **B2B** tipo `/dashboard/shows`, `/dashboard/labels`, `/dashboard/dj-mixes` (o integración / SSO con herramienta legacy), con **contenido condicionado por rol y permisos** (productor con show invitado vs sin acceso, etc.).

**Checklist**

- [ ] Definir destino final de **DJ Mixes** cuando haya producto/backend (ruta B2B o pública dedicada).
- [x] Por fases: (1) IA y nombres en sidebar; **(2) hub in-dashboard** con explicación por pestaña (`/dashboard/platform`); (3) integración real o mocks de flujo.
- [x] Copy del hub en inglés y tono “prototype / coming soon” donde aplica; sin prometer backend inexistente.

---

## 5. Sign In y Create account (flujo de acceso, como en público / SoundSystem)

**Visión**

- En **algún lugar accesible** (navbar pública, footer, o `/login`) tienen que ir **juntos** **Sign In** y **Create account**, como en el producto real: el usuario reconoce el mismo par de entradas que en [soundsystem.protonradio.com](https://soundsystem.protonradio.com/).
- **Sign In:** simular en el prototipo el flujo hacia el panel (pantalla + transición mock a `/dashboard`, sin backend real).
- **Create account:** en el sitio real **no** es un registro “solo dentro” de SoundSystem; enlaza al alta en Proton Radio. En el prototipo, **replicar ese comportamiento**: enlace claro a la URL real de alta (p. ej. `https://www.protonradio.com/create-account`) con copy/tooltip de que **sale del prototipo** hacia el sitio oficial. No hace falta implementar un motor de registro ni API en este repo salvo que el producto lo pida más adelante.

**Referencia — Proton SoundSystem (revisión mayo 2026)**

En [soundsystem.protonradio.com](https://soundsystem.protonradio.com/) el acceso a cuenta ofrece:

| Enlace | Destino observado |
|--------|-------------------|
| **Sign In** | `https://auth.protonradio.com/sign_in?redirect=…` (auth central Proton, redirect de vuelta a SoundSystem). |
| **Create Account** | `https://www.protonradio.com/create-account` (alta en el sitio principal Proton Radio, no un formulario aislado solo en el subdominio SoundSystem). |
| Forgot password / username | Páginas en `protonradio.com`. |

**Conclusión para nuestro roadmap**

- **Sign In** + **Create account** aparecen **los dos** en la misma zona de auth (navbar y/o página `/login`), alineados con SoundSystem.
- **Create account** = enlace externo al flujo real de Proton (o la URL que defina el producto), no obligatorio un segundo “formulario fake” de registro en el prototipo.

**Checklist**

- [x] **Sign In** visible hacia `/login` (navbar pública y drawer).
- [ ] **Create account** en la **misma franja** que Sign in en navbar/drawer públicos — **no** aplica en este build (superficie pública intocable; SoundSystem real sí lo muestra).
- [x] Página `/login`: pestañas **Sign in** / **Create account**; Sign in setea cookie demo y entra a `/dashboard` (o `callbackUrl` seguro).
- [ ] Enlace **Create account** → `protonradio.com/create-account` desde UI pública — pendiente si se decide otra entrada (p. ej. solo documentación o flujo distinto al del dashboard).

**Nota de implementación:** el header público (`Navbar`, `HamburgerMenu` en `(public)`) solo expone **Sign in** → `/login`. El par Sign in / Create account “tipo SoundSystem” en barra queda como **objetivo de producto** en este doc, no como estado actual del código público.

**Puerta al dashboard (prototipo):** `middleware.ts` exige la cookie `proton_demo_session` (`lib/auth/demoSession.ts`). Sin ella, **For Artists** y cualquier ruta bajo `/dashboard` redirigen a `/login?callbackUrl=…`. Tras **Continue (prototype)** en la pestaña Sign in se graba la cookie y se navega al destino (solo paths bajo `/dashboard`). **Sign out (demo)** al final de **Account Settings** (`/dashboard/settings/account`) y de **Artist Profile** (`/dashboard/settings/profile`), no en la sidebar principal.

---

## 6. Coherencia con documentación existente

| Documento | Acción cuando se implemente lo anterior |
|-------------|----------------------------------------|
| `docs/README-quick-access.md` | Reescribir tablas y checklist al nuevo modelo de dos secciones. *(Hecho.)* |
| `docs/dashboard-artists.md` | Alinear “What works (keep)” si ya no dice “Quick access con Account”; añadir persona productor. *(Hecho.)* |
| `READMEMAIN.md` / `README.md` | Una línea de enlace a este roadmap si queréis visibilidad desde el índice principal. *(Enlaces añadidos en `README.md` y bloque Dashboard en `READMEMAIN.md`.)* |

---

## 7. Resumen ejecutivo (una lectura)

1. **Dashboard** (nav principal): **sin cambios de visión** — es el panel del **productor**.  
2. **Documentar** que Naial / mock actual = **persona productor**; vista **label manager** = futuro / por definir.  
3. **Sidebar:** **Producer tools** (Release Links), **Platform** (hub `/dashboard/platform`), **Public site** (Radio, Shows, charts, Labels). **Performance** sigue en *Dashboard*.  
4. **Largo plazo:** vistas de **gestión** reales para Shows / Labels / DJ Mixes; el hub actual es placeholder hasta integración o SSO.  
5. **Auth (público):** **Sign in** → `/login`; gate demo con cookie + middleware hacia `/dashboard`; **Sign out (demo)** al pie de Account Settings y Artist Profile. Ver §5.

---

Si algo de esta lista **no** coincide con tu visión, marcá las líneas a cambiar y lo ajustamos en una siguiente iteración de este mismo archivo.

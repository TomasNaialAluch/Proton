# Visión de diseño y producto — 9 de abril de 2026

Documento de trabajo para retomar el hilo cuando sigas desarrollando: qué se hizo, qué se descartó por ahora y **cómo pensar la UI para que tenga sentido para un productor** (usuario del dashboard de artista).

---

## 1. Cambios de producto / UI ya aplicados

- **Shell del dashboard unificado** (`app/(dashboard)/layout.tsx`): sidebar, barra superior móvil y bottom nav envuelven todas las rutas del grupo, no solo la home. Así Performance, settings y el resto comparten la misma estructura y no “pierden” el sidebar en desktop.
- **Home del dashboard** (`dashboard/page.tsx`): solo monta el contenido (`DashboardContent`); no duplica layout.
- **Breadcrumb en Performance**: `Dashboard > Performance` con enlace a `/dashboard`, para orientación sin recargar el chrome.
- **Sidebar**: enlace activo según `usePathname` (incluye prefijo `/dashboard/settings` para todas las subrutas de ajustes).
- **Marca en sidebar**: logo tipográfico desde `public/logo txt.png` (texto “PROTON / SOUNDSYSTEM”) en lugar del texto plano; enlaza al dashboard.

---

## 2. Decisiones explícitas (por ahora)

- **No** agregar en desktop una **barra superior blanca** solo con el **isotipo** (`Logo ISO.png`) centrado.
  - **Motivo**: En escritorio ya hay **sidebar** con marca; una franja extra solo decorativa duplica el mensaje, resta altura útil al contenido (métricas, tablas) y el PNG con **fondo negro** chocaría con blanco hasta tener transparencia o variantes por tema.
  - **Alternativa acordada**: mostrar el isotipo donde ya hay barra natural (p. ej. **header móvil**), favicon / `app/icon`, marketing, estados vacíos — en lugar de un segundo “marco” en desktop.

Esta decisión se puede revisar cuando haya **assets finales** (fondo transparente, modo claro/oscuro) o si la barra superior **hace algo** (búsqueda global, cuenta, contexto), no solo marca.

---

## 3. Coherencia estética (líneas maestras)

- **Un solo sistema de superficies**: `bg-background`, `bg-surface`, bordes con token `--color-border`. Evitar bloques “siempre blancos” que ignoren el tema oscuro salvo decisión consciente.
- **Acento** `#E67E22`: ya ancla la identidad “Proton”; el isotipo naranja encaja con eso cuando se use sobre fondos neutros o transparentes.
- **Menos chrome, más datos**: el productor abre el dashboard por **números y acciones** (streams, regalías, releases). Cada píxel de barra repetida compite con esa lectura.
- **Jerarquía**: sidebar = navegación + marca; contenido = título de página + breadcrumb donde ayude; no tres niveles de logo sin función.

---

## 4. Visión: qué necesita complacerse al productor

Pensar al usuario como alguien que **vive de la música** y entra esporádicamente al panel: quiere **confianza, claridad y poca fricción**, no un portfolio de efectos.

1. **Confianza**: datos legibles, estados de carga honestos, errores entendibles; la marca debe sentirse **profesional**, no amateur.
2. **Escaneo rápido**: KPIs y tablas primero; decoración después. Si algo no ayuda a decidir o a navegar, es candidato a recortar o a mover a marketing.
3. **Continuidad** entre “radio/streaming” y “backoffice”: misma familia tipográfica, mismos tokens de color y mismo tono (técnico pero humano).
4. **Mobile real**: muchos artistas revisan métricas desde el teléfono; bottom nav + header compacto son el lugar natural para refuerzos de marca **sin** duplicar en desktop.

Cuando dudes entre “más branding” y “más aire para datos”, **default: datos**; el branding fuerte puede vivir en login, landings y el icono del sitio.

---

## 5. Próximos pasos sugeridos (cuando toque)

- Exportar **Logo ISO** (y si aplica el wordmark) con **fondo transparente** y, si el diseño lo pide, variante para fondo oscuro.
- Sustituir el texto “Proton” del **navbar móvil** por el isotipo o un lockup pequeño, alineado con la decisión de no duplicar en desktop.
- Revisar `logo txt.png` en **tema claro**: el fondo negro del PNG puede leerse como “parche”; valorar wordmark sobre transparente o contenedor que respete tokens.

---

*Última actualización del documento: 9 de abril de 2026.*

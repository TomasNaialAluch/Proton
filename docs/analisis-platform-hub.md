# Qué es "Platform" en el dashboard de productor — análisis

El usuario pidió entrar a la sección "Platform" del sidebar (vista
productor) — que muestra tiles "Shows", "Labels", "DJ Mixes" y "Account" —
y explicar qué es, qué hace hoy, y para qué está.

## Dónde vive en el código

- Nav: `components/dashboard/AppSidebar/SidebarPlatformSection.tsx` (sección
  colapsable "Platform" en el sidebar de escritorio) y su equivalente en
  `HamburgerMenu.tsx` (mobile). Los links están en
  `components/dashboard/AppSidebar/navData.ts`.
- Página: `app/(dashboard)/dashboard/(producer)/platform/page.tsx`, ruta
  `/dashboard/platform?tab=shows|labels|dj-mixes|account`.
- Todo el contenido real vive en un único componente:
  `components/dashboard/platform/PlatformHubClient.tsx`.

## Qué es, en una frase

Es una **página de referencia/copia informativa**, no una herramienta
funcional. Es una recreación en miniatura de 4 pantallas del producto real
de Proton — **SoundSystem** (`soundsystem.protonradio.com`, el panel real
de artistas de Proton Radio) — pensada para que quien mire el prototipo
entienda qué existe en el producto real, sin que nada de eso esté conectado
a datos ni funcione de verdad.

El propio texto de la página lo dice explícitamente:

> "Prototype only: tap a tile to read how each area works on the real
> product. No management tools are wired here yet."

## Las 4 tiles

**1. Shows** — Programas de radio en Proton Radio, por invitación. El
panel solo dice "pedí acceso mandando un demo mix a Bonnie" (con mailto).
No hay ningún flujo real, es texto fijo.

**2. Labels** — Copy de marketing genérico ("+1500 labels distribuidos en
SoundSystem", link a FAQ, mailto a `launch@protonradio.com` para sumar tu
label). Ojo: esto **no tiene nada que ver** con el sistema de labels que
ya construimos en el resto del dashboard (Discover labels, Label Detail,
label-manager, etc.) — es una tile separada que solo replica lo que dice
la página real de SoundSystem sobre "cómo unirte como label".

**3. DJ Mixes** — La más elaborada de las 4. Reproduce el layout real de
la pantalla "Create New Mix" de SoundSystem: selector de DJ (fijo en
"Naial"), campo de título, dos checkboxes de términos, botón "Create New
DJ Mix" — **todo deshabilitado** (`disabled`) — más dos listas placeholder
("Mixes in Development", "Published Mixes") que son barras grises sin
datos reales, solo para mostrar la forma de la pantalla. El comentario en
el código lo confirma: "Layout mirrors the real SoundSystem DJ Mixes
screen. This prototype is not connected to uploads or DSPs — controls
below are disabled."

**4. Account** — La única tile que en realidad **funciona**: en vez de
copy, tiene links reales a `/dashboard/royalties`, `/dashboard/settings/account`
y `/dashboard/settings/profile` — o sea, redirige a pantallas que sí
existen y sí funcionan en el resto del dashboard.

## Por qué existe (contexto de diseño)

Está documentado en `docs/README-dashboard-vision-roadmap.md` (sección 4,
"Shows, Labels, DJ Mixes — public vs management, SoundSystem reference").
El razonamiento ahí:

- El dashboard de Proton (este prototipo) modela la vista de un
  **productor/artista individual** (identidad mock "Naial").
- SoundSystem es el panel real que ya existe en producción, con varias
  áreas (Shows, Labels, DJ Mixes) que antes vivían mezcladas en una
  sección más vieja llamada "Quick Access" junto con otras cosas
  (gráficos de oyentes, el sitio público, Release Links).
- Se decidió separar esas 3 áreas de SoundSystem en su propia sección
  "Platform" dentro del sidebar, con una página placeholder por cada una,
  para dejar mapeado **qué existe en el producto real** aunque todavía no
  se construya la integración de verdad.
- El roadmap del doc marca explícitamente como pendiente: "Definir el
  destino final de DJ Mixes una vez que exista producto/backend real (ruta
  B2B o ruta pública dedicada)" — o sea, sigue siendo un placeholder a
  propósito, no un olvido.

## En resumen

"Platform" no es una feature del prototipo en el sentido de "algo que
hicimos nosotros" — es una **vitrina de 3 pantallas del producto real**
(Shows, Labels, DJ Mixes) copiadas en formato lectura, más un acceso
directo real a Account. Ningún botón de Shows/Labels/DJ Mixes hace nada
(todo deshabilitado o son solo links `mailto:`/externos); la única
funcionalidad real de toda la sección es la tile Account, que reusa
páginas que ya existen en el resto del dashboard.

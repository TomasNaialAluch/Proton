# Última sesión — resumen y qué quedó pendiente

Repaso de todo lo que se hizo, para retomar sin tener que releer todo el
historial. Los cambios más recientes van arriba.

## Sesión de hoy (17/07/2026)

Partiendo del commit `c1b7f76` (ya en GitHub). Nada de lo de hoy está
subido todavía — el usuario pidió explícitamente no hacer push esta vez.

### Deploy a Firebase + diagnóstico de cold start
Se hizo deploy (`npm run deploy:firebase`) — live en
`https://proton-web--proton-e311b.us-central1.hosted.app` — y se midió
cuánto tarda en abrir el dashboard de productor. Con `curl -w
"%{time_total}"` se aisló dónde estaba el tiempo: la API GraphQL responde
en ~1s (no es el cuello de botella), pero la primera carga del dashboard
tarda **~20s en frío** y baja a 0.4–0.7s en pedidos subsiguientes.
**Causa real**: `apphosting.yaml` no tiene `runConfig.minInstances`
seteado (default 0), así que Cloud Run escala a cero tras inactividad y
cada visita después de un rato de nadie usando la app paga el arranque
completo de la instancia. **Fix propuesto, no aplicado todavía** (falta
confirmación del usuario): agregar `runConfig: minInstances: 1` a
`apphosting.yaml` — mantiene una instancia siempre viva, elimina el cold
start, tiene costo de Cloud Run corriendo 24/7.

Aclarado también por qué "yo lo uso antes, ¿le carga más rápido a otro
después?": sí, dentro de la misma instancia/región mientras no pase el
tiempo de inactividad — pero no es por dispositivo/red, es la instancia
del servidor la que queda caliente o fría, independientemente de qué
compu la usa.

### 1. Scouting — sugerencias de artistas (toolkit ítem 1)
`types/labelArtistSuggestion.ts`, `lib/mock/label-manager/artistSuggestions.ts`
(3 artistas ficticios nuevos: Solene Frost y Nadir Cole para Sudbeat,
Marlowe Kade para Bedrock), `lib/store/label-manager/artistSuggestionsStore.ts`,
página `/dashboard/scouting`. "Reach out" manda un mensaje real vía
`sendArtistOutreach` (acción nueva en `labelInboxStore.ts`, reversa de
`sendLabelRequest`) que crea una conversación `origin: label_outreach` con
`peer.type: "producer"` — aparece correctamente en el inbox unificado de
Connections.

### 2. Requests — inbox de remix/contest para label-manager (toolkit ítem 2)
Página `/dashboard/requests`: filtra las conversaciones que ya se crean
del lado productor (`producer_request` con `kind: "remix"` o `"contest"`)
por label activo, sin store nuevo — es una vista sobre datos que ya
existían. Chat propio en `/dashboard/requests/chat/[id]` reutilizando
`ConversationThread`, mostrando `mockArtist.name` ("Naial") como remitente
en vez de `peer.name` (que en estas conversaciones es el nombre de la
propia label, porque el modelo está pensado desde el punto de vista del
productor).

### 3. Barra de navegación mobile de label-manager — demasiadas opciones
El usuario marcó que la bottom nav de label-manager (7 ítems ya con
Scouting/Requests sumados) quedaba muy apretada en mobile. Se creó
`lib/store/mobileMenuStore.ts` (estado compartido open/close) y se limitó
`BottomNav.tsx` a mostrar los primeros 4 ítems de `LABEL_MANAGER_NAV_LINKS`
más un tab "More" que abre el mismo `HamburgerMenu` con la lista completa.
El sidebar de escritorio no cambió (tiene lugar de sobra).

### 4. Contests — creación de contest para label-manager (toolkit ítem 3)
Página `/dashboard/contests`: lista los contests del label activo (mock +
creados) y formulario "+ New contest" (track propio del label, título,
descripción, deadline y prize opcionales). Los contests creados viven en
`lib/store/label-manager/contestsStore.ts` (persistido). Para que
aparezcan en los lugares donde el productor ya lee contests sin tocar esos
componentes, se agregó `lib/contests/useLabelContests.ts` — un hook que
mezcla `label.activeContests` (mock) con los del store — usado en
`ActiveContests.tsx`, `ContestDetailClient.tsx` y `TrackRemixCard.tsx`.

### 5. Demo policy — gestión de política de demos para label-manager (toolkit ítem 4)
Página `/dashboard/demo-policy`: por label, editar estado (abierto/cerrado/
desconocido), géneros preferidos, formato preferido, tiempo de respuesta y
notas. Store nuevo `lib/store/label-manager/demoPolicyStore.ts` (overrides
por `labelId`), mezclado vía `lib/labels/useEffectiveLabel.ts` en el único
punto donde `LabelProfileClient.tsx` resuelve la label y se la pasa a
`LabelDetailHeader`/`DemoPolicyCard`/el gate de "Submit demo" vs "Request
to connect" — esos componentes no cambiaron.

**Gap conocido, no resuelto**: las tarjetas de labels en Browse/Discover
(`SearchResults`, `LabelRow`, `FeaturedCard`, tabs por género) siguen
leyendo `demoStatus` directo del mock estático — un cambio de política se
ve en la página de la label pero no todavía en esas listas.

Con esto, **los 4 ítems del toolkit de label-manager
(`docs/feature-label-manager-toolkit.md`) están implementados**. `npx tsc
--noEmit` limpio después de cada paso.

## Sesión anterior — resumen de lo que se hizo

### 1. Filtro de BPM (verificación)
Se terminó de verificar en el navegador el rediseño del `BpmRangeFilter`
(popover, drag del slider, inputs numéricos, botón de limpiar) que venía
de la sesión anterior — funcionaba, el problema había sido de coordenadas
de click, no del código.

### 2. Navegación "Back" en cadena — 3 bugs reales encontrados y arreglados
- **El `from` solo recordaba un salto.** Yendo Label → Track → Artist →
  Track, el botón Back se perdía después del segundo salto. Se arregló
  haciendo que cada página reenvíe su propia cadena `from` completa a los
  links que genera (`lib/utils/navigation.ts`, `backChainForward`). Doc:
  `docs/README-navigation-back-flow.md`.
- **El breadcrumb perdía la label** en Track/Artist Detail cuando el track
  no tenía `labelSlug` propio (la mayoría del catálogo mock no lo tiene).
  Se arregló con `labelSlugFromReferrer`, que camina recursivamente la
  cadena `from` buscando de qué label venís.
- **Loop real de Back** — `BackButton` mezclaba `router.push` (agrega
  entradas al historial) con `router.back()` (las consume), y terminabas
  rebotando entre las últimas dos páginas para siempre. Se arregló
  cambiando a `router.replace` en el camino determinístico.

### 3. Revisión de arquitectura del código
`docs/README-codebase-architecture-review.md` — qué está bien (separación
público/dashboard, tipado estricto sin `any`, patrones consistentes) y
deuda real: sin ESLint configurado, nav triplicada en 3 componentes,
`StatCard`/`KpiCard` duplicados, `ARCHITECTURE.md` con un bug ya resuelto
que seguía listado como pendiente, 35 docs sin índice confiable, archivos
grandes, y el modelo de datos mock "single-tenant" (que después resultó
ser la raíz de varios bugs de esta sesión).

Se atacaron dos ítems de esa lista:
- **`StatCard`/`KpiCard` unificados** en `components/ui/KpiCard.tsx`.
- **`AppSidebar.tsx` (631 líneas) partido** en
  `components/dashboard/AppSidebar/` — composer + 7 subcomponentes +
  `navData.ts`, con `SidebarToolLink.tsx` unificando 3 filas de UI que
  antes estaban copiadas.

### 4. Modal de bienvenida por sesión
`docs/feature-session-welcome-modal.md` — al entrar al dashboard por
primera vez en la sesión, un modal resume contrato pendiente de firma,
conexión pendiente, outreach de label sin responder, y feedback sin leer.
Un bug real encontrado y arreglado en el camino: el modal decidía si
mostrarse ANTES de que terminara de hidratar el store persistido
(`usePrototypeViewStore`), así que en una sesión de label-manager se
abría igual mostrando "0 things". Se arregló esperando
`persist.hasHydrated()`.

### 5. Toolkit de label-manager (investigado, no implementado)
`docs/feature-label-manager-toolkit.md` — 4 herramientas que le faltan al
lado label-manager: sugerencias de artistas para scoutear, inbox de
remix/contest, creación de contests, y gestión de política de demos. El
hallazgo importante: el inbox de remix/contest **ya tiene la mitad hecha**
(la conversación ya se crea del lado productor), solo falta la vista del
lado label. Las sugerencias de artistas son las únicas que necesitan un
dataset mock nuevo desde cero.

### 6. Sistema de "Contest" — investigado, diseñado, e implementado
`docs/feature-contest-flow.md` — se investigó cómo lo hace LabelRadar
(contests reales, con stems y subida de archivo), y se adaptó a Proton
corrigiendo el enfoque: **no es una competencia** (nada de podio ni
premios en niveles, eso se corrigió a mitad de diseño después de que el
usuario lo marcara). Se construyó:
- Página de detalle del contest (`/dashboard/labels/[slug]/contests/[contestId]`)
  con track real, stems (deshonestamente imposible de verdad — marcado
  como prototipo), y subida real de remix.
- `ContestSubmitCard.tsx` reusando la validación de archivo de
  `SubmitTrackForm`.
- Se arregló el click muerto de `ActiveContests.tsx` (antes solo mandaba
  un mensaje de texto).
- **Bug de yapa encontrado y arreglado**: todo `/dashboard/labels/{slug}`
  estaba bloqueado para label-manager por un guard de ruteo desactualizado
  (`isProducerShellPath`) que contradecía la regla ya establecida de que
  Label Detail es universal.

**Corrección importante hecha después**, a pedido del usuario: se detectó
que `remixOpportunities` (el sistema viejo de "pedir remix") no tenía
forma de entregar los stems — era un flujo roto — y que era exactamente
el mismo concepto que "contest". Se **fusionaron los dos sistemas en
uno**: `remixOpportunities` desapareció del todo, y el gate de aprobación
de 2 pasos (label + artista) ahora se chequea contra cualquier
`activeContests`, mostrando "Awaiting artist" en vez de un flujo aparte.

### 7. Inbox de chats unificado
`docs/feature-unified-chat-inbox.md` — había dos páginas de chats
(Connections y Labels → Messages) leyendo **datos distintos** (un bug
real: Connections leía un array congelado, no el store en vivo). Se
unificaron en un componente compartido (`ConversationList.tsx`) con
etiqueta de origen por conversación (remix, contest, outreach, collab,
etc.), clickeable a su destino real (el contest, la label, o el perfil
del artista). Para esto se agregó `artistId` estructurado a los collab
requests (antes solo vivía en texto libre).

**Seguido de otro pedido del usuario**: los chats no tenían forma de
volver a la lista (había que ir hasta Dashboard). Se agregó un
`BackButton` real a `ConversationThread.tsx`, y de paso se sincronizó la
pestaña Suggestions/Messages de Connections con la URL (`?tab=`) para que
Back te devuelva a la pestaña exacta de la que saliste, no siempre a
Suggestions.

### 8. Feedback entre productores — bug real + preparación para API
El usuario notó que "Pending to review" mostraba **tu propio track**
("Living") como si fuera de Vesna — era un placeholder admitido en el
código (`// standing in for a peer's track`). Se creó
`lib/mock/peerTracks.ts` con tracks reales para Vesna/Lume/Darko. Además,
a pedido explícito, se chequeó si el código estaba preparado para una API
real: **no lo estaba** — las páginas de Feedback importaban los mocks
directo, salteando la capa `lib/api/` que el resto de la app sí usa. Se
agregó `lib/api/feedback.ts` y `fetchTrackById` a `lib/api/tracks.ts`, y
se reescribieron ambas páginas con `useQuery` (mismo patrón que
`DashboardContent.tsx`). Doc: `docs/feature-peer-feedback-tracks.md`.

## Qué quedó pendiente / abierto

**Del toolkit de label-manager** (`docs/feature-label-manager-toolkit.md`):
- [x] Sugerencias de artistas, inbox de remix/contest, creación de
      contests, y gestión de política de demos — los 4 ítems implementados
      hoy (ver arriba).
- [ ] Gap conocido: las tarjetas de Browse/Discover no reflejan ediciones
      de política de demos hechas en `/dashboard/demo-policy` (siguen
      leyendo el mock estático).

**Del deploy / performance**:
- [ ] Aplicar `runConfig: minInstances: 1` en `apphosting.yaml` para
      eliminar el cold start de ~20s — propuesto, no confirmado por el
      usuario todavía.

**Del sistema de contest** (`docs/feature-contest-flow.md`):
- [ ] Cómo se le avisa a un productor qué pasó con su remix después de
      cerrado el contest (dejado abierto a propósito).
- [ ] Notificación `new_contest` para labels seguidas (mencionada, no construida).

**Del inbox de chats** (`docs/feature-unified-chat-inbox.md`):
- [ ] `labelSubmissionsStore` todavía no crea una `Conversation` real al
      mandar una demo — el chat de submissions sigue siendo un fallback.
- [ ] **Gap de leído/no-leído**: no existe ningún campo `read` en
      `ChatMessage` en toda la app — sin esto, no se puede avisar
      honestamente "te contestaron" en ningún lado (ni en notificaciones,
      ni en el modal de bienvenida). Identificado dos veces, no resuelto.

**De la revisión de arquitectura** (`docs/README-codebase-architecture-review.md`):
- [ ] No hay config de ESLint commiteada.
- [ ] Links de nav todavía triplicados entre `HamburgerMenu.tsx` y
      `BottomNav.tsx` para el rol productor (se resolvió parcialmente
      adentro de `AppSidebar` al partirlo, pero no entre los 3 componentes).
- [ ] `ARCHITECTURE.md` sigue con secciones desactualizadas de "known issues".
- [ ] Archivos grandes sin partir: `DashboardContent.tsx`, `HamburgerMenu.tsx`.
- [ ] El modelo de datos mock sigue siendo "de un solo productor" — puede
      seguir generando bugs de la misma familia que los de esta sesión.

## Bugs reales encontrados esta sesión (no eran pedidos explícitos, se
encontraron investigando o verificando)

1. Back-navigation se cortaba a 1 salto (`README-navigation-back-flow.md`).
2. Breadcrumb perdía la label sin `labelSlugFromReferrer`.
3. Loop infinito de Back (`router.push` vs `router.back()`).
4. Modal de bienvenida se abría con datos viejos por una carrera de hidratación.
5. `/dashboard/labels/{slug}` bloqueado enteramente para label-manager
   (guard de ruteo desactualizado).
6. Connections leía datos congelados en vez del store en vivo.
7. `remixOpportunities` no tenía forma de entregar stems — flujo
   estructuralmente roto.
8. "Pending to review" mostraba tu propio track como si fuera de otro
   productor.
9. Las páginas de Feedback no estaban preparadas para una API real.

## Qué falta testear a mano (lo de hoy)

Todo esto compila (`npx tsc --noEmit` limpio) pero no se verificó en el
navegador esta sesión — el usuario prefiere revisarlo él mismo.

**Scouting (`/dashboard/scouting`, label-manager)**
- [ ] Cambiar a vista label-manager y escopear a Sudbeat (id "2"): deberían
      verse las tarjetas de Solene Frost y Nadir Cole.
- [ ] Escopear a Bedrock (id "3"): debería verse Marlowe Kade.
- [ ] Con "All labels" seleccionado, deberían verse las 3 juntas.
- [ ] "Reach out" → escribir una nota → "Send": la tarjeta pasa a estado
      "Reached out" con link "View conversation".
- [ ] Ese link lleva a un chat real, y la conversación aparece en
      Connections (vista productor) etiquetada como outreach de esa label.
- [ ] "Dismiss" saca la tarjeta de la lista (y no debería reaparecer al
      recargar, por el `persist` del store).

**Requests (`/dashboard/requests`, label-manager)**
- [ ] Sudbeat debería mostrar los pedidos de remix ya seedeados
      (Weightless, Fading Signal). Bedrock, el de Open Horizons.
- [ ] El nombre mostrado como remitente debe ser "Naial" (no el nombre de
      la propia label).
- [ ] Entrar a un request abre el chat real, con historial de mensajes.
- [ ] El botón Back del chat vuelve a `/dashboard/requests`, no al
      Dashboard.
- [ ] Mandar un contest entry nuevo desde el lado productor (Track Detail
      → Remix this track) y confirmar que aparece acá con el track
      correcto en la descripción.

**Bottom nav mobile (label-manager, viewport angosto)**
- [ ] Solo deberían verse 4 tabs + "More": Roster, Scouting, Requests,
      Catalog, More.
- [ ] Tocar "More" abre el mismo drawer que el botón hamburguesa de arriba,
      con los 7 ítems completos (incluye Contests, Releases, Revenue,
      Statements, Demo policy).
- [ ] Estando en una página que solo vive en "More" (ej. Revenue), el tab
      "More" debería marcarse como activo (subrayado/color accent).
- [ ] En desktop (`lg:` para arriba) el sidebar sigue mostrando los 8
      ítems completos, sin recorte.

**Contests (`/dashboard/contests`, label-manager)**
- [ ] Escopeado a un label específico: se ven sus contests existentes
      (ej. Sudbeat → Weightless, Fading Signal).
- [ ] Con "All labels": se ven todos, con el nombre de la label al lado
      de cada uno.
- [ ] "+ New contest": el selector de track solo debería listar tracks con
      `labelSlug` de la label activa (probar con Toxic Astronaut, que
      tiene "Living" real de Naial).
- [ ] Crear un contest y confirmar que aparece: (a) en esta misma lista,
      (b) en `ActiveContests` dentro de la página pública del label
      (`/dashboard/labels/{slug}`), (c) en la card "Remix this track" del
      Track Detail del track elegido (si el artista tiene `openToRemix`),
      (d) al entrar al link de detalle del contest nuevo.
- [ ] Con "All labels" seleccionado, el formulario debería pedir elegir un
      label específico en vez de mostrar el form directamente.
- [ ] Recargar la página y confirmar que el contest creado persiste
      (`persist` del store).

**Demo policy (`/dashboard/demo-policy`, label-manager)**
- [ ] Escopear a un label, cambiar el estado a "Closed" y guardar: en
      `/dashboard/labels/{slug}` (vista productor) el badge de estado y el
      CTA deberían cambiar de "Submit demo" a "Request to connect".
- [ ] Cambiar géneros preferidos y formato/tiempo de respuesta/notas:
      confirmar que `DemoPolicyCard` en la página del label muestra los
      valores nuevos.
- [ ] Cambiar de label activo en el switcher: el formulario debe
      re-poblarse con los valores de la nueva label (no arrastrar los de
      la anterior).
- [ ] Confirmar el gap conocido: ese mismo cambio de `demoStatus` **no**
      se refleja en Browse/Discover (`/dashboard/labels`, tarjetas de
      búsqueda) — solo en la página de detalle del label. Si se quiere
      que sí se refleje, hay que extender ahí el mismo patrón de merge.
- [ ] Con "All labels" seleccionado, debería pedir elegir un label
      específico en vez de mostrar el formulario.

**General**
- [ ] Correr toda esta lista también como productor (vista producer) para
      confirmar que nada de lo de label-manager quedó visible o rompe esa
      vista (nav, rutas, etc.).

# Shows, Labels y DJ Mixes — qué son de verdad y cómo integrarlos al prototipo

Sigue a `docs/analisis-platform-hub.md` (que mapeó qué es "Platform" en
general y por qué existía la tile "Account", ya eliminada). Este doc va
un nivel más profundo: **qué hace cada una de las 3 que quedan en el
producto real** (chequeado en vivo contra `soundsystem.protonradio.com`,
logueado como Naial) y **cómo deberían integrarse al prototipo** en vez
de vivir como una sección aparte de solo lectura.

## Lo que confirmé en el sitio real

Navegué las 3 pestañas reales (`main.php?tab=shows|labels|mixes`) y
comparé contra nuestras 3 copias en `PlatformHubClient.tsx`. **El texto
de nuestro prototipo es una transcripción fiel** — no hay diferencia de
contenido entre lo que mostramos y lo que muestra el sitio real, tab por
tab. Lo que sí cambia mucho entre las 3 es **qué tan real/interactiva es
cada una en el producto real** — y ahí es donde hay que decidir distinto
para cada una.

---

## 1. Shows — es genuinamente informativo, no hace falta ninguna interfaz

En el sitio real, la pestaña "Shows" es exactamente esto y nada más:

> "Radio shows on Proton Radio are by invitation only. Get started by
> submitting a demo mix to Bonnie."

No hay formulario, no hay upload, no hay ningún flujo propio — es un
párrafo con un mailto. Conseguir un show en Proton Radio depende de que
un humano (Bonnie, del equipo de Proton) escuche tu demo y te invite. No
hay nada que "fingir" acá con más fidelidad, porque el producto real
tampoco tiene nada más.

**Dónde SÍ hay contenido real de Shows en nuestro prototipo**: la sección
pública `/shows` (`app/(public)/shows/ShowsView.tsx`) ya lista episodios
reales — tipados como `ProtonMix` (`types/mix.ts`), con `youtubeId` — eso
es lo que vos identificás como "los sets subidos como videos a YouTube" en
el Home. Son dos cosas relacionadas pero distintas:
- `/dashboard/platform?tab=shows` (vista productor) = "cómo consigo que
  Proton me invite a tener un show".
- `/shows` (público) = el catálogo de episodios ya publicados, embebidos
  de YouTube.

**Propuesta de integración**: no hace falta construir una interfaz de
carga (el producto real no la tiene, sería inventar algo que no existe).
Lo que sí tiene sentido es **conectar las dos partes que ya existen**:
que la pestaña Shows del productor, además del texto de "mandale un demo
a Bonnie", muestre un link a `/shows` con una frase tipo "así se ven los
shows ya publicados" — para que quede claro que ese es el destino final
si te invitan, en vez de quedar como un dato aislado sin ninguna conexión
al resto del prototipo.

---

## 2. Labels — es una aplicación de negocio, no una creación de label

Este es el que generaba más dudas, y confirmado en el sitio real +
la [FAQ pública de SoundSystem](https://intercom.help/proton-radio/en/articles/3078974-proton-soundsystem-faq):
**"abrir una label en Proton" no es algo que un productor hace instantáneamente
desde su propio perfil.** Es un proceso de negocio separado:

1. Cualquiera que quiera lanzar una label en Proton llena un **"Label
   Launch Application Form"**.
2. El equipo de Proton (el "launch team") te contacta en **2-3 días
   hábiles**.
3. Recién ahí, si Proton acepta, se distribuye tu catálogo y accedés a
   todas las herramientas de label (contratos automáticos, statements,
   Promo Pool, Release Links, etc. — la lista de features que ya
   modelamos nosotros en el lado label-manager del prototipo).

O sea: **una label en Proton no la "creás vos", te la aprueban.** Por eso
el mailto a `launch@protonradio.com` en vez de un botón "Crear label" —
es fiel al producto real, no es una limitación del prototipo.

Esto también aclara una cosa importante para nuestro propio modelo: nuestro
sistema de **label-manager** (Roster, Scouting, Requests, Contests, Demo
policy, etc.) asume que la label **ya existe y ya te la aprobaron** — es
la vista de gestión de una label activa, no el flujo de convertirte en
label. Son dos etapas distintas del mismo camino: (a) aplicar para que te
aprueben una label, (b) una vez aprobada, gestionarla. Hoy solo tenemos
construida la (b).

**Propuesta de integración**: en vez de un mailto plano, se podría simular
el "Label Launch Application Form" real como una **interfaz de solicitud**
dentro del prototipo — nombre, mail (prefillado con los datos de
`mockAccount`), género/estilo de la label, mensaje — que al enviar
muestre algo tipo "Te vamos a contactar en 2-3 días hábiles", igual que
el copy real. Eso sí es fiel al producto (una aplicación, no una
creación instantánea) y le da al prototipo una interacción real donde
hoy solo hay un link `mailto:`. **No** debería convertirse en un atajo
directo hacia el label-manager del prototipo — mezclaría "pedir que te
aprueben una label" con "ya tengo una label y la gestiono", que son pasos
distintos y no deberían verse como lo mismo.

---

## 3. DJ Mixes — es la única que es una herramienta real y funcional

En el sitio real, "Create New Mix" **es un formulario que funciona de
verdad**: DJ (vos mismo, fijo), Título, dos checkboxes de aceptación
("leí la guía", "solo uso tracks de mi Track Stack"), botón de submit —
y dos listas reales abajo ("Mixes in Development", "Published Mixes").
"Track Stack" es el concepto real de Proton para "tu catálogo de tracks
aprobados que podés usar en un mix" — que es conceptualmente **exactamente
lo que ya tenemos** como `mockTracks` (el catálogo propio de Naial).

De las 3, esta es la única donde:
- El producto real tiene un flujo self-serve genuino (no depende de que
  un humano te apruebe algo antes de poder intentarlo).
- Ya tenemos la data que necesitaría (`mockTracks`, con `artistId`,
  `title`, `genre`, etc.).
- Ya tenemos el patrón de store para algo así (mismo patrón que
  `useContestsStore`/`labelInboxStore`: un formulario que crea una
  entidad nueva en un store persistido, con una lista "en progreso" /
  "publicado").

**Propuesta de integración**: esta es la candidata real a dejar de ser
un mock deshabilitado y pasar a ser una feature de verdad del
prototipo:
- Formulario: título del mix + selector multi-track de tu propio catálogo
  (`mockTracks` filtrado por `artistId === mockArtist.id`) + los dos
  checkboxes (mantenerlos, son parte real del flujo).
- Al crear: un nuevo `DjMix` (tipo nuevo, `{id, title, trackIds, artistId,
  status: "in_development" | "published", createdAt}`) en un store
  persistido (`useDjMixesStore`, mismo patrón que `contestsStore`).
- Reemplazar las dos listas de barras grises (`Mixes in Development`,
  `Published Mixes`) por las entradas reales del store, filtradas por
  `status`.
- No hace falta simular la distribución real a Spotify/Apple — alcanza
  con que el flujo de creación sea real y el mix aparezca en la lista
  correcta, igual que hicimos con Contests.

---

## Sobre la pregunta de fondo: ¿"Platform" es el nombre correcto, y deberían vivir ahí o en "Herramientas"?

Tu instinto es correcto: **las 3 son herramientas que un productor usaría
activamente**, no contenido de referencia — "cómo consigo un show",
"cómo aplico para una label", "cómo subo un DJ mix" son las 3 acciones
que un productor haría, no páginas que lee una vez y listo. Hoy viven en
"Platform" (`SidebarPlatformSection.tsx`), una sección **separada** de
"Producer tools" (`SidebarProducerTools.tsx`, que hoy solo tiene "Release
Links"). Esa separación fue una decisión explícita documentada en
`docs/README-dashboard-vision-roadmap.md` — pero fue pensada cuando las 3
eran solo copy de referencia sin ninguna interacción real.

Si DJ Mixes pasa a ser un formulario real (propuesta arriba) y Labels
pasa a ser una solicitud real (propuesta arriba), ya no tiene mucho
sentido que sigan separadas de "Producer tools" — encajarían mejor ahí,
junto a Release Links, como una sola sección de herramientas activas.
Shows, al no tener ninguna acción real posible (sigue siendo "mandale un
mail a Bonnie"), podría quedarse como está o simplemente vivir como una
tarjeta informativa dentro de esa misma sección de Herramientas, sin
necesitar su propia pestaña.

**Resumen de la recomendación original:**
1. Mover las 3 (o lo que quede de ellas) de "Platform" a "Producer
   tools", ya que conceptualmente son herramientas, no referencia.
2. DJ Mixes → construir el formulario real.
3. Labels → convertir el mailto en una interfaz de "solicitud" simulada.
4. Shows → dejar el texto como está, pero linkear a `/shows`.

Después de conversarlo, **Shows + DJ Mixes quedaron decididos como
roadmap** (sección siguiente). **Labels sigue en discusión** — apareció
un matiz nuevo que cambia dónde debería vivir (última sección de este
doc).

---

## Roadmap: Shows + DJ Mixes se mudan a "Producer tools" — implementado

**Qué se hizo:** las tiles Shows y DJ Mixes salieron de la sección vieja
(ahora renombrada `SidebarExtrasSection.tsx` / "Extras") y pasaron a
"Producer tools" (`SidebarProducerTools.tsx`), junto a Release Links —
en el sidebar de escritorio, en el drawer mobile (`HamburgerMenu.tsx`), y
en `navData.ts` (`producerToolLinks` ahora incluye las 3; `extrasLinks`
quedó solo con Labels). La sección "Platform" que sobrevive se renombró a
**"Extras"**, con un tooltip explícito ("Not about your producer account
— apply to launch your own label") para que quede claro que Labels es
otra cosa. La página `/dashboard/platform` (misma ruta, mismos 3 tabs por
query param) dejó de ser un hub con selector de tiles — ahora cada área se
llega directo por su propio link de nav, así que se sacó el grid
clickeable y quedó solo el panel correspondiente al tab con el que
llegaste.

**Por qué (la justificación que quedó acordada):** las dos son acciones
que un productor **ya logueado, ya con perfil armado** haría activamente
para sacar contenido a través de los canales propios de difusión de
Proton — "conseguí que me den un show en la radio", "subí un DJ mix a
Spotify/Apple vía Proton". Se diferencian de Release Links (que promociona
un release que ya existe) en que acá generás contenido nuevo, pero
comparten la misma naturaleza: son herramientas de un productor existente,
no contenido de referencia que alguien lee una sola vez. Por eso encajan
mejor agrupadas con Release Links que separadas en su propia sección
"Platform" — esa separación tenía sentido cuando las 3 (Shows, Labels, DJ
Mixes) eran solo copy sin interacción real, pero ya no aplica igual una
vez que se piensa en términos de "qué hace un productor con su cuenta".

**Alcance de la implementación, cuando se haga:**
- Shows: mover la tile tal cual está (sigue siendo texto + mailto a
  Bonnie, fiel al producto real — no hay nada más que construir ahí) y
  agregarle un link a `/shows` para conectarlo con el catálogo de
  episodios que ya existe en el prototipo.
- DJ Mixes: convertir el formulario deshabilitado en uno real — título +
  selector multi-track del catálogo propio (`mockTracks` filtrado por
  `artistId === mockArtist.id`) + los dos checkboxes existentes. Al crear,
  un `DjMix` nuevo (`{id, title, trackIds, artistId, status:
  "in_development" | "published", createdAt}`) en un store persistido
  (`useDjMixesStore`, mismo patrón que `contestsStore`), reemplazando las
  listas de barras grises por las entradas reales filtradas por `status`.
  No hace falta simular la distribución real a Spotify/Apple.

**Status: implementado completo** (mudanza de sección + funcionalidad real):
- Shows: linkea a `/shows` (conectándolo con el catálogo de episodios ya
  existente). **Corregido tres veces tras feedback**, cada vuelta más
  cerca de lo real: (1) primer pase, solo el link, sin nada funcional; (2)
  se agregó un formulario de "enviar demo" con textarea libre — mal,
  porque un demo mix es un set grabado de verdad, no texto inventado; (3)
  se cambió a elegir uno de tus `DjMix` ya publicados — **todavía mal**,
  porque un show submission no tiene por qué depender de haber creado
  antes un DJ Mix, son dos cosas relacionadas pero separadas (convertir el
  set aceptado en video es trabajo de Proton, no algo que dependa de nuestro
  sistema de DJ Mixes). Versión final: **su propio upload independiente**,
  con la misma forma que un DJ mix (archivo real — `.mp3`/`.wav`/`.flac`/
  `.aiff`, máx 300 MB —, género, descripción, tracklist) pero sin
  depender de `useDjMixesStore` para nada. Guarda una `ShowSubmission`
  (`types/showSubmission.ts`) en `useShowSubmissionsStore`
  (`lib/store/showSubmissionsStore.ts`, persistido) con `status:
  "pending"`; si ya mandaste una, se muestra el título + fecha + "pending
  review". El mailto a Bonnie se mantiene al lado, porque así funciona de
  verdad. El input de tracklist se extrajo a un componente compartido
  (`TracklistInput`) reusado también por DJ Mixes, ya que es exactamente
  el mismo mecanismo en las dos pantallas.
- DJ Mixes: el formulario dejó de estar deshabilitado. **Corregido tras
  feedback**: el primer intento limitaba el tracklist a un multi-select
  del catálogo propio del productor (checkboxes) — mal enfoque, porque un
  DJ mix normalmente incluye tracks de todo el mundo, no solo los tuyos.
  Rehecho como un input de texto con autocompletado: escribís el nombre
  de una canción, y si matchea contra `KNOWN_TRACKS` (todo lo que existe
  en el catálogo mock de Proton — `mockTracks` + `PEER_TRACKS` +
  `LABEL_SAMPLE_TRACKS`, no solo lo tuyo) aparece como sugerencia
  clickeable marcada "on Proton" y esa fila queda linkeada a un track
  real (`DjMixTracklistEntry.trackId`); si no matchea (el caso más común
  — Proton distribuye ~1.500 labels, una porción chica de toda la música
  electrónica que existe) se agrega como texto libre con "Add"/Enter. Más
  los dos checkboxes reales (guía / Track Stack). Al crear, guarda un
  `DjMix` (`types/djMix.ts`) en `useDjMixesStore`
  (`lib/store/djMixesStore.ts`, persistido, mismo patrón que
  `contestsStore`) con `status: "in_development"`. Las listas de barras
  grises se reemplazaron por las entradas reales, filtradas por status;
  cada mix "in development" tiene un botón "Mark as published" que lo
  mueve a la lista de publicados (`publishMix`). No se simula la
  distribución real a Spotify/Apple, como estaba previsto.

---

## Labels — seguimos pensando dónde va (no resuelto)

La primera propuesta fue: mover la solicitud de "lanzar una label" al
signup de `/login`, como una bifurcación — "¿Sos artista o querés lanzar
una label con Proton?" — ya que hoy Sign in y Create account hacen
exactamente lo mismo (mismo cookie demo, mismo destino fijo) y no hay
ningún punto en todo el prototipo donde se te pregunte qué querés hacer
antes de asignarte una identidad.

**El matiz que lo complica:** esa bifurcación asumía implícitamente que
quien se registra para lanzar una label es *también* un productor/artista
— dos caminos que salen de la misma cuenta. Pero no tiene por qué ser
así: puede perfectamente ser alguien que **no es artista de Proton en
absoluto** — un DJ, un manager, cualquiera — que solo quiere crear una
cuenta para gestionar una label, sin tener (ni querer tener) un perfil de
artista propio con tracks. Es decir, "artista" y "label" no son
necesariamente dos facetas de la misma persona/cuenta — pueden ser dos
tipos de cuenta completamente independientes, cada uno con su propio
dueño.

Esto importa porque cambia la pregunta de fondo: no es "¿este usuario es
artista o label?" (una bifurcación de rol dentro de una sola cuenta), es
más bien "¿qué tipo de cuenta estoy creando?" — y una cuenta tipo label
no necesariamente arrastra ni necesita nada del modelo de productor
(`mockArtist`, tracks, etc.) que hoy asumimos como punto de partida de
todo el dashboard.

**Preguntas abiertas para la próxima vuelta:**
- ¿Una cuenta de label-manager "nueva" (recién aplicada, sin aprobar
  todavía) debería tener algún estado propio en el prototipo — una especie
  de "pendiente de aprobación" — o alcanza con que el formulario de
  solicitud sea el final del camino en este prototipo (no hay nada
  después, como pasa hoy con Shows)?
- Si son cuentas independientes (no todo productor es potencial label y
  viceversa), ¿tiene sentido igual que la solicitud viva en el mismo
  `/login`, pero como una tercera opción al mismo nivel que "Soy artista"
  y "Ya tengo cuenta" — en vez de una sub-rama de "Create account"?
- ¿Vale la pena modelar esto ahora dado que el prototipo no tiene cuentas
  reales de ningún tipo (todo login es demo/fake), o es sobre-ingeniería
  para un prototipo que de entrada no puede representar "cuentas
  separadas" de forma honesta?

**Status: sin resolver, no implementar todavía.**

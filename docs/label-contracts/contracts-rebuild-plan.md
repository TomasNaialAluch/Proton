# Rearmar "Contracts" con nuestro diseño — plan

Inspeccioné la página real (`soundsystem.protonradio.com`, con tu cuenta) para
que esto no sea una reconstrucción a ojo. Este doc es el plan — no toca código
salvo lo que ya quedó marcado como hecho más abajo.

Reordenado para que se lea de corrido como guía (nada de contenido se borró —
las secciones que quedaron obsoletas en el camino están al final, en
"Apéndice: decisiones descartadas").

## La separación (leer esto primero)

Son **dos secciones separadas**, no una con pestañas:

- **Labels** = Browse + Submissions. Descubrir labels de la plataforma y
  mandarles un demo. Nada de contratos vive acá.
- **Contracts** = todo lo demás. Lo que ya existe en la página oficial (la
  tabla de Date/Release/Label/Status/View) **más** la parte de firmar que
  nosotros agregamos (lector de PDF in-app + firma). Es su propia sección,
  con su propio ítem de nav — no una pestaña adentro de Labels.

**Aclaración explícita — de "Labels" (hoy "Label Deals" en el nav) solo se
saca la parte de Contracts.** Browse y Submissions **no se tocan ni se
borran**, se quedan viviendo en Labels tal cual están hoy. Lo único que se
mueve es la pestaña/lógica de Contracts, a su sección nueva.

## Por qué existe esta página (no es una idea nuestra)

"Contracts" no es una sección que estamos proponiendo — **ya la decidieron**
en el producto real (los que van a ser nuestros jefes la armaron así en
`soundsystem.protonradio.com`, con datos reales de artistas ahora mismo). Lo
que hacemos acá es rearmarla con nuestro diseño, no inventarla de cero. Eso
fija lo que la página tiene que poder hacer sí o sí:

1. **Firmar** los contratos que todavía no están firmados.
2. **Ver** los que ya están firmados (historial).
3. **Acceder al PDF** de cada contrato, firmado o no.

Estos tres puntos son el piso mínimo — están los tres en el real (aunque el
real solo cumple el 2 y el 3 bien; firmar ahí ni existe, es todo por mail).
Nuestra versión ya cumple los tres, y en el punto 3 va un paso más allá: en
vez de un link que te saca de la página, **el PDF se ve directo adentro**
(`PdfContractViewer`, ver `ContractDetailClient.tsx`) — eso es una mejora
real sobre el producto que decidieron ellos, no un lujo nuestro.

## Lo que vi en el real (fuente de verdad)

Es **una sola página monolítica**: `main.php?tab=accounts`, con 4 sub-tabs por
hash de URL (`#artists-tab`, `#performance-tab`, `#royalties-tab`,
`#contracts-tab`) — todo el HTML de las 4 pestañas viene renderizado por el
servidor de una y JS solo muestra/oculta según el hash. **No hay una API JSON
separada para contracts** — no capturé ningún request de red al entrar a esa
pestaña; la tabla ya está en el HTML inicial y la librería de tabla (estilo
DataTables) solo le agrega orden/búsqueda/paginación en el navegador.

**Estructura real de la tabla de contratos:**

- Título: *"Here are all your contracts. Have you signed them all?"*
- Buscador (input de texto libre, filtra la tabla)
- Selector "per page" (10 / 25 / 50 / 100)
- Columnas: **Date · Release · Label · Status · [botón "View Contract"]**
- Status como texto plano en verde: `SIGNED`
- Paginación numerada abajo + "Showing 1 to 4 of 4 entries"
- El botón **"View Contract"** es un link a
  `index.php?cid={id}&p={token}` — un id de contrato + un token de acceso por
  contrato (no hay visor propio, abre otra pantalla / descarga directa).

Con tu cuenta real vi 4 contratos — son **los mismos 4 que yo ya había puesto
como mock** en el prototipo antes de esta vuelta (Tied Inside, Mind Altered,
Balance, Beyond Living, con las mismas fechas) — o sea que el mock anterior ya
estaba calcado de tu cuenta real. Buena señal: no hay que inventar nada nuevo
de estructura de datos, solo confirmar campos.

### Actualización — qué es realmente "View Contract" (lo abrí para confirmarlo)

Asunción corregida: **no es un PDF.** Es una página HTML propia,
`contracts/proton_contract_v7.php?cid={id}&p={token}` (el link real que abre
el botón, distinto del `index.php?cid=...&p=...` de la tabla — ese
probablemente redirige acá). Formato real, de punta a punta:

- Header con logo "Proton" + título "RECORDING CONTRACT".
- Caja negra de instrucciones: *"This contract must be approved digitally.
  Read the entire document and click 'Accept Contract.' Do not mail us
  physical copy of this contract."*
- Bloque "prepared on [fecha] by: Proton L.L.C. [dirección]" / "prepared
  for: [artista] [dirección]".
- "HEADS OF AGREEMENT" — texto libre con el resumen del release y el label.
- Tabla **TRACK(S) · GENRE · ROYALTY · TERMS** (una fila por track).
- "KEY NOTES" — bullets con las condiciones de pago/reportes.
- Cláusulas legales numeradas (1 a 11 en el que vi) — términos completos,
  jurisdicción, duración, royalties, renovación, terminación, y la número 11
  aclara: *"This agreement may be approved digitally... This agreement does
  NOT require counter-signature by Proton, Inc."* — o sea, el label/Proton no
  contrafirma, es aceptación unilateral del artista.
- **La "firma" es texto plano**, no una imagen ni un trazo: al pie dice
  `Signed by: Tomas Naial Aluch` y `Date: Saturday 19th of August 2023`. El
  botón "Accept Contract" (mencionado en la caja negra, no lo vi activo
  porque este contrato ya estaba firmado) es lo que genera ese texto — no hay
  dibujo, tipeo estilizado, ni imagen subida como en nuestra versión.

**Lo que esto cambia:** nuestra firma (dibujar/tipear/subir/foto + ubicarla
sobre un PDF) es un mecanismo más elaborado que el real de Proton — el real
es literalmente un botón que estampa tu nombre en texto. Esto no invalida lo
que armamos: el caso real que motivó todo esto (el contrato de Dear Deer) es
un PDF de verdad, mandado por un label externo por mail — ahí sí hace falta
lo que construimos. Pero contratos que vienen directo de Proton (como estos
4) son HTML con aceptación por botón, no PDF. Probablemente conviene que
Contracts soporte los dos casos: **HTML con "Accept Contract"** para
contratos generados por Proton, y **PDF con firma dibujada** para los que
manda un label externo por su cuenta (como Dear Deer) — a definir si hace
falta diferenciarlos o si unificamos todo bajo el flujo de firma que ya
tenemos (más prolijo, y ya funciona).

**Corrección del usuario — resuelto, no queda abierto.** Lo que se ve en
"View Contract" (la página HTML con firma en texto) es la **copia archivada
de un trato que ya se cerró por fuera de la plataforma** — hoy el proceso
real es: el label te manda el PDF por mail, vos lo firmás como podés
(imprimir/firmar/escanear, o lo que sea) y se lo mandás de vuelta por mail;
en algún momento eso queda registrado en SoundSystem como "SIGNED" con esa
página de resumen. **No es un mecanismo alternativo de firma que haya que
igualar** — es el síntoma del problema que este proyecto existe para
resolver. Nuestro flujo de PDF real + firma dibujada/tipeada/subida/foto
**se mantiene tal cual está, sin dividir en dos formatos** — es
específicamente la solución a ese mail de ida y vuelta. La página HTML del
real, como mucho, es una referencia de qué datos mostrar en el resumen
"Signed & verified" (nombre, fecha) una vez firmado adentro de Proton — no
un formato a replicar.

## Qué se mantiene igual (paridad con el real)

- Las mismas columnas de fondo: fecha, release, label, estado, acción sobre
  el documento.
- Buscador + selector de cantidad por página — hoy no los tenemos, y con más
  de 4-5 contratos van a hacer falta.
- El tono directo del copy ("Have you signed them all?") — nuestro
  `"You have N contracts waiting on your signature"` ya va en esa línea.

## Qué mejora el rediseño (no es un clon 1:1)

- El real es una tabla plana estilo Excel-en-web (DataTables genérico, sin
  identidad visual). Nuestra versión usa cards, badges de estado con color
  por label, agrupación "By label", mobile-first — eso ya está mejor y se
  mantiene.
- El real, al tocar "View Contract", **te saca de la página** a
  `index.php?cid=...` — no hay lectura ni firma in-app, es un link con token.
  Nuestra versión ya lo supera: lector de PDF adentro + firma con overlay +
  descarga — esto es directamente mejor que el original, no hay que
  retroceder acá.

## Estrategia de migración

Contracts se separa como su propia sección, no se queda como una pestaña
adentro de Labels.

**Fase 1 — mover/copiar lo que ya funciona, tal cual.** Todo lo que armamos
para firmar y leer el PDF está bueno y se mantiene sin reescribir:

- `components/dashboard/producer/labels/PdfContractViewer.tsx`
- `components/dashboard/producer/labels/SignatureOverlay.tsx`
- `components/dashboard/producer/labels/SignatureCanvas.tsx`
- `components/dashboard/producer/labels/ContractKeyDates.tsx`
- `app/(dashboard)/dashboard/(producer)/labels/contracts/page.tsx` y
  `.../contracts/[id]/ContractDetailClient.tsx`
- `lib/store/contractsStore.ts`, `lib/mock/contracts.ts`,
  `types/contract.ts`, `types/signature.ts`, `lib/pdf/*`

Estos se copian/mueven a la nueva ubicación de Contracts como sección propia.
Después de mover, hay que actualizar los `href` internos (breadcrumbs, "Back
to contracts", links desde Settings/Pro Access) para que apunten al nuevo
lugar.

**Carpeta de destino para los componentes.** Los 4 componentes de
`components/dashboard/producer/labels/` (`PdfContractViewer`,
`SignatureOverlay`, `SignatureCanvas`, `ContractKeyDates`) pasan a una carpeta
propia — `components/dashboard/producer/contracts/` — siguiendo el mismo
patrón que ya usa el repo (una carpeta por sección bajo `producer/`, ver
`components/dashboard/producer/labels/` como referencia). Nada de código
nuevo ni reescrito, es mover archivo + actualizar imports. Mantiene el
proyecto escalable: cada sección (`labels/`, `contracts/`) queda dueña de sus
propios componentes, sin que uno dependa de la carpeta del otro.

**Corrección del usuario — no es un renombre, es agregar al lado.**
Lo de abajo (tachado) decía que había que renombrar "Label Deals" a
"Contracts" en el nav. Está mal: **"Label Deals" no se toca** — sigue siendo
su propia sección (Browse + Submissions, para mandar demos), separada de
Contracts. Lo que corresponde es que el nav tenga **los dos ítems por
separado**: "Contracts" (nuevo) al lado de "Label Deals" (como ya estaba),
no uno reemplazando al otro. `AppSidebar.tsx` ya quedó así — "Contracts" se
agregó como ítem nuevo, "Label Deals" se restauró tal cual estaba.

~~El nombre del nav ya está decidido, no es a elección nuestra: el nav hoy
dice "Label Deals" donde tendría que decir "Contracts". En el real, el tab
bar es literalmente `Artists | Performance | Royalties | Contracts` (lo vi
con tu cuenta) — mismo orden, mismo cuarto ítem. Si dejamos "Label Deals" ahí
no estamos respetando la página original.~~ *(la comparación con el tab bar
real seguía siendo válida como referencia de dónde ubicar "Contracts" en el
orden, pero no implicaba borrar "Label Deals" — eso fue una lectura
equivocada de mi parte.)*

- ✅ **Desktop** (`AppSidebar.tsx`) — hecho: "Contracts" agregado como ítem
  propio (`/dashboard/contracts`), "Label Deals" restaurado
  (`/dashboard/labels`), los dos conviven.
- ⬜ **Mobile** (`BottomNav.tsx`, `HamburgerMenu.tsx`) — pendiente: agregar
  "Contracts" como ítem nuevo, **sin tocar** el "Label Deals" que ya está.

La limpieza de "Label Deals" (revisar nombre/ícono, contenido de Browse +
Submissions) queda para más adelante — la hace el usuario después, y no
incluye borrarlo ni renombrarlo.

**Nota aparte:** mientras miraba la cuenta real no abrí ningún "View
Contract" (son documentos legales tuyos reales, con token de acceso) — solo
leí la tabla y la estructura de la página. Si en algún momento hace falta ver
el contenido real de un PDF firmado para comparar el formato, avisame y lo
hacemos a propósito.

## Cómo se va a ver Contracts — flujo propuesto

Pensado a partir de lo que pediste: primero ver los contratos como en la
página real, después un aviso de "tenés que revisar esto", y desde ahí entrar
al contrato. Tres capas, de más pasiva a más directa:

**1. La vista principal — la lista, con la cara de la real.**
Al entrar a Contracts (desde el nav, hoy "Label Deals" en mobile / "Contracts"
en desktop) lo primero que se ve es la lista completa, paridad con
`soundsystem.protonradio.com`: Date · Release · Label · Status, buscador,
paginación — pero con nuestra cara (cards, badges de color), no la tabla
plana del real. Esto ya existe hoy en `labels/contracts/page.tsx`, se
mantiene igual al migrar.

**2. El aviso — que se note sin tener que entrar a mirar.**
Hoy el aviso de "tenés contratos por firmar" solo existe *adentro* de la
lista (el banner ámbar "You have N contracts waiting on your signature") —
o sea que ya tenés que haber entrado para enterarte. Para que avise antes de
entrar, van dos cosas, no una sola:

- **Un punto/badge en el ítem de nav "Contracts"** (sidebar y bottom nav) —
  visible todo el tiempo, sin abrir nada. Es el aviso más directo: entrás al
  dashboard y ya ves que Contracts tiene algo pendiente, antes de tocarlo.
- **La campana de notificaciones, pero de verdad.** Ya existe un item mock
  ahí ("Pending contract — The contract with Stellar Records requires your
  signature") que no lee de ningún dato real ni linkea a ningún lado. La idea
  es que ese item salga del `contractsStore` real y lleve directo al
  contrato pendiente (`/dashboard/labels/contracts/c7`, por ejemplo) — hoy es
  puro copy estático, se conecta.

El banner ámbar de la lista (punto 1) se mantiene también — es el refuerzo
una vez que ya entraste, no se reemplaza por los otros dos.

**3. Entrar al contrato.** Desde cualquiera de los tres (nav badge →
lista → fila; notificación → directo al contrato; o lista sin aviso, solo
navegando) se llega al mismo lugar: el detalle del contrato
(`ContractDetailClient.tsx`) con el lector de PDF y la firma. No hay un
camino "correcto" — los tres son entradas distintas al mismo destino.

Esto es diseño/flujo, no está implementado el badge del nav ni la conexión
real de la notificación — queda para el Roadmap de abajo.

## Orden de la lista y el detalle según estado

**Orden de la lista.** Una sola lista con todos los contratos (firmados +
sin firmar) — no dos listas separadas. Los **no firmados van primero**,
después los firmados. Hoy `labels/contracts/page.tsx` los muestra en el
orden en que están en el mock; hay que ordenarlos por status antes de
mostrar (pending_signature arriba, signed abajo).

**El detalle no son dos componentes — es uno que cambia según el status.**
Tocás un contrato → se abre `ContractDetailClient.tsx` con el PDF visible
siempre. Lo que cambia adentro es el bloque de abajo:

- Si está **sin firmar**: el bloque de firma — crear/elegir firma, ubicarla
  sobre el PDF, confirmar. Esto ya existe.
- Si está **firmado**: el bloque "Signed & verified" — solo lectura, nombre,
  fecha, hash. Esto también ya existe.

O sea que lo que pedís ya está resuelto así, solo hay que mantenerlo al
migrar — no separar en dos pantallas/rutas distintas, es una sola con una
rama condicional según `contract.status`.

**Conectar con la API real (a futuro, no ahora).** Hoy `documentUrl` es mock
(un archivo estático en `public/contracts/` o un `blob:` generado en el
cliente al firmar). El equivalente real sería pegarle al backend de
`soundsystem.protonradio.com` (el patrón que vimos: `index.php?cid={id}&p=
{token}`) para traer el contrato real y su PDF. Esto no se hace todavía —
seguimos con mock — pero queda anotado como el punto de integración cuando
haya backend real para esta sección.

### Corrección — sí van dos componentes de detalle, no uno

Esto reemplaza la conclusión de arriba ("no separar en dos pantallas") —
el usuario aclaró el criterio real y cambia el enfoque:

Los datos que trae Contracts al prototipo son **los contratos reales de
Naial** — los 4 que ya están firmados en la cuenta real (Tied Inside, Mind
Altered, Balance, Beyond Living) **más** el de JIK/Never Leave (Dear Deer),
que queda hardcodeado como el único **sin firmar**.

- **JIK (sin firmar)** → usa el detalle que ya construimos entero:
  `ContractDetailClient.tsx` con `PdfContractViewer` + el flujo de firma
  (crear firma, ubicarla, confirmar). Es la pieza que mostramos para
  demostrar cómo se va a ver el feature terminado.
- **Los 4 reales (ya firmados)** → **también entran a un detalle propio
  dentro de la app** (no un botón que te saca afuera). Corrección del
  usuario sobre lo que había anotado antes: no es "click → nueva pestaña con
  el link real". Es un detalle con la misma cara que el otro (mismo tipo de
  visor), y **adentro** de ese detalle es donde se accede al contrato real
  (`contracts/proton_contract_v7.php?cid={id}&p={token}`, confirmado abriendo
  el de Beyond Living). La idea es dejar armado visualmente cómo se va a ver
  esto a futuro: **el link real terminará abriéndose embebido dentro de un
  componente tipo visor** (parecido al `PdfContractViewer` que ya tenemos, no
  un simple link externo) — por ahora alcanza con dejar el detalle con esa
  cara/estructura, aunque el embed real todavía no esté conectado.

**Por eso son 2 "contract detail", no 1 con una rama:**
1. `ContractDetail` (el que ya existe) — para el contrato a firmar (JIK), con
   `PdfContractViewer` + firma.
2. Uno nuevo — mismo tipo de pantalla (detalle + visor), pero en vez de
   `PdfContractViewer` con nuestro PDF, tiene un visor que va a mostrar el
   contrato real embebido (`proton_contract_v7.php?cid=...&p=...`) — sin
   firma, porque esos ya están firmados. No es "salir de la app", es "ver
   adentro, con nuestra cara".

Los `cid` + `p` de los 4 reales, ya confirmados navegando la cuenta:

| Release | cid | p |
|---|---|---|
| Tied Inside | 951070 | dadd4115e8f558a8544b7b848c555701 |
| Mind Altered | 797449 | c617f159f3d73aac62dd2f0a00ab6ea0 |
| Balance | 717531 | 3a21c9d96e6f13f785757bcc3c9e4c38 |
| Beyond Living | 624386 | 082e18675fde0b70f53946b98b659576 |

Son credenciales de acceso reales a documentos legales reales — hardcodearlos
en el mock del prototipo es una decisión a confirmar con el usuario antes de
subir esto a ningún lado público, aunque para desarrollo local no hay
problema.

## Layout e interacción de ContractSignClient (rediseño del orden actual)

Cambia el orden de arriba a abajo y se agrega interacción nueva sobre el
visor. Esto es solo para `ContractSignClient` (el de firmar) — no aplica a
`ContractRecordClient`.

**Orden nuevo:**

1. **Key Dates primero.** Hoy están después del visor de PDF; pasan a ser lo
   primero que se ve al entrar — da contexto (plazos, fecha límite) antes de
   meterse en el documento en sí.
2. **Visor de PDF, colapsado por default.** Arranca minimizado (una barra
   compacta con el nombre del documento, tipo "acordeón cerrado") y se
   expande al tocarlo.
3. **Hover con lápiz + click abre modal — corrección del usuario sobre lo
   que hace ese modal.** Al pasar el mouse sobre el PDF expandido, el
   cursor cambia a un ícono de lápiz. Al hacer click se abre un **modal**,
   pero **el modal es solo para conseguir la imagen de la firma** — no firma
   nada por sí solo:
   - Si ya hay firma guardada (`useSignatureStore`): el modal la muestra
     para confirmar "usar esta".
   - Si no hay firma guardada: el modal muestra el selector de crear firma
     (dibujar/tipear/subir/foto — lo que ya es `SignatureCanvas`) ahí mismo,
     no te saca a otro lado de la página.
4. **Después del modal: acomodar la firma arriba del PDF, como ya
   funciona hoy.** Cerrado el modal (con una imagen de firma lista, nueva o
   guardada), el visor de PDF queda expandido y entra en modo "ubicar
   firma" — exactamente el `SignatureOverlay` que ya existe: arrastrar,
   redimensionar, rotar la firma sobre el documento.
5. **Guardar → genera el PDF válido.** Al confirmar la posición
   ("Confirm & sign" / "Guardar"), corre lo que ya está construido
   (`embedSignatureInPdf`): incrusta la imagen en el PDF real y ese archivo
   nuevo — no el original — pasa a ser `documentUrl`, el PDF válido del
   contrato firmado. Esto no es nuevo, es el mecanismo que ya existe en
   `ContractSignClient` — lo único que cambia es *cómo se llega* a este
   paso (antes: botón inline "Add signature to document"; ahora: hover +
   click + modal de elegir/crear firma).

**Mi opinión sobre lo que preguntaste (¿componente de firma repetido en
Settings, está bien?):** sí, mantenerlo en los dos lugares está bien —
son dos momentos de uso distintos, no una duplicación real: Settings es para
"dejar mi firma lista de antemano" (proactivo, antes de que haya un contrato
esperando), y el bloque al final del contrato es para "la necesito ahora y
no tengo una" (reactivo, en el momento). Los dos ya escriben al mismo
`useSignatureStore`, así que no hay dos fuentes de verdad — es el mismo dato,
con dos puntos de entrada según el momento en que el usuario lo necesita.

**Una tensión a tener en cuenta (no la resuelvo acá, la dejo anotada):**
colapsar el PDF por default achica la posibilidad de que alguien firme sin
haber leído el contrato — hoy el visor está abierto de entrada, lo que
empuja más a leerlo antes de llegar al botón de firmar. Minimizarlo mejora
el scroll/orden visual (sobre todo en mobile), pero es una decisión de
producto, no solo visual: prioriza espacio por sobre "forzar" la lectura.
Vale la pena tenerlo en cuenta, aunque no bloquea implementarlo así si es lo
que se quiere.

## Estructura de carpetas final — dónde va cada cosa

Todo bajo su propia sección, nada compartido "a mano" entre `labels/` y
`contracts/` — cada una dueña de lo suyo. Mismo patrón que ya usa el repo
(una carpeta por sección bajo `producer/`).

```
app/(dashboard)/dashboard/(producer)/contracts/
├── page.tsx                    # la lista: Date/Release/Label/Status/View,
│                                # buscador, paginación, no-firmados primero
└── [id]/
    ├── page.tsx                 # decide qué componente renderizar (ver abajo)
    ├── ContractSignClient.tsx   # ex ContractDetailClient.tsx — PDF + firma,
    │                            # para contratos sin firmar (JIK)
    └── ContractRecordClient.tsx # NUEVO — detalle propio (no un link que
                                  # saca de la app), con un visor que va a
                                  # embeber el proton_contract_v7.php real
                                  # adentro (misma idea que PdfContractViewer,
                                  # pero para el contrato real) — para los
                                  # 4 contratos reales ya firmados

components/dashboard/producer/contracts/
├── PdfContractViewer.tsx        # movido tal cual desde producer/labels/
├── SignatureOverlay.tsx         # movido tal cual
├── SignatureCanvas.tsx          # movido tal cual
├── ContractKeyDates.tsx         # movido tal cual
├── ContractStatusBadge.tsx      # NUEVO — hoy el badge de estado está
│                                # armado inline en contracts/page.tsx
│                                # (STATUS_CONFIG); se separa para no repetir
│                                # ese objeto si en el futuro se necesita en
│                                # más de un lugar (ej. el badge del nav)
└── ContractListRow.tsx          # NUEVO — la fila de la lista, hoy también
                                  # inline en contracts/page.tsx; separarla
                                  # deja page.tsx corto y fácil de leer

lib/store/contractsStore.ts      # movido tal cual
lib/mock/contracts.ts            # movido tal cual, + los 4 reales + JIK
lib/pdf/                         # movido tal cual (embedSignature.ts,
                                  # extractSignatureFromPhoto.ts, hashBytes.ts)
types/contract.ts                # movido tal cual, + el campo nuevo `kind`
types/signature.ts               # movido tal cual
```

**Cómo decide `[id]/page.tsx` cuál de los dos componentes mostrar.** No por
adivinar (ej. "si tiene firma, es de un tipo") — un campo explícito en el
tipo `Contract`:

```ts
// types/contract.ts
interface Contract {
  // ...lo que ya existe (id, release, label, status, keyDates, signature, etc.)
  kind: "signable" | "record";
}
```

- `"signable"` → JIK. `[id]/page.tsx` renderiza `ContractSignClient`.
- `"record"` → los 4 reales. `[id]/page.tsx` renderiza `ContractRecordClient`.

Es un campo explícito y tipado en vez de inferir el componente a partir de
otro dato (`documentUrl`, `status`, etc.) — así el día que haya un tercer
caso, se agrega un valor al union type y el compilador avisa en todos los
lugares que falten cubrirlo. Es la parte que hace esto escalable: agregar un
tipo de contrato nuevo no requiere tocar lógica condicional dispersa, solo
sumar el caso.

## Roadmap — todo lo que hay que hacer

En orden. Nada de esto está hecho todavía salvo lo marcado ✅.

1. ✅ **Separar Contracts de Labels como sección propia** — hecho: los 4
   componentes viven en `components/dashboard/producer/contracts/`, las
   rutas en `app/(dashboard)/dashboard/(producer)/contracts/`, y
   `ContractDetailClient.tsx` se renombró a `ContractSignClient.tsx`.
2. ✅ **Actualizar los `href` internos** — hecho: breadcrumbs, "Back to
   contracts", el link de "Contracts & Reports" en
   `settings/account/pro/page.tsx`, y `dashboardShellRouting.ts` (agregado
   `/dashboard/contracts` a `isProducerShellPath`).
3. ✅ **Nav — agregar "Contracts" al lado de "Label Deals"** (no
   reemplazarlo — ver "Corrección del usuario" en "Estrategia de
   migración") — hecho en los 3 lugares:
   - ✅ Desktop (`AppSidebar.tsx`).
   - ✅ Mobile (`BottomNav.tsx`, `HamburgerMenu.tsx`) — los dos ítems
     conviven, mismo orden que desktop.
4. ✅ **Buscador en la lista de contratos** — hecho: filtro de texto libre
   sobre release/label en `contracts/page.tsx`, contador "N of M" cuando hay
   búsqueda activa, y estado vacío si no matchea nada.
5. ⬜ **Selector "mostrar N por página"** — baja prioridad mientras haya
   pocos contratos mock.
6. ✅ **Badge/punto en el ítem de nav "Contracts"** — hecho en los 3 lugares
   (`AppSidebar.tsx`, `BottomNav.tsx`, `HamburgerMenu.tsx`): punto ámbar
   sobre el ícono cuando `contractsStore` tiene al menos un contrato
   `pending_signature`.
7. ✅ **Conectar la notificación "Pending contract" al dato real** — hecho:
   `NotificationsPanel.tsx` genera una notificación por cada contrato
   `pending_signature` en `contractsStore`, con link directo
   (`/dashboard/contracts/{id}`). No es parte del estado "clearable" — no
   se puede descartar sin firmar, desaparece sola cuando se firma, igual que
   el punto del nav. *(Bug encontrado y arreglado en el camino: el selector
   `s.contracts.filter(...)` devolvía un array nuevo en cada render y rompía
   `useSyncExternalStore` de Zustand — la solución fue seleccionar el array
   `contracts` estable y filtrar afuera del selector, en el cuerpo del
   componente.)*
8. ✅ **Ordenar la lista** — hecho: `STATUS_ORDER` en `contracts/page.tsx`
   ordena `pending_signature` → `expired` → `signed`, aplicado después del
   filtro de búsqueda.
9. ⬜ *(futuro, no ahora)* **Conectar `documentUrl` a la API real** —
   reemplazar el mock/blob por el patrón real `index.php?cid={id}&p={token}`
   cuando haya backend para esta sección.
10. ⬜ **Limpieza de Labels** (Browse + Submissions sin la pestaña Contracts,
    revisar nombre/ícono del nav) — la hace el usuario más adelante, no está
    en este roadmap para nosotros.
11. ~~⬜ Decisión pendiente — ¿dos formatos de contrato o uno solo?~~
    **Resuelto — ver "Corrección del usuario" en la sección de arriba.** Un
    solo formato: PDF real + firma dibujada/tipeada/subida/foto, tal cual
    está. La página HTML del real no es un formato a igualar, es el registro
    de un trato cerrado por mail — exactamente el problema que este flujo
    reemplaza. No hay nada que hacer acá, queda la fila solo como registro de
    que se evaluó y se descartó la idea de los dos formatos.
12. ✅ **Cargar los 4 contratos reales de Naial en el mock** — hecho:
    `lib/mock/contracts.ts` tiene los 4 (`r1`-`r4`, Tied Inside, Mind
    Altered, Balance, Beyond Living) con `kind: "record"` y
    `realContractUrl` apuntando al `proton_contract_v7.php?cid=...&p=...`
    real de cada uno, junto al de JIK (`kind: "signable"`). También se
    agregó el campo `kind` y `realContractUrl` a `types/contract.ts`.
    Verificado: Total 5, Signed 4 of 5, agrupado bien en "By label".
13. ✅ **Crear el segundo componente de detalle** — hecho:
    `ContractRecordClient.tsx` + `RealContractViewer.tsx` (mismo tipo de
    chrome/header que `PdfContractViewer`, sin PDF ni firma — tarjeta con
    "Open contract record" que linkea al `proton_contract_v7.php` real).
    `[id]/page.tsx` ahora lee `contract.kind` y elige entre
    `ContractSignClient` (`"signable"`) y `ContractRecordClient`
    (`"record"`). No embebe la página real todavía (ver nota en el
    componente sobre por qué) — eso queda para cuando haya una forma
    sancionada de embeberla (X-Frame-Options del sitio real probablemente
    lo bloquea).
14. ✅ **Reordenar `ContractSignClient`** — hecho: `ContractKeyDates` es el
    primer bloque adentro de `<div className="space-y-4">`, antes de
    `PdfContractViewer`.
15. ✅ **PdfContractViewer colapsable** — hecho en `ContractSignClient.tsx`:
    barra compacta ("{release}.pdf" + chevron) que arranca cerrada, se
    expande al tocarla y muestra `PdfContractViewer` adentro.
16. ✅ **Cursor de lápiz + modal para elegir/crear la firma** — hecho:
    overlay sobre la superficie del PDF expandido con cursor de lápiz (SVG
    inline vía `style.cursor`, ámbar), click abre el modal — firma guardada
    con "Use this signature", o `SignatureCanvas` si no hay ninguna. También
    se agregó un botón explícito "Sign this contract" abajo (expande el PDF
    + abre el modal) como respaldo por si el hover no se descubre solo.
17. ✅ **Después del modal, entrar a modo "ubicar firma" automáticamente**
    — hecho vía `startPlacing()`: resetea el frame, activa `placing`, cierra
    el modal. Reusa `SignatureOverlay` + `embedSignatureInPdf` sin cambios.
    Probado de punta a punta en el navegador: crear firma tipeada → modal se
    cierra → PDF expandido con overlay activo → "Confirm & sign" → queda
    "Signed & verified" con hash nuevo. El bloque inferior se simplificó
    para no duplicar el flujo (ya no tiene su propio botón "Add signature to
    document" ni el `SignatureCanvas` inline — todo eso vive en el modal).

Lo que **no** está en este roadmap porque ya está resuelto: firmar el
contrato in-app, leer el PDF adentro de la página, descargar el documento
(original o firmado), y el dato real de los 4 contratos existentes.

---

## Apéndice: decisiones descartadas

Contenido viejo, ya no vigente — se guarda acá en vez de borrarlo, como
registro de cómo se llegó a las decisiones de arriba.

### "El problema concreto que hay que arreglar" (versión original)

Reemplazado por "La separación" al principio del doc. Este era el hallazgo
que llevó a esa decisión:

En nuestra sección Labels, **las 3 pestañas (Browse / Submissions /
Contracts) muestran el mismo `<h1>Labels</h1>` fijo** — ni el breadcrumb ni el
título cambian según en qué pestaña estás. Por eso "no se llama Contracts":
technically existe la pestaña, pero la página nunca te confirma en qué
sección estás parado. Es un bug de rotulado, no un problema de arquitectura.

### "Plan de reconstrucción" (versión original, asumía Contracts como pestaña de Labels)

Reemplazado por "Estrategia de migración" — ese paso 1 de acá abajo asumía
que Contracts se quedaba como pestaña dentro de Labels, cosa que ya no es así:

1. **Título dinámico por pestaña.** `labels/page.tsx` → "Labels" (es el
   directorio/browse), `labels/submissions/page.tsx` → "Submissions",
   `labels/contracts/page.tsx` → **"Contracts"**. Cambio de una línea por
   archivo, pero es el fix que realmente pediste.
2. **Buscador en la lista de contratos** (`labels/contracts/page.tsx`) —
   filtro de texto libre sobre release/label, mismo patrón que ya usa
   `FilterDropdown` en otras listas del dashboard, no hace falta una librería
   nueva.
3. **Selector "mostrar N por página"** — opcional hasta que haya más de ~10
   contratos reales; lo dejamos anotado pero no es urgente con 1 contrato
   mock.
4. **Confirmar breadcrumb** — ya dice "Labels › Contracts", eso está bien,
   es el `<h1>` el que hay que arreglar, no el breadcrumb.

## Roadmap — bugs del flujo de firma (reportados por el usuario, sin arreglar)

Probado por mí antes y funcionó de punta a punta, pero el usuario lo probó
después en su propio navegador y encontró 3 problemas reales. Quedan
anotados para la próxima sesión de código — no se tocó nada todavía.

1. ✅ **El lápiz no agarra en todo el visor del PDF** — arreglado:
   `PdfContractViewer.tsx` ahora tiene una prop nueva, `frameOverlay`,
   separada de `children`. `children` sigue sirviendo para el
   `SignatureOverlay` (tiene que quedar exacto sobre la página, para que la
   matemática de `embedSignatureInPdf` no se desalinee). `frameOverlay` se
   renderiza como hermano del `onPageSurfaceRef`, adentro del contenedor
   scrolleable (`relative flex justify-center overflow-auto ... p-4
   max-h-[70vh]`, al que le agregué `relative`), así que con `absolute
   inset-0` cubre **todo el marco visible**, no solo el canvas de la
   página. `ContractSignClient.tsx` pasa el botón de "click para firmar"
   por `frameOverlay` en vez de por `children`. Verificado con
   `getBoundingClientRect`: el overlay ahora mide lo mismo que el
   contenedor (menos el gutter del scrollbar), en vez de quedar acotado al
   tamaño de la página sola — y el modal se sigue abriendo bien al hacer
   click.
2. ✅ **Después de ubicar la firma, no quedaba claro que había que
   confirmar** — arreglado: los controles "Confirm & sign" / cancelar se
   movieron de la card separada a un bloque pegado **justo debajo del
   visor de PDF**, dentro del mismo acordeón expandido (en
   `ContractSignClient.tsx`). La card de abajo ("Sign this contract") ahora
   se oculta mientras `placing` está activo, para no duplicar la acción en
   dos lugares. Probado de punta a punta: crear firma → ubicar → "Confirm &
   sign" pegado al PDF → "Signed & verified" con hash nuevo.
3. ✅ **El PDF no se actualiza con la firma incrustada** — re-probado
   después de arreglar los puntos 1 y 2, y **ya funciona sin tocar código
   nuevo**: hecho el flujo de punta a punta (crear firma → ubicar → Confirm
   & sign, pegado al visor), el acordeón se queda abierto, `PdfContractViewer`
   recarga solo con el nuevo `blob:` (react-pdf reacciona al cambio de prop
   `file`), y la firma aparece quemada en la página, en la línea "On behalf
   of the ARTIST" — confirmado visualmente con zoom en el navegador. Esto
   era un síntoma de los puntos 1 y 2 (el usuario no lograba llegar a
   confirmar de verdad, entonces nunca había un PDF nuevo que mostrar) — no
   un bug propio del visor. No hizo falta escribir código para este punto.

**Nota:** yo probé este flujo completo en mi navegador de preview y
funcionó (quedó "Signed & verified" con hash nuevo) — así que el mecanismo
de fondo (`embedSignatureInPdf`, `signContract`) funciona al menos en ese
caso. Los 3 puntos de arriba son de **UX/discoverability** (no encontrar el
área clickeable, no ver la confirmación) y posiblemente un bug real de
refresco del visor — no necesariamente de que el PDF-lib esté roto.

## El proceso de firma, en criollo (spec acordada con el usuario)

Esto es lo que tiene que pasar, en palabras simples, y define cómo cerrar
los puntos 2 y 3 de arriba:

1. El productor ve el PDF real adentro de la app — el mismo documento que
   mandó el label, página por página, no un ícono genérico.
2. Trae su firma (dibujada/tipeada/subida/foto) una sola vez, se guarda.
3. La arrastra como un objeto sobre el PDF, en el lugar exacto donde dice
   "Authorized Signature" — la agranda, achica, rota, hasta que quede bien
   puesta ahí, en tiempo real, sobre el documento real.
4. Al confirmar, **no se guarda un registro aparte de "firmó"** — se genera
   un PDF nuevo de verdad: el original + la firma incrustada en esa página,
   en esas coordenadas exactas, como si la hubiera dibujado a mano ahí. Ese
   archivo nuevo (no el original) pasa a ser el documento válido de ahí en
   más. Esto ya existe (`embedSignatureInPdf` + `pdf-lib`), no cambia.
5. **Lo que falta (esto es lo nuevo que hay que construir):** el PDF que se
   generó en el paso 4 tiene que **reemplazar al que se está mostrando en
   el visor**, ahí mismo, sin que el usuario tenga que recargar la página
   ni volver a abrir nada — así hay una prueba visual clara de que quedó
   firmado (ve la firma ya puesta, en el documento real, en el lugar donde
   la dejó).
6. **Y una confirmación explícita** — un mensaje claro de que salió bien
   ("firmaste correctamente" / lo que hoy dice "Signed. This contract is
   now active." pero más visible, pegado a la acción, no perdido en otra
   card) — y, a futuro, contemplar también la lectura: confirmar que el
   usuario efectivamente vio/leyó el documento antes de firmar, no solo que
   tocó el botón (ver la tensión ya anotada en "Layout e interacción de
   ContractSignClient" sobre el PDF colapsado por default).

Esto amplía (no reemplaza) los puntos 2 y 3 del roadmap de arriba — ahí
quedan los síntomas reportados, acá queda **el criterio de qué significa
"arreglado"**: visor actualizado con el PDF nuevo + confirmación visible.

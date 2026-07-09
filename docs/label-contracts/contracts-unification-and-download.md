# Unificar solo "Contracts" + recuperar la descarga del documento

Recorte del doc anterior (`unification-idea.md`, que hablaba de Labels vs.
Pro Access en general). Acá el alcance es más chico: **un solo lugar para
"Contracts"**, y arreglar algo que se perdió en el camino — la forma de
bajar/abrir el PDF original.

## Unificación de "Contracts" (alcance acotado)

No se toca Browse ni Submissions. La idea es que **"Contracts" tenga una
sola casa real** — `Labels → Contracts` — y que Settings/Pro Access deje de
tener su propio botón separado, para no dar la sensación de que hay dos
listas de contratos distintas.

- Hoy: Pro Access tiene un botón "Contracts" que **linkea** a
  `/dashboard/labels/contracts` (no duplica nada, pero visualmente parece una
  sección propia dentro de Settings).
- Idea: en vez de un botón que lleva a otro lado, que sea explícitamente un
  atajo — mismo texto, mismo ícono, pero quizás con el conteo de pendientes
  al lado (`"2 awaiting signature →"`) para que quede claro que es un
  *acceso directo* a Labels, no una sección aparte.

Esto es chico: no hay reestructuración de datos ni de rutas, solo un ajuste
de copy/UI en `settings/account/pro/page.tsx` para que no compita con Labels
como si fuera "otro lugar de contratos".

## Lo que se perdió: bajar/ver el documento original

En la página vieja (`contracts/page.tsx`, antes del rediseño), cada fila de
la tabla tenía un link **"View"** que abría `contract.documentUrl` directo en
una pestaña nueva — esa era la forma de descargar/leer el PDF crudo.

Cuando reconstruí la sección como `labels/contracts/page.tsx` +
`contracts/[id]/`, ese link desapareció en dos lugares:

1. **La lista** (`labels/contracts/page.tsx`) — ahora cada fila es un link
   entero a la página de detalle, pero ya no hay un ícono/acción para abrir
   el PDF sin entrar al detalle.
2. **El detalle** (`ContractDetailClient.tsx`) — el PDF se lee *adentro* de
   la página (`PdfContractViewer`), pero no hay ningún botón de "Descargar" o
   "Abrir en pestaña nueva". Si alguien quiere el archivo real (para
   guardarlo, mandarlo a un contador, etc.), hoy no puede.

Es una regresión real, no una decisión de diseño — pasó porque al meter el
lector in-app asumí que "leerlo adentro" reemplazaba a "abrirlo afuera", pero
son necesidades distintas: **leer** vs. **quedarte con una copia del
archivo**.

## Idea de solución

Agregar una acción de descarga en **el detalle del contrato**, no en la
lista (ahí alcanza con entrar) — dos casos:

- **Contrato sin firmar** (`documentUrl` es la ruta estática en
  `public/contracts/...`): botón "Download original" que simplemente
  descarga ese archivo tal cual.
- **Contrato ya firmado** (`documentUrl` es el `blob:` generado al firmar):
  mismo botón, pero ahora baja el PDF *con la firma incrustada* — que es
  justo el documento que alguien va a querer guardar.

En los dos casos es el mismo botón / mismo código (`<a href={documentUrl}
download>`), porque `documentUrl` ya apunta a lo que corresponda en cada
estado — no hace falta lógica nueva para decidir cuál mostrar, solo agregar
el botón que faltó.

## Resumen de lo que cambiaría (a nivel idea, sin código todavía)

1. `ContractDetailClient.tsx`: agregar un botón "Download document" al lado
   del lector de PDF (mismo estilo que el resto de acciones).
2. `settings/account/pro/page.tsx`: el botón "Contracts" pasa a mostrarse
   como acceso directo a Labels (con conteo de pendientes), no como sección
   propia — sin tocar rutas ni datos.

Nada de esto pisa el flujo de firma que ya funciona — es completar lo que
faltó (descargar) y suavizar la navegación duplicada (Settings vs. Labels).

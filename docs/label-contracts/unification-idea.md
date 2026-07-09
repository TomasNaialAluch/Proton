# ¿Unificar "Contracts" (Settings) con "Contracts" (Labels)? — a nivel idea

Documento exploratorio, sin código. Para pensar si tiene sentido fusionar los
dos lugares donde hoy aparece la palabra "Contracts" en el dashboard, o si
conviene que sigan siendo dos puertas distintas.

## Lo que hay hoy

**A nivel de datos ya están unificados** — no hay dos tablas de contratos.
Todo lee de `lib/mock/contracts.ts` / `contractsStore`. Lo que NO está
unificado es la *navegación*: hay dos puertas de entrada con intención
distinta.

**Puerta 1 — Settings → Pro Access → "Contracts & Reports"**
(`settings/account/pro/page.tsx`). Es un botón chico al lado de "Royalties",
dentro de una pantalla de configuración de cuenta. Contexto: alguien que entró
a Settings a revisar su perfil PRO, no necesariamente a firmar nada ahora.

**Puerta 2 — Labels → Contracts** (`labels/contracts/page.tsx`). Es una de
las 3 pestañas de la sección Labels (Browse / Submissions / Contracts), con
badge de "awaiting your signature", lista agrupada por label, y el detalle
con el lector de PDF + firma. Contexto: alguien que está activamente
gestionando su relación con labels — descubrió uno, le mandó un demo, y ahora
tiene que firmar.

Dato aparte para no confundir: Pro Access también tiene una sección
**"Labels"** separada (`EmptyState: "You don't manage any labels on
Proton"`) — esa es para gente que *administra* un sello, un concepto
totalmente distinto a "labels con los que firmaste". No es parte de esta
discusión.

## La pregunta real

No es "¿duplicamos datos?" (no lo hacemos). Es: **¿un usuario que necesita
firmar un contrato debería tener que saber que existe una sección "Labels"
para encontrarlo, o Settings ya alcanza?** Y al revés: ¿tiene sentido que
Settings tenga su propio link si el 90% de las veces el usuario ya está dentro
de Labels cuando aparece un contrato nuevo?

## Opciones

### A. Dejarlo como está — dos puertas, un solo cuarto
Settings/Pro Access es la puerta "administrativa" (para cuando alguien entra
a revisar su cuenta como si fuera un manager/contador). Labels es la puerta
"activa" (para cuando estás en medio del flujo: te aceptaron, te llegó el
contrato, lo firmás ahí mismo).

- 👍 Cada una sirve a una intención distinta, sin forzar a nadie a aprender
  una sola jerarquía.
- 👎 Alguien nuevo puede no saber cuál mirar primero; se ve como "está en dos
  lados" aunque no lo esté.

### B. Todo bajo Labels — Pro Access deja de tener su propio destino
Sacar el botón "Contracts" de Pro Access (o dejarlo solo como texto que
explica "se gestionan desde Labels", sin blindar una ruta propia).

- 👍 Una sola fuente de verdad de *navegación*, no solo de datos.
- 👎 Pro Access se supone que es "todo lo profesional/legal de tu cuenta" —
  sacarle Contracts lo vacía justo de lo más importante que tiene.

### C. Todo bajo Pro Access — Labels se queda solo con Browse + Submissions
Mover la pestaña "Contracts" (y el lector de PDF/firma) a vivir dentro de Pro
Access, y que Labels sea puramente "descubrir labels y mandar demos".

- 👍 Separa conceptualmente "explorar" (Labels) de "gestionar compromisos
  legales" (Pro Access) — son intenciones distintas, cada una con su casa.
- 👎 Rompe el flujo que ya armamos a propósito: te aceptan → te llega el
  contrato → firmás sin salir de Labels. Meter un salto a Settings justo en
  el momento más importante (firmar) es fricción donde menos la queremos.

### D. Recomendada — Contracts vive en Labels, Pro Access lo refleja en vivo
Dejar el lector de PDF + firma donde está (Labels — es donde nace el flujo:
label te acepta ahí mismo). Pero en vez de que Pro Access tenga un botón
mudo, que muestre el mismo estado que ya calculamos en Labels — ej. el badge
"1 contrato esperando tu firma" que hoy se ve en `labels/contracts/page.tsx`
se replica como texto dinámico en la tarjeta de Pro Access
(`"1 contract awaiting signature"` en vez de solo el ícono de `FileText`).

- 👍 Settings sigue siendo la puerta administrativa (y ahí uno *sabe* si algo
  necesita atención sin tener que entrar), pero no hay una segunda lógica de
  firma que mantener — solo lee el mismo estado.
- 👍 No rompe el flujo de firma inmediata desde Labels.
- 👎 Requiere que Pro Access lea del mismo `contractsStore` (hoy es una
  página server component sin estado — pasaría a necesitar un client
  component chico solo para ese resumen).

## Si se aprueba la D, el cambio es chico

- `settings/account/pro/page.tsx` pasa el botón "Contracts" a un client
  component (`ContractsProCard.tsx`) que lee `useContractsStore` y muestra el
  conteo de pendientes, igual que ya hace `labels/contracts/page.tsx`.
- No se toca el modelo de datos ni el flujo de firma — es puramente un
  cambio de qué tan "viva" es la tarjeta de Settings.

## Lo que NO estoy proponiendo

- No duplicar `mockContracts` ni crear un segundo store.
- No mover el lector de PDF/firma fuera de Labels (opción C) — a menos que
  se decida explícitamente que "gestionar contratos" pesa más como concepto
  que "estar en medio de un trato con un label", que es lo contrario de cómo
  se diseñó el flujo hasta ahora.

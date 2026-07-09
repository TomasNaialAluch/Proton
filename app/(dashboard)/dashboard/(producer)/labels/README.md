# Sección "Labels" — propuesta

Documento de diseño. Todavía no hay código; esto define nombre, estructura de rutas,
modelo de datos y por qué se organiza así, antes de implementar.

## Por qué esta sección

Hoy el productor ya tiene `/dashboard/contracts`, pero es **solo lectura**: lista
contratos que llegaron por mail, y el footer de esa página lo dice literal
("Contracts are sent by email from Proton SoundSystem"). Ese es exactamente el
punto débil que hay que resolver: el artista recibe un PDF por mail y tiene que
imprimir/firmar/escanear o usar una herramienta externa. Nada de esto pasa dentro
de la plataforma, así que Proton no se percibe como el lugar "serio" donde se
cierra el trato — es solo un mensajero.

La sección nueva junta dos cosas que hoy no existen: (1) descubrimiento activo —
mandar tu música a un label directamente, no solo esperar que te encuentren
(`/discover` es al revés: vos navegás tracks de otros) — y (2) cerrar el círculo
legal sin salir de la app.

## Investigación externa (resumen)

- **Envío de demos a labels/curadores** (SubmitHub, Groover, MusoSoup): el patrón
  común es elegir el track + fecha de lanzamiento, filtrar destinatarios por
  género/label, agregar una nota personal, y después trackear el estado del envío
  (visto / en revisión / respondido). Groover en particular deja elegir el
  resultado buscado (label, playlist, prensa) — nosotros solo necesitamos "label"
  porque ya tenemos labels reales en la plataforma (`lib/mock/labels.ts`).
- **Firma electrónica embebida** (DocuSign eSignature API, guías de UX): la
  práctica estándar es una vista de firma enfocada (un documento a la vez, campos
  ya ubicados, sin distracciones), firma reutilizable (se crea una vez y se
  reusa), y sobre todo **audit trail**: quién firmó, cuándo, desde qué IP/dispositivo,
  con un hash del documento firmado — eso es lo que le da validez legal percibida,
  no el trazo en sí.
- **Contratos de sello discográfico** (Juro, Contractbook, Jotform Sign): todos
  convergen en lo mismo — un repositorio central del contrato con estado
  (borrador → enviado → firmado → activo), y visibilidad de fechas clave
  (release date, entrega de masters, ventana de exclusividad) directamente
  ligadas al contrato, no en un mail aparte.

Conclusión: lo que hace "seria" a la sección no es el dibujo de la firma, es el
historial verificable + que las fechas de lanzamiento vivan pegadas al contrato,
no sueltas.

## Nombre de la sección

**"Labels"** en el nav del producer (icono `Building2`, coherente con cómo ya se
usa en `/contracts`). Reemplaza conceptualmente a `/dashboard/contracts`, que pasa
a ser una pestaña interna en vez de una página aislada — hoy vive sola y no tiene
forma de accionar nada, solo mirar.

Adentro, 3 pestañas (mismo patrón de tabs que ya usan otras secciones del dashboard):

```
/dashboard/labels                 → "Submit"       (mandar tracks a labels)
/dashboard/labels/submissions     → "Submissions"  (estado de lo que mandaste)
/dashboard/labels/contracts       → "Contracts"    (ex /dashboard/contracts, ahora con firma)
/dashboard/labels/contracts/[id]  → detalle de un contrato + flujo de firma
```

La firma guardada del usuario no es una pestaña — es parte de Settings
(`/dashboard/settings/account/signature`), porque es un dato de la cuenta, no de
un label puntual. Se crea una vez y se reusa en cualquier contrato futuro,
igual que ya existe `/settings/account/payment` como dato reusable.

## Estructura de carpetas

```
app/(dashboard)/dashboard/(producer)/labels/
├── page.tsx                    # Submit: elegís track + label(es) de la plataforma + nota
├── submissions/page.tsx        # estado: sent / listening / accepted / passed
├── contracts/page.tsx          # lista (evolución de la actual /contracts)
└── contracts/[id]/page.tsx     # detalle: términos, fechas, PDF, botón "Sign"

components/dashboard/producer/labels/
├── SubmitTrackForm.tsx
├── SubmissionStatusBadge.tsx
├── ContractTimeline.tsx        # fechas clave del contrato (release, entrega, exclusividad)
└── SignatureCanvas.tsx         # dibujar/tipear/subir firma — reusado en settings y en el flujo de firma

app/(dashboard)/dashboard/(producer)/settings/account/signature/page.tsx
```

## Modelo de datos (mock, siguiendo el patrón existente)

```ts
// types/submission.ts
interface LabelSubmission {
  id: string;
  trackId: string;
  labelSlug: string;
  note: string;
  proposedReleaseDate: string | null;
  status: "sent" | "listening" | "accepted" | "passed";
  sentAt: string;
  respondedAt: string | null;
}

// types/signature.ts
interface SavedSignature {
  id: string;
  method: "drawn" | "typed" | "uploaded";
  imageDataUrl: string;
  createdAt: string;
}

// types/contract.ts — extender el existente
interface Contract {
  // ...campos actuales (id, release, label, labelSlug, signedAt, status, documentUrl)
  keyDates: { label: string; date: string }[];   // release, master delivery, exclusivity window
  signature: {
    signedByName: string;
    signedAt: string;
    ipAddress: string;
    documentHash: string;   // hash del PDF en el momento de la firma
  } | null;
  status: "draft" | "pending_signature" | "signed" | "expired"; // agrega draft/pending_signature
}
```

## Flujo de firma (dentro de `contracts/[id]`)

1. El label sube/genera el contrato → status `pending_signature`.
2. El artista entra al detalle, ve el PDF inline (no descarga), con las fechas
   clave destacadas arriba (no enterradas en el texto legal).
3. Si no tiene firma guardada, se le pide crearla una vez (dibujar con mouse/dedo,
   tipear con una tipografía tipo firma, o subir una imagen) — se guarda en la
   cuenta para futuros contratos.
4. Confirma → se genera el registro de auditoría (nombre, fecha, hash del
   documento) → status pasa a `signed` → aparece en `contracts/page.tsx` igual
   que hoy, pero ahora con el link "View" apuntando al PDF ya firmado.
5. Notificación al label manager (reusa el patrón de `mockPendingToReview` en
   feedback, o el sistema de notificaciones de `settings/account/notifications`).

## Qué se reusa de lo que ya existe

- `DashboardBreadcrumb`, tarjetas de resumen y tabla de `contracts/page.tsx` tal
  cual — solo se le agrega el CTA de firma y las keyDates.
- `mockLabels` (`lib/mock/labels.ts`) para el selector de labels en "Submit" — ya
  tiene slug, género, nombre.
- `usePrototypeViewStore` para que el label manager vea, del otro lado, las
  submissions entrantes y pueda generar el contrato (fuera de alcance de este
  documento, pero la simetría con `(label-manager)/roster` es directa).

## Fuera de alcance (a propósito)

- Firma con validez legal real (certificados, KYC) — esto es una firma
  electrónica simple tipo DocuSign básico, no un notariado digital.
- Pagos/advances ligados al contrato — eso ya vive en `royalties`.

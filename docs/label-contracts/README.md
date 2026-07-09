# Firma de contratos in-app — lector de PDF + firma superpuesta

Documento de diseño. Define qué hay que construir antes de tocar código.
Usa como caso real el contrato de [`Dear Deer Licensing Agreement Naial 2026.pdf`](./Dear%20Deer%20Licensing%20Agreement%20Naial%202026.pdf)
(el que me pasaste), ya cargado como el contrato `c7` en `lib/mock/contracts.ts`
(pendiente de firma) y servido en `public/contracts/dear-deer-licensing-agreement-naial-2026.pdf`.

## La idea, en una frase

Que abrir y firmar un contrato en Proton se sienta como Adobe Acrobat Reader:
lo abrís, lo leés ahí mismo, creás tu firma (dibujada, tipeada, importada, o
extraída de una foto), la arrastrás/rotás/ajustás sobre el PDF real, y al
confirmar queda estampada en el documento — no es una pantalla aparte que
"simula" firmar.

## Qué existe hoy vs. qué falta

Hoy (`ContractDetailClient.tsx`, `SignatureCanvas.tsx`):
- El botón "View contract document" abre el PDF en una pestaña nueva del
  navegador — no hay lector adentro de Proton.
- `SignatureCanvas` genera una firma (dibujo/texto/imagen subida) como PNG,
  pero esa imagen **nunca toca el PDF**. Firmar hoy es un acto simbólico:
  cambia `contract.status` a `signed` y guarda nombre/fecha/hash — el
  documento en sí sigue siendo el original, sin la firma estampada.

Falta:
1. Un lector de PDF embebido en la página del contrato (no un link externo).
2. Colocar la firma como un objeto manipulable *sobre* la página del PDF:
   arrastrar, redimensionar, rotar.
3. "Quemar" esa firma en el PDF de verdad al confirmar (el archivo resultante
   contiene la firma, no es un dato separado en la base).
4. (Extra) Extraer una firma limpia a partir de una foto de algo firmado en
   papel.

## Flujo objetivo, con el ejemplo real

1. En `/dashboard/labels/contracts` aparece **"JIK / Never Leave — Dear Deer
   Music"** con el badge *"Awaiting your signature"* (ya existe).
2. Entro al detalle (`/dashboard/labels/contracts/c7`). Veo el resumen: label,
   release, key dates (fecha de firma, deadline de release, fin del term —
   ya existe vía `ContractKeyDates`).
3. Toco **"Open document"** → el PDF se abre *adentro* de la página (no pestaña
   nueva), paginado — el contrato real tiene 5 páginas, con bloques de firma
   en la página 1 (resumen) y la página 5 (Schedule A). Puedo hacer scroll/zoom
   para leerlo entero, tal cual estoy leyendo el PDF ahora mismo.
4. Toco **"Add signature"**. Si no tengo una firma guardada, se abre el mismo
   selector que ya existe (dibujar / tipear / subir imagen), + una cuarta
   opción nueva: **"Extract from photo"** (ver más abajo).
5. La firma aparece como una imagen PNG flotando sobre la página actual del
   PDF, con handles para:
   - **mover** (drag),
   - **redimensionar** (esquinas),
   - **rotar** (handle superior).
   La arrastro hasta la línea "Authorized Signature" del bloque del ARTIST.
6. Confirmo → la firma se **incrusta en el PDF de verdad** (no es un overlay
   visual nomás) → se genera un PDF nuevo que ya la contiene.
7. El contrato pasa a `signed`, con el registro de auditoría de siempre
   (nombre, fecha, hash — ahora el hash es del PDF *ya firmado*), y el link
   "View contract document" abre esa versión firmada.

## Extracción de firma por foto ("Import with AI")

Sacás una foto de tu firma en un papel blanco (como cuando DocuSign/PayPal
piden "firmá en una hoja y sacale una foto"). La función:
1. Detecta el trazo oscuro sobre fondo claro.
2. Recorta al bounding box de la tinta.
3. Vuelve transparente todo lo que no es trazo (el papel).
4. Devuelve un PNG limpio, igual que si lo hubieras dibujado a mano en la app.

Para este prototipo alcanza con **procesamiento de imagen simple en el
cliente** (escala de grises → threshold de luminosidad → canal alfa), sin
backend ni modelo real: funciona bien para el caso típico (tinta oscura,
papel blanco, buena luz) y ya transmite la idea de "sacale una foto y listo".
Un modelo de segmentación real (para fondos con sombra, papel de color, etc.)
queda para una iteración futura si se lleva esto a producción — no es
necesario para demostrar el feature.

## Piezas técnicas

- **Render del PDF**: `pdfjs-dist` (via `react-pdf`, que ya lo envuelve) para
  dibujar cada página como `<canvas>`. Es cliente-only, no requiere backend.
- **Overlay interactivo** (drag + resize + rotate): en vez de reinventar la
  rueda con pointer events a mano, usar una librería ya probada para esto
  (ej. `react-moveable`) posicionada sobre el `<canvas>` de la página. Guardar
  la transformación (x, y, width, height, rotation) en estado de React.
- **Estampado real en el PDF**: `pdf-lib` — toma el PDF original, incrusta el
  PNG de la firma en la página y coordenadas elegidas (con la rotación
  aplicada), y devuelve un PDF nuevo como `Uint8Array`/`Blob`. Todo en el
  cliente, sin backend.
- **Persistencia (prototipo)**: como no hay backend, el PDF firmado resultante
  vive como `Blob` en memoria / `IndexedDB` para esta sesión — no se puede
  sobreescribir el archivo en `public/`. Es la misma limitación de "prototipo
  sin backend" que ya aplica al resto del proyecto (contratos y submissions
  viven en `localStorage` vía Zustand).

## Modelo de datos — qué se agrega

```ts
// types/signature.ts — agregar la colocación sobre la página
interface SignaturePlacement {
  page: number;       // 1-indexed
  x: number;           // % del ancho de página, no píxeles — así sobrevive a zoom/resize
  y: number;
  width: number;
  rotation: number;    // grados
}

// types/contract.ts — el resultado del estampado
interface ContractSignatureRecord {
  signedByName: string;
  signedAt: string;
  documentHash: string;     // hash del PDF YA firmado, no del original
  placement: SignaturePlacement;
}
```

`Contract.documentUrl` pasa a poder ser también un Blob URL generado en
cliente (además de la ruta estática en `/public/contracts/...` que ya usa el
contrato de ejemplo).

## Estructura de archivos propuesta

```
components/dashboard/producer/labels/
├── PdfContractViewer.tsx     # render de páginas (react-pdf) + scroll/zoom
├── SignatureOverlay.tsx      # la firma como objeto draggable/resizable/rotable
├── SignaturePhotoImport.tsx  # cámara/upload + recorte + threshold → PNG
└── SignatureCanvas.tsx       # ya existe — se le agrega el tab "Extract from photo"

lib/pdf/
├── embedSignature.ts         # pdf-lib: quema el PNG en el PDF, devuelve Blob
└── extractSignatureFromPhoto.ts  # canvas 2D: threshold + alpha
```

`ContractDetailClient.tsx` deja de linkear a una pestaña nueva y en su lugar
monta `PdfContractViewer` con `SignatureOverlay` cuando el contrato está
`pending_signature`.

## Fuera de alcance (por ahora)

- Firma con validez legal real (certificados, KYC, timestamping).
- Múltiples firmantes / orden de firma.
- Segmentación por IA real para la foto de firma (queda el enfoque simple de
  threshold, documentado arriba).
- Persistir el PDF firmado en un backend — en este prototipo vive en memoria
  del navegador, como el resto de los datos mock.

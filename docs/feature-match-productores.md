# Feature: Match entre productores (conexión humana a partir del feedback)

Documento de trabajo. Se apoya en datos que ya existen o están planeados en [feature-feedback-productores.md](feature-feedback-productores.md) (las barras de puntuación 0-10) y en [feature-discover-producers.md](feature-discover-producers.md) (el feed cross-label de tracks abiertos). No reemplaza a ninguno de los dos: los usa como fuente de señal.

---

## 1. La idea

La plataforma ya va a tener, gracias a Feedback y Discover, dos señales por productor:

- **Puntuaciones**: cómo puntuó y cómo fue puntuado en cada categoría (groove, percusión, melodía/hook, synth, mix, arreglo) sobre sus tracks y los de otros.
- **Género/metadata**: a qué género pertenecen los tracks que sube y que feedbackea.

Si dos productores muestran **afinidad sostenida** en esas señales — puntuaciones parecidas entre sí (no necesariamente altas, sino *consistentes*, ej. ambos fuertes en synth design y débiles en arreglo) y presencia en el mismo género — la plataforma puede inferir que harían buena dupla y **proponérselo activamente**, no esperar a que se descubran solos navegando Discover.

No es matchmaking romántico ni un ranking público de "mejores productores": es una sugerencia puntual y privada de colaboración, basada en patrones que el productor no necesariamente puede ver por sí mismo (cruzar sus propios datos contra los de miles de otros usuarios).

---

## 2. Principio rector: no incomodar

Esto es lo que más cuidado necesita en el diseño, porque es fácil que se sienta como "la app me está stalkeando" o como espam de notificaciones.

Reglas duras:

- **Doble opt-in obligatorio.** La plataforma sugiere → cada productor acepta o rechaza individualmente → el chat se abre solo si **ambos** dijeron que sí. Ninguno de los dos sabe si el otro ya respondió hasta que los dos contestaron (igual que un match, no una request directa).
- **Rechazar es gratis y silencioso.** Si A rechaza, B nunca se entera de que hubo una propuesta. No hay "fulano te rechazó".
- **Frecuencia limitada.** No es un feed continuo de sugerencias. Empezar con un tope bajo (ej. 1 sugerencia activa por vez, una nueva solo cuando la anterior se resuelve o expira) para que no compita con notificaciones de Feedback ni se perciba como ruido.
- **Explicable, no una caja negra.** La propuesta siempre muestra *por qué* se sugiere ("ambos puntuaron fuerte en synth design y se mueven en progressive house"), no solo "tenés un match". Esto baja la sensación de invasión: el productor entiende qué dato se usó.
- **Reversible.** Tiene que haber una opción tipo "no quiero recibir este tipo de sugerencias" en Settings, sin tener que desactivar Feedback ni Discover (son señales que se usan, pero el feature en sí es opt-out independiente).

---

## 3. De dónde viene la señal (relación con Feedback y Discover)

```
Discover (cross-label feed)
   → expone qué tracks están abiertos y de qué género
Feedback (barras 0-10 + comentario)
   → genera, por cada par (A da feedback a B), un vector de puntuaciones
        ↓
   Match Engine (este feature)
   → cruza vectores de puntuación + género/metadata de tracks
   → busca pares de productores con afinidad sostenida (no un solo
     dato puntual, sino un patrón a través de varios tracks/intercambios)
   → genera una "Propuesta de conexión"
        ↓
   Notificación a ambos (mismo mecanismo que NotificationsPanel)
   → si ambos aceptan → se abre un chat 1:1
```

Puntos clave de esta cadena:

- El match **no se calcula sobre un solo feedback puntual**, sino sobre una ventana de varios intercambios — un único dato (una sola canción puntuada de forma parecida) es ruido, no señal. Definir un mínimo de tracks/intercambios antes de considerar un par "matcheable" (a definir, ver sección 6).
- Es **agnóstico de quién feedbackeó a quién**: A y B no necesitan haberse feedbackeado mutuamente para matchear. Puede surgir de que ambos feedbackearon (por separado) tracks similares de terceros, o de que sus propios tracks recibieron patrones de puntuación parecidos.
- Funciona **cross-label**, igual que Discover — el límite no es organizacional, es de señal/datos.

---

## 4. Dónde vive en la UI

- **No es una sección nueva en el sidebar.** A diferencia de Discover y Feedback, esto no es algo que el productor "entra a buscar" — es algo que le llega. Vive como **notificación** dentro del mismo `NotificationsPanel.tsx` que ya existe, con un nuevo tipo: `connection_suggested`.
- Click en la notificación → abre un **modal o vista dedicada** (`/dashboard/connections/[id]` o un modal sobre la pantalla actual) con:
  - Por qué se sugiere (explicación corta, ver sección 2).
  - Datos mínimos del otro productor (nombre, géneros, label — no su catálogo completo, mismo criterio de privacidad que Discover).
  - Dos botones: **Conectar** / **No, gracias**.
- Si acepta, queda en un estado "pendiente de que el otro responda" (sin indicarle cuánto falta ni quién es el cuello de botella).
- Cuando ambos aceptan, se abre el **chat** — sección nueva, mínima: `/dashboard/messages` o similar, simple lista de conversaciones 1:1. (Si ya existe o está planeada una mensajería en el dashboard, este feature debería reusarla en vez de crear una paralela — a confirmar contra el resto del producto.)
- Si uno rechaza, la propuesta desaparece silenciosamente para ambos (ver sección 2).

---

## 5. Modelo de datos (borrador)

Continuando el patrón de [feature-feedback-productores.md](feature-feedback-productores.md) sección 8:

- `connectionSuggestions`: id, producerAId, producerBId, reason (texto o estructura tipo `{ sharedGenres: [...], scoreAffinity: {...} }`), status (`pending` | `accepted_by_a` | `accepted_by_b` | `matched` | `rejected` | `expired`), createdAt.
- `notifications`: se reusa la entidad existente, nuevo `type: 'connection_suggested'`, `refId` apuntando a `connectionSuggestions`.
- `conversations` / `messages`: si no existen ya en el dashboard, entidad nueva minimalista: `conversations` (id, participantIds, createdAt) + `messages` (id, conversationId, fromUserId, text, createdAt).
- El **Match Engine** no necesita persistir nada nuevo de Feedback/Discover — lee `feedbacks` (scores) y `tracks` (género, `openForFeedback`) que ya están definidos en esos features, y corre como proceso aparte (batch/cron, no en tiempo real) que escribe a `connectionSuggestions` cuando encuentra un par.

---

## 6. Preguntas abiertas

- **Umbral de "afinidad sostenida"**: ¿cuántos tracks/intercambios mínimos antes de sugerir un match? ¿Afinidad significa puntuaciones *parecidas* (mismo perfil de fortalezas/debilidades) o *complementarias* (uno fuerte donde el otro es débil, ej. uno bueno en synth design y el otro en arreglo)? Probablemente vale la pena soportar ambos tipos de match con etiquetas distintas ("se parecen" vs "se complementan").
- **Cómo se calcula el matching en la práctica**: ¿similaridad de vectores de puntuación (coseno, distancia euclídea) + overlap de género como filtro previo? Definir esto es trabajo de producto/datos, no solo de UI — este doc no resuelve el algoritmo, solo el contrato de datos y la experiencia.
- **Frecuencia y expiración**: ¿cada cuánto corre el Match Engine? ¿Las propuestas pendientes expiran si nadie responde (ej. 2 semanas)?
- **Volumen mínimo de la plataforma**: con pocos usuarios/tracks, el matching va a ser pobre o repetitivo — ¿tiene sentido activar este feature solo a partir de cierta masa de datos (cantidad de feedbacks intercambiados en la plataforma)?
- **Mensajería**: ¿ya existe o está planeado un chat en el dashboard para otro propósito (label manager ↔ productor, por ejemplo)? Si es así, conviene unificar en vez de crear un sistema de mensajes paralelo solo para este feature.
- **Métricas de éxito**: ¿cómo se mide si esto "funciona" sin ser invasivo? (ej. tasa de aceptación mutua, tasa de "no quiero recibir esto" activado, mensajes enviados post-match) — para saber si ajustar umbral/frecuencia.

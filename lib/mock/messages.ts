import type { Conversation, ChatMessage } from "@/types/message";

/** Seeded as a match that already completed before this session (Darko). */
export const mockConversations: Conversation[] = [
  {
    id: "convo-1",
    peer: { type: "producer", id: "darko", name: "Darko" },
    origin: { type: "connection", connectionId: "conn-darko-past" },
    createdAt: "2026-06-21T10:00:00Z",
  },
  {
    // Opened once Dear Deer Music accepted submission s4 (JIK / Never Leave) —
    // ends with the c7 contract handed over in the label's own message.
    id: "convo-jik-deardeer",
    peer: { type: "label", id: "19", name: "Dear Deer Music", slug: "dear-deer-music" },
    origin: { type: "submission", submissionId: "s4" },
    createdAt: "2026-02-20T15:00:00Z",
  },
  {
    // Direct outreach — no submission involved. Seeded as already sent by the
    // label, waiting on a reply, exactly the "label contacts first" case.
    id: "convo-hope-outreach",
    peer: { type: "label", id: "7", name: "Hope Recordings", slug: "hope-recordings" },
    origin: { type: "label_outreach" },
    createdAt: "2026-07-08T13:20:00Z",
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: "convo-1",
    fromMe: false,
    text: "Hey! We just matched — been liking the percussion work on your tracks.",
    createdAt: "2026-06-21T10:01:00Z",
  },
  {
    id: "msg-2",
    conversationId: "convo-1",
    fromMe: true,
    text: "Thanks! I've been wanting to collab with someone stronger on arrangement than me, honestly.",
    createdAt: "2026-06-21T10:05:00Z",
  },

  // ── JIK / Never Leave ↔ Dear Deer Music ──
  {
    id: "msg-jik-1",
    conversationId: "convo-jik-deardeer",
    fromMe: false,
    text: "¡Nos encantó JIK / Never Leave! Venimos escuchando tu material hace un tiempo y esto encaja perfecto con lo que estamos armando para el catálogo. Queremos avanzar con un licensing deal.",
    createdAt: "2026-02-20T15:00:00Z",
  },
  {
    id: "msg-jik-2",
    conversationId: "convo-jik-deardeer",
    fromMe: true,
    text: "¡Qué buena noticia! Contame, ¿cómo lo pensás en términos de fecha? Tengo un par de shows en marzo y me gustaría que el lanzamiento no choque con eso.",
    createdAt: "2026-02-21T09:40:00Z",
  },
  {
    id: "msg-jik-3",
    conversationId: "convo-jik-deardeer",
    fromMe: false,
    text: "Tiene sentido. Podemos firmar el acuerdo ahora y dejar el release para dentro de un año — así tenés margen. Fecha límite de lanzamiento: marzo 2027. El contrato queda activo por 10 años desde la firma.",
    createdAt: "2026-02-24T11:15:00Z",
  },
  {
    id: "msg-jik-4",
    conversationId: "convo-jik-deardeer",
    fromMe: true,
    text: "Me sirve perfecto. Dale para adelante.",
    createdAt: "2026-02-25T18:02:00Z",
  },
  {
    id: "msg-jik-5",
    conversationId: "convo-jik-deardeer",
    fromMe: false,
    text: "Genial. Acá te mando el contrato — cualquier duda mientras lo leés, avisame sin problema.",
    createdAt: "2026-03-05T10:00:00Z",
    attachment: { type: "contract", contractId: "c7", contractLabel: "JIK / Never Leave — Dear Deer Music" },
  },

  // ── Hope Recordings — outreach directo, sin submission de por medio ──
  {
    id: "msg-hope-1",
    conversationId: "convo-hope-outreach",
    fromMe: false,
    text: "Hola! Te escribo directamente porque venimos siguiendo lo que estás lanzando y nos gustaría charlar sobre un EP para el label — sin apuro, cuando tengas un rato leelo y me contás qué te parece.",
    createdAt: "2026-07-08T13:20:00Z",
  },
];

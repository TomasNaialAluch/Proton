# Qué pasó con la sección de Contracts vieja

Nota para dejar registro de la reconciliación entre lo que ya existía y la
sección nueva de Labels. Sin esto, alguien que mire el repo puede pensar que
hay dos sistemas de contratos superpuestos — no los hay, pero vale la pena
documentar por qué.

## Lo que había antes del rediseño

El commit `9a70295` ("feat(dashboard): contracts, royalties detail,
notifications, collapsible sidebar") creó, antes de que existiera la sección
Labels:

- `app/(dashboard)/dashboard/contracts/page.tsx` — página plana de contratos:
  3 tarjetas resumen (Total / Signed / Labels), banner de pendientes, lista
  con layout distinto en mobile/desktop.
- `lib/mock/contracts.ts` — 4 contratos mock con `CONTRACT_LABEL_COLORS`.
- `types/contract.ts` — el tipo `Contract` original (`signed | pending |
  expired`, sin `keyDates` ni `signature`).

Esto está documentado (como changelog, ya desactualizado) en `READMEMAIN.md`,
sección **"1. Contracts Page — `/dashboard/contracts`"**.

## Qué hizo la sección Labels con eso

**No lo duplicó — lo extendió.** `lib/mock/contracts.ts` y `types/contract.ts`
son *los mismos archivos*, no una copia paralela:

- `Contract` ganó `keyDates`, `signature` (con `placement`), y el status
  `pending_signature` reemplazó a `pending`.
- `mockContracts` pasó a tener el contrato real de Dear Deer Music (`c7`) con
  el PDF servido en `public/contracts/`.
- La página plana original (`.../contracts/page.tsx`) se **borró** — está
  como `D` (deleted, sin commitear) en `git status` ahora mismo — y se
  reemplazó por `app/(dashboard)/dashboard/(producer)/labels/contracts/page.tsx`
  + `.../contracts/[id]/page.tsx`, que agrupan por label y tienen el lector de
  PDF con firma in-app.

Falta commitear ese borrado — hoy conviven el archivo nuevo y el `D` del viejo
sin confirmar en git.

## Puntos de entrada — ya están enganchados, no hace falta tocar nada

- `settings/account/pro/page.tsx` (sección "Contracts & Reports") ya linkea a
  `/dashboard/labels/contracts` — el comentario en el código dice
  *"unified in the redesign"*, así que esto ya se había anticipado.
- El nav (`AppSidebar`, `BottomNav`, `HamburgerMenu`) tenía un ítem "Contracts"
  → `/dashboard/contracts`; ahora es **"Label Deals"** → `/dashboard/labels`.

## Referencias sueltas — cosméticas, no rompen nada

Estas tres NO leen de `mockContracts` ni de `contractsStore` — son texto
estático que menciona "contracts" en otro contexto. No hace falta tocarlas,
pero quedan anotadas por si en algún momento se quiere conectarlas de verdad:

- `components/dashboard/NotificationsPanel.tsx` — ítem mock *"Pending
  contract — The contract with Stellar Records requires your signature."*
  No linkea a ningún id real; sería natural apuntarlo a
  `/dashboard/labels/contracts/c7` si se quiere que la notificación funcione.
- `components/dashboard/widgets/meta.ts` — descripción de un widget dice
  *"Art, metadata, contracts (mock)"*, es solo copy.
- `components/dashboard/DashboardPersonaChip.tsx` — frase descriptiva del
  dashboard, menciona "contracts" de pasada.

## Pendiente

- [ ] Commitear el borrado de `app/(dashboard)/dashboard/(producer)/contracts/page.tsx`.
- [ ] Actualizar (u opcionalmente borrar) la sección de contratos en
      `READMEMAIN.md` — describe la página vieja que ya no existe.
- [ ] Opcional: enganchar el ítem "Pending contract" de `NotificationsPanel`
      al contrato real (`c7`).

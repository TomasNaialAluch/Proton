"use client";

import { notFound, usePathname } from "next/navigation";
import ContractSignClient from "./ContractSignClient";
import ContractRecordClient from "./ContractRecordClient";
import { useContractsStore } from "@/lib/store/contractsStore";

function contractIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/contracts\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

/**
 * Sin prop `params`: el id sale del `pathname` en el cliente (mismo patrón que royalties/[id]).
 * Elige la pantalla según `contract.kind` — "signable" (el flujo de firma que armamos) o
 * "record" (contrato real ya cerrado en Proton, solo lectura).
 */
export default function ContractDetailPage() {
  const pathname = usePathname();
  const id = contractIdFromPath(pathname);
  const contract = useContractsStore((s) => s.contracts.find((c) => c.id === id));

  if (!id) notFound();
  if (!contract) notFound();

  return contract.kind === "record" ? <ContractRecordClient /> : <ContractSignClient />;
}

import type { SignaturePlacement } from "@/types/signature";

export interface ContractKeyDate {
  label: string;
  date: string;
}

export interface ContractSignatureRecord {
  signedByName: string;
  signedAt: string;
  /** Hash of the signed document at signing time — proof the file wasn't altered after. */
  documentHash: string;
  placement: SignaturePlacement;
}

export interface Contract {
  id: string;
  release: string;
  label: string;
  labelSlug: string;
  /** Set when the contract is drafted/sent; equals signature.signedAt once signed. */
  signedAt: string;
  status: "signed" | "pending_signature" | "expired";
  documentUrl: string | null;
  keyDates: ContractKeyDate[];
  signature: ContractSignatureRecord | null;
  /**
   * Which contract detail screen this uses — see docs/label-contracts/contracts-rebuild-plan.md
   * ("Corrección — sí van dos componentes de detalle, no uno"):
   * - "signable": ours, in-app PDF + signature flow (ContractSignClient).
   * - "record": a real contract already closed on Proton — links to the real
   *   soundsystem.protonradio.com contract page instead (ContractRecordClient).
   */
  kind: "signable" | "record";
  /** Only set when kind === "record" — the real `proton_contract_v7.php?cid=...&p=...` URL. */
  realContractUrl?: string;
}

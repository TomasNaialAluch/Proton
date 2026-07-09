import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockContracts } from "@/lib/mock/contracts";
import { hashBytes } from "@/lib/pdf/hashBytes";
import type { Contract } from "@/types/contract";
import type { SignaturePlacement } from "@/types/signature";

/** Short non-cryptographic fingerprint of a string seed — used when there's no real PDF to hash. */
function fingerprint(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8);
}

interface SignContractInput {
  signedByName: string;
  placement: SignaturePlacement;
  /** The actual signed PDF bytes, when the contract has a real document to embed the signature into. */
  signedDocumentBytes?: Uint8Array;
}

interface ContractsState {
  contracts: Contract[];
  signContract: (id: string, input: SignContractInput) => void;
}

export const useContractsStore = create<ContractsState>()(
  persist(
    (set) => ({
      contracts: mockContracts,
      signContract: (id, { signedByName, placement, signedDocumentBytes }) =>
        set((state) => ({
          contracts: state.contracts.map((contract) => {
            if (contract.id !== id) return contract;
            const signedAt = new Date().toISOString().slice(0, 10);
            const documentHash = signedDocumentBytes
              ? hashBytes(signedDocumentBytes)
              : fingerprint(`${contract.id}:${signedByName}:${signedAt}`);
            const documentUrl = signedDocumentBytes
              ? URL.createObjectURL(new Blob([signedDocumentBytes as BlobPart], { type: "application/pdf" }))
              : contract.documentUrl;
            return {
              ...contract,
              status: "signed",
              signedAt,
              documentUrl,
              signature: { signedByName, signedAt, documentHash, placement },
            };
          }),
        })),
    }),
    { name: "proton-contracts" }
  )
);

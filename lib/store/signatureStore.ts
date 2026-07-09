import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedSignature } from "@/types/signature";

interface SignatureState {
  signature: SavedSignature | null;
  setSignature: (signature: SavedSignature) => void;
  clearSignature: () => void;
}

/** One signature per account, reused across every contract — created once in Settings. */
export const useSignatureStore = create<SignatureState>()(
  persist(
    (set) => ({
      signature: null,
      setSignature: (signature) => set({ signature }),
      clearSignature: () => set({ signature: null }),
    }),
    { name: "proton-signature" }
  )
);

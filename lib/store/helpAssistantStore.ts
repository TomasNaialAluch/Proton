import { create } from "zustand";

interface HelpAssistantState {
  open: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
}

export const useHelpAssistantStore = create<HelpAssistantState>((set) => ({
  open: false,
  openAssistant: () => set({ open: true }),
  closeAssistant: () => set({ open: false }),
}));

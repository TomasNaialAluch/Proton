import { create } from "zustand";

/**
 * Shared open/close state for the mobile hamburger menu, so both the
 * top navbar's menu button and the bottom nav's "More" tab can open the
 * same drawer instead of each owning their own copy of the state.
 */
interface MobileMenuState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

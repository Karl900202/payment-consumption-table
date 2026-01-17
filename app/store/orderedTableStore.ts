import { create } from "zustand";

interface OrderedTableStore {
  isSearchRowVisible: boolean;
  toggleSearchRow: () => void;
  setSearchRowVisible: (visible: boolean) => void;
}

export const useOrderedTableStore = create<OrderedTableStore>((set) => ({
  isSearchRowVisible: false,
  toggleSearchRow: () =>
    set((state) => ({ isSearchRowVisible: !state.isSearchRowVisible })),
  setSearchRowVisible: (visible: boolean) =>
    set({ isSearchRowVisible: visible }),
}));

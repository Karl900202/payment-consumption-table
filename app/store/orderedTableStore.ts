import { create } from "zustand";

interface Filters {
  styleNumber?: string;
  fabricName?: string;
  colorName?: string;
}

interface OrderedTableStore {
  isSearchRowVisible: boolean;
  toggleSearchRow: () => void;
  setSearchRowVisible: (visible: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
  clearFilters: () => void;
}

export const useOrderedTableStore = create<OrderedTableStore>((set) => ({
  isSearchRowVisible: false,
  toggleSearchRow: () =>
    set((state) => ({ isSearchRowVisible: !state.isSearchRowVisible })),
  setSearchRowVisible: (visible: boolean) =>
    set({ isSearchRowVisible: visible }),
  filters: {},
  setFilters: (filters) =>
    set((state) => ({
      filters: typeof filters === "function" ? filters(state.filters) : filters,
    })),
  clearFilters: () => set({ filters: {} }),
}));

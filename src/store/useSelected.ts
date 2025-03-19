import { create } from "zustand";

interface SelectedModel {
  active: string; // Changed from optional to required, with explicit boolean type
  tableId: string;
}

interface SelectedModelStore extends SelectedModel {
  setActive: (isActive: string) => void; // Improved type safety
  setActiveTable: (tableId: string) => void; // Improved type safety
  clear: () => void; // Implementing the missing clear method
}

export const useActiveStore = create<SelectedModelStore>((set) => ({
  // Initial state
  active: "start", // Default value should be boolean, not 1
  tableId: "",
  // Actions
  setActive: (isActive: string) => set({ active: isActive }), // Fixed implementation
  setActiveTable: (tableId: string) => set({ tableId: tableId }), // Fixed implementation
  // Clear method to reset state
  clear: () => set({ active: "start", tableId: "" }),
}));

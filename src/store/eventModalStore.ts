import { create } from "zustand";

export type EventModalMode = "create" | "edit";

interface EventModalState {
  isOpen: boolean;
  mode: EventModalMode;
  taskId: string | null;
  openCreate: () => void;
  openEdit: (taskId: string) => void;
  close: () => void;
}

export const useEventModalStore = create<EventModalState>((set) => ({
  isOpen: false,
  mode: "create",
  taskId: null,

  openCreate: () => set({ isOpen: true, mode: "create", taskId: null }),

  openEdit: (taskId: string) => set({ isOpen: true, mode: "edit", taskId }),

  close: () => set({ isOpen: false, mode: "create", taskId: null }),
}));

import { create } from 'zustand';

interface DrawerStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useDrawer = create<DrawerStore>((set) => ({
  open: true,
  setOpen: (open) => set((state) => ({ ...state, open })),
}));

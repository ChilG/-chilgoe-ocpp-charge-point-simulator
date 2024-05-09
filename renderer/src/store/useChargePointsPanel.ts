import { create } from 'zustand';

interface ChargePointsPanelStore {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const useChargePointsPanel = create<ChargePointsPanelStore>((set) => ({
  expanded: true,
  setExpanded: (expanded) => set((state) => ({ ...state, expanded })),
}));

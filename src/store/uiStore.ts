import { create } from 'zustand';

export type OutputTab = 'preview' | 'code' | 'json';

interface UIStore {
  activeTab: OutputTab;
  setActiveTab: (tab: OutputTab) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  activeTab: 'preview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

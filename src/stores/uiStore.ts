import { create } from 'zustand';

interface UIStore {
  dashboardOpen: boolean;
  widgetVisible: boolean;
  setDashboardOpen: (open: boolean) => void;
  setWidgetVisible: (visible: boolean) => void;
  toggleDashboard: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  dashboardOpen: false,
  widgetVisible: true,

  setDashboardOpen: (open) => set({ dashboardOpen: open }),
  setWidgetVisible: (visible) => set({ widgetVisible: visible }),
  toggleDashboard: () => set((s) => ({ dashboardOpen: !s.dashboardOpen })),
}));

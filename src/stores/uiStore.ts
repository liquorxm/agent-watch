import { create } from 'zustand';

interface UIStore {
  dashboardOpen: boolean;
  settingsOpen: boolean;
  widgetVisible: boolean;
  setDashboardOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setWidgetVisible: (visible: boolean) => void;
  toggleDashboard: () => void;
  toggleSettings: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  dashboardOpen: false,
  settingsOpen: false,
  widgetVisible: true,

  setDashboardOpen: (open) => set({ dashboardOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setWidgetVisible: (visible) => set({ widgetVisible: visible }),
  toggleDashboard: () => set((s) => ({ dashboardOpen: !s.dashboardOpen })),
  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
}));

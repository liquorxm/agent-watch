import { create } from 'zustand';
import { AppConfig, DEFAULT_CONFIG, WidgetMode, ThemeMode, CompanionAnimal } from '../types/config';

if (import.meta.hot) {
  import.meta.hot.accept();
}

interface ConfigStore {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  setWidgetMode: (mode: WidgetMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setCompanionAnimal: (animal: CompanionAnimal) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: DEFAULT_CONFIG,

  setConfig: (config) => set({ config }),

  setWidgetMode: (mode) =>
    set((state) => ({
      config: { ...state.config, widgetMode: mode },
    })),

  setTheme: (theme) =>
    set((state) => ({
      config: { ...state.config, theme },
    })),

  setCompanionAnimal: (animal) =>
    set((state) => ({
      config: { ...state.config, companionAnimal: animal },
    })),
}));

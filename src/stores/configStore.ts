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

// ---- Persistence helpers ----

let saveTimer: ReturnType<typeof setTimeout> | null = null;

async function persistConfig(config: AppConfig): Promise<void> {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('save_config', { config: JSON.stringify(config, null, 2) });
  } catch {
    // Not in Tauri environment or write failed -- silently ignore
  }
}

export async function loadInitialConfig(): Promise<void> {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const raw = await invoke<string>('load_config');
    const saved = JSON.parse(raw);
    const merged: AppConfig = { ...DEFAULT_CONFIG, ...saved, configVersion: DEFAULT_CONFIG.configVersion, agents: DEFAULT_CONFIG.agents };
    useConfigStore.getState().setConfig(merged);
  } catch {
    // No saved config or error -- use defaults already in store
  }
}

// Auto-save on any config change (debounced 500ms)
useConfigStore.subscribe((state, prevState) => {
  if (state.config === prevState.config) return;
  if (saveTimer !== null) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistConfig(state.config);
  }, 500);
});

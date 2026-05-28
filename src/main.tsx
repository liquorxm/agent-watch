import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useAgentStore } from './stores/agentStore'
import { useConfigStore, loadInitialConfig } from './stores/configStore'
import { useUIStore } from './stores/uiStore'

declare global {
  interface Window {
    __agentWatch?: {
      getAgentStore: () => ReturnType<typeof useAgentStore.getState>;
      getConfigStore: () => ReturnType<typeof useConfigStore.getState>;
      getUIStore: () => ReturnType<typeof useUIStore.getState>;
    };
  }
}

if (typeof window !== 'undefined') {
  window.__agentWatch = {
    getAgentStore: () => useAgentStore.getState(),
    getConfigStore: () => useConfigStore.getState(),
    getUIStore: () => useUIStore.getState(),
  };
}

async function bootstrap() {
  await loadInitialConfig();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();

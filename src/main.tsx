import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useAgentStore } from './stores/agentStore'
import { useConfigStore } from './stores/configStore'
import { useUIStore } from './stores/uiStore'

if (typeof window !== 'undefined') {
  (window as any).__agentWatch = {
    getAgentStore: () => useAgentStore.getState(),
    getConfigStore: () => useConfigStore.getState(),
    getUIStore: () => useUIStore.getState(),
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

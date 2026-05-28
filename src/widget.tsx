import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingWidget } from './components/floating/FloatingWidget';
import { useAgentStore } from './stores/agentStore';
import { useConfigStore } from './stores/configStore';
import { AgentState } from './types/agent';
import type { AgentInstance, AgentSummary } from './types/agent';

function WidgetApp() {
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function setupListener() {
      try {
        const { listen } = await import('@tauri-apps/api/event');

        unlisten = await listen<{ instances: Record<string, AgentInstance>; summaries: AgentSummary[] }>(
          'agent-state-sync',
          (event) => {
            useAgentStore.setState({ instances: event.payload.instances });
            useAgentStore.setState({ summaries: event.payload.summaries });
          },
        );

        await listen<{ config: ReturnType<typeof useConfigStore.getState>['config'] }>(
          'config-sync',
          (event) => {
            useConfigStore.setState({ config: event.payload.config });
          },
        );
      } catch {
        // Not in Tauri environment, use local store directly
      }
    }

    setupListener();
    return () => { unlisten?.(); };
  }, []);

  return <FloatingWidget />;
}

createRoot(document.getElementById('root')!).render(<WidgetApp />);

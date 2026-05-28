/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { listen } from '@tauri-apps/api/event';
import './index.css';
import { FloatingWidget } from './components/floating/FloatingWidget';
import { useAgentStore } from './stores/agentStore';
import { useConfigStore } from './stores/configStore';
import type { AgentInstance, AgentSummary } from './types/agent';

function WidgetApp() {
  useEffect(() => {
    let unlisten1: (() => void) | undefined;
    let unlisten2: (() => void) | undefined;

    async function setupListener() {
      unlisten1 = await listen<{ instances: Record<string, AgentInstance>; summaries: AgentSummary[] }>(
        'agent-state-sync',
        (event) => {
          useAgentStore.setState({ instances: event.payload.instances });
          useAgentStore.setState({ summaries: event.payload.summaries });
        },
      );

      unlisten2 = await listen<{ config: ReturnType<typeof useConfigStore.getState>['config'] }>(
        'config-sync',
        (event) => {
          useConfigStore.setState({ config: event.payload.config });
        },
      );
    }

    setupListener().catch(() => {});
    return () => { unlisten1?.(); unlisten2?.(); };
  }, []);

  return <FloatingWidget />;
}

createRoot(document.getElementById('root')!).render(<WidgetApp />);

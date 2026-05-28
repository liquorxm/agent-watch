/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { emit, listen } from '@tauri-apps/api/event';
import './index.css';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/dashboard/Settings';
import { useAgentStore } from './stores/agentStore';
import { useConfigStore } from './stores/configStore';
import { useUIStore } from './stores/uiStore';
import type { AgentInstance, AgentSummary } from './types/agent';

function DashboardApp() {
  useEffect(() => {
    let unlisten1: (() => void) | undefined;
    let unlisten2: (() => void) | undefined;

    async function setupListener() {
      unlisten1 = await listen<{ instances: Record<string, AgentInstance>; summaries: AgentSummary[] }>(
        'agent-state-sync',
        (event) => {
          console.log('[Dashboard] Received agent-state-sync, instances:', Object.keys(event.payload.instances).length);
          useAgentStore.setState({ instances: event.payload.instances, summaries: event.payload.summaries });
        },
      );

      unlisten2 = await listen<{ config: ReturnType<typeof useConfigStore.getState>['config'] }>(
        'config-sync',
        (event) => {
          useConfigStore.setState({ config: event.payload.config });
          console.log('[Dashboard] Received config-sync');
        },
      );

      console.log('[Dashboard] Listeners ready, requesting sync...');
      emit('request-sync').catch((err: unknown) => {
        console.error('[Dashboard] Failed to emit request-sync:', err);
      });
    }

    setupListener().catch((err: unknown) => {
      console.error('[Dashboard] Failed to setup listeners:', err);
    });
    return () => { unlisten1?.(); unlisten2?.(); };
  }, []);

  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const config = useConfigStore((s) => s.config);
  const isDark = config.theme === 'oled';

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={
        isDark
          ? { background: '#0d1117', color: '#F0F2F5', minHeight: '100vh' }
          : { background: '#f5f5f7', color: '#1a1a2e', minHeight: '100vh' }
      }
    >
      <Dashboard />

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div
            className="rounded-2xl shadow-2xl w-[700px] max-h-[80vh] overflow-auto p-6"
            style={
              isDark
                ? { background: '#0f1014', border: '1px solid rgba(255,255,255,0.1)' }
                : { background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }
            }
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold">Settings</h2>
              <button
                onClick={() => useUIStore.getState().setSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <Settings />
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<DashboardApp />);

/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from 'react';
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
  const syncing = useRef(false);

  useEffect(() => {
    let unlisten1: (() => void) | undefined;
    let unlisten2: (() => void) | undefined;
    let unlisten3: (() => void) | undefined;

    async function setupListener() {
      unlisten1 = await listen<{ instances: Record<string, AgentInstance>; summaries: AgentSummary[] }>(
        'agent-state-sync',
        (event) => {
          useAgentStore.setState({ instances: event.payload.instances, summaries: event.payload.summaries });
        },
      );

      unlisten2 = await listen<{ config: ReturnType<typeof useConfigStore.getState>['config'] }>(
        'config-sync',
        (event) => {
          syncing.current = true;
          useConfigStore.setState({ config: event.payload.config });
          syncing.current = false;
        },
      );

      unlisten3 = await listen('tray-open-settings', () => {
        useUIStore.getState().setSettingsOpen(true);
      });

      emit('request-sync').catch(() => {});
    }

    setupListener().catch(() => {});
    return () => { unlisten1?.(); unlisten2?.(); unlisten3?.(); };
  }, []);

  // Emit config changes to main window for persistence and widget sync
  useEffect(() => {
    const unsub = useConfigStore.subscribe((state, prevState) => {
      if (syncing.current) return;
      if (state.config !== prevState.config) {
        emit('config-updated', state.config).catch(() => {});
      }
    });
    return unsub;
  }, []);

  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const config = useConfigStore((s) => s.config);
  const isDark = config.theme === 'oled';

  return (
    <div
      className={isDark ? 'dark' : ''}
      style={{ background: 'var(--aw-bg-surface)', color: 'var(--aw-text-primary)', minHeight: '100vh' }}
    >
      <Dashboard />

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => useUIStore.getState().setSettingsOpen(false)}
        >
          <div
            className="rounded-2xl shadow-2xl w-[700px] max-h-[80vh] overflow-auto p-6"
            style={{ background: 'var(--aw-bg-surface)', border: '1px solid var(--aw-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-[var(--aw-text-primary)]">Settings</h2>
              <button
                onClick={() => useUIStore.getState().setSettingsOpen(false)}
                className="text-[var(--aw-text-muted)] hover:text-[var(--aw-text-primary)] text-xl leading-none"
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

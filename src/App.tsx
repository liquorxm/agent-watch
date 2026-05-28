import { Component, type ReactNode } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useAgentWatch } from './hooks/useAgentWatch';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/dashboard/Settings';
import { useUIStore } from './stores/uiStore';
import { useConfigStore } from './stores/configStore';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-red-500 text-lg font-bold mb-2">Error</h1>
          <pre className="text-sm text-gray-400 font-mono">{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function TitleBar({ isDark }: { isDark: boolean }) {
  const handleClose = () => {
    getCurrentWindow().close().catch(() => {});
  };

  const handleMinimize = () => {
    getCurrentWindow().minimize().catch(() => {});
  };

  return (
    <div
      className="flex items-center justify-between px-4 h-9 select-none"
      style={{
        WebkitAppRegion: 'drag',
        background: isDark ? '#0a0a0c' : '#e8e8ec',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
      } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.3)' }} />
        <span className="text-xs font-semibold font-mono tracking-wide" style={{ color: isDark ? '#8A8F98' : '#6B7280' }}>
          agent-watch
        </span>
      </div>
      <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={handleMinimize}
          className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-white/10 transition-colors"
          style={{ color: isDark ? '#8A8F98' : '#6B7280' }}
          title="Minimize"
        >
          −
        </button>
        <button
          onClick={handleClose}
          className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-red-500/20 hover:text-red-400 transition-colors"
          style={{ color: isDark ? '#8A8F98' : '#6B7280' }}
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  useAgentWatch();

  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const config = useConfigStore((s) => s.config);
  const isDark = config.theme === 'oled';

  return (
    <div className={isDark ? 'dark' : ''} style={isDark ? { background: '#0d1117', color: '#F0F2F5', minHeight: '100vh', borderRadius: '10px', overflow: 'hidden' } : { background: '#f5f5f7', color: '#1a1a2e', minHeight: '100vh', borderRadius: '10px', overflow: 'hidden' }}>
      <TitleBar isDark={isDark} />
      <Dashboard />

      {settingsOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl shadow-2xl w-[700px] max-h-[80vh] overflow-auto p-6" style={isDark ? { background: '#0f1014', border: '1px solid rgba(255,255,255,0.1)' } : { background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
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

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;

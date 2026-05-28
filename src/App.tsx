import { Component, type ReactNode } from 'react';
import { useAgentWatch } from './hooks/useAgentWatch';
import { FloatingWidget } from './components/floating/FloatingWidget';
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

function AppContent() {
  useAgentWatch();

  const dashboardOpen = useUIStore((s) => s.dashboardOpen);
  const config = useConfigStore((s) => s.config);

  const isDark = config.theme === 'oled';

  return (
    <div className={isDark ? 'dark' : ''} style={isDark ? { background: '#0d1117', color: '#F0F2F5', minHeight: '100vh' } : { background: '#f5f5f7', color: '#1a1a2e', minHeight: '100vh' }}>
      <FloatingWidget />
      <Dashboard />

      {dashboardOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl shadow-2xl w-[700px] max-h-[80vh] overflow-auto p-6" style={isDark ? { background: '#0f1014', border: '1px solid rgba(255,255,255,0.1)' } : { background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold">Settings</h2>
              <button
                onClick={() => useUIStore.getState().setDashboardOpen(false)}
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

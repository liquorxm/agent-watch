import { useAgentWatch } from './hooks/useAgentWatch';
import { FloatingWidget } from './components/floating/FloatingWidget';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/dashboard/Settings';
import { useUIStore } from './stores/uiStore';
import { useConfigStore } from './stores/configStore';

function App() {
  useAgentWatch();

  const dashboardOpen = useUIStore((s) => s.dashboardOpen);
  const theme = useConfigStore((s) => s.config.theme);

  return (
    <div className={theme === 'light' ? 'light' : 'dark'}>
      <div className="min-h-screen bg-[#0d1117] text-[#F0F2F5] light:bg-[#f5f5f7] light:text-[#1a1a2e]">
        <FloatingWidget />
        <Dashboard />

        {dashboardOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
            <div className="bg-[#0f1014] border border-white/10 rounded-2xl shadow-2xl w-[700px] max-h-[80vh] overflow-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold font-display">Settings</h2>
                <button
                  onClick={() => useUIStore.getState().setDashboardOpen(false)}
                  className="text-gray-400 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <Settings />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

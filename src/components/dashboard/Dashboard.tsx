import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAgentStore } from '../../stores/agentStore';
import { AgentState } from '../../types/agent';

const STATE_LABELS: Record<string, string> = {
  [AgentState.Running]: 'running',
  [AgentState.Finished]: 'finished',
  [AgentState.Error]: 'error',
};

function formatDuration(startTime: number): string {
  const diff = Date.now() - startTime;
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function ElapsedTime({ startTime }: { startTime: number }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono text-xs text-gray-500">{formatDuration(startTime)}</span>;
}

export function Dashboard() {
  const open = useUIStore((s) => s.dashboardOpen);
  const setOpen = useUIStore((s) => s.setDashboardOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const summaries = useAgentStore((s) => s.summaries);
  const instances = Object.values(useAgentStore((s) => s.instances));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="bg-[#0f1014] border border-white/10 rounded-2xl shadow-2xl w-[700px] max-h-[80vh] overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold font-display text-[#EDEDEF]">
            agent-watch — overview
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setOpen(false); setSettingsOpen(true); }}
              className="text-gray-400 hover:text-white text-sm"
              title="Settings"
            >
              ⚙
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {summaries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            No agents currently running
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {summaries.map((s) => (
                <div
                  key={s.agentType}
                  className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-semibold text-[15px]">{s.agentName}</span>
                    <span className="font-mono text-[10px] text-gray-500 bg-[#050506] px-2 py-0.5 rounded-full border border-white/5">
                      {s.instanceCount} instances
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                      {s.runningCount} running
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
                      {s.errorCount} error
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left font-mono text-[10px] text-gray-500 uppercase tracking-wider py-3 px-3">pid</th>
                  <th className="text-left font-mono text-[10px] text-gray-500 uppercase tracking-wider py-3 px-3">agent</th>
                  <th className="text-left font-mono text-[10px] text-gray-500 uppercase tracking-wider py-3 px-3">status</th>
                  <th className="text-left font-mono text-[10px] text-gray-500 uppercase tracking-wider py-3 px-3">uptime</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((inst) => (
                  <tr key={inst.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-xs text-gray-500 bg-[#050506] px-2 py-0.5 rounded">
                        {inst.pid}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-mono text-[11px] px-2 py-0.5 rounded font-medium ${
                        inst.agentType === 'claude'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        {inst.agentType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        inst.state === AgentState.Running
                          ? 'bg-blue-500/10 text-blue-400'
                          : inst.state === AgentState.Finished
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inst.state === AgentState.Running ? 'bg-blue-400 animate-pulse' : 'bg-current'
                        }`} />
                        {STATE_LABELS[inst.state]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-500">
                      <ElapsedTime startTime={inst.startTime} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

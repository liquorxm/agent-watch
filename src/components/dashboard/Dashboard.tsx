import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAgentStore } from '../../stores/agentStore';
import { AgentState } from '../../types/agent';

const STATE_LABELS: Record<string, string> = {
  [AgentState.Running]: 'running',
  [AgentState.Finished]: 'finished',
  [AgentState.Error]: 'error',
};

function formatDuration(startTime: number, now: number): string {
  const diff = now - startTime;
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function ElapsedTime({ startTime }: { startTime: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono text-xs">{formatDuration(startTime, now)}</span>;
}

export function Dashboard() {
  const open = useUIStore((s) => s.dashboardOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const summaries = useAgentStore((s) => s.summaries);
  const instances = Object.values(useAgentStore((s) => s.instances));

  if (!open) return null;

  return (
    <div className="p-6 overflow-auto relative min-h-full">
      <button
        onClick={() => setSettingsOpen(true)}
        className="absolute top-4 right-4 text-[var(--aw-text-muted)] hover:text-[var(--aw-text-primary)] text-sm transition-colors"
        title="Settings"
      >
        {'⚙'}
      </button>

      {summaries.length === 0 ? (
        <div className="text-center py-12 text-[var(--aw-text-muted)] font-mono text-sm">
          No agents currently running
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3.5 mb-7">
            {summaries.map((s) => (
              <div
                key={s.agentType}
                className="bg-[var(--aw-bg-card)] border border-[var(--aw-border-subtle)] rounded-[10px] p-[18px_20px] cursor-pointer transition-all duration-200 hover:border-[var(--aw-border)] hover:-translate-y-px"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[15px] text-[var(--aw-text-primary)] font-display">{s.agentName}</span>
                  <span className="font-mono text-[10px] text-[var(--aw-text-muted)] bg-[var(--aw-bg-deep)] px-2.5 py-[3px] rounded-[20px] border border-[var(--aw-border-subtle)]">
                    {s.instanceCount} instances
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--aw-text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.25)]" />
                    {s.runningCount} running
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--aw-text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.25)]" />
                    {s.errorCount} error
                  </span>
                </div>
              </div>
            ))}
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--aw-border-subtle)]">
                <th className="text-left font-mono text-[10px] font-medium text-[var(--aw-text-muted)] uppercase tracking-[0.08em] py-3 px-3.5">pid</th>
                <th className="text-left font-mono text-[10px] font-medium text-[var(--aw-text-muted)] uppercase tracking-[0.08em] py-3 px-3.5">agent</th>
                <th className="text-left font-mono text-[10px] font-medium text-[var(--aw-text-muted)] uppercase tracking-[0.08em] py-3 px-3.5">status</th>
                <th className="text-left font-mono text-[10px] font-medium text-[var(--aw-text-muted)] uppercase tracking-[0.08em] py-3 px-3.5">uptime</th>
              </tr>
            </thead>
            <tbody>
              {instances.map((inst) => (
                <tr key={inst.id} className="border-b border-[rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-mono text-xs text-[var(--aw-text-muted)] bg-[var(--aw-bg-deep)] px-2 py-[3px] rounded">
                      {inst.pid}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`font-mono text-[11px] px-2.5 py-1 rounded font-medium ${
                      inst.agentType === 'claude'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {inst.agentType}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium px-3 py-1 rounded-[20px] ${
                      inst.state === AgentState.Running
                        ? 'bg-blue-500/10 text-blue-400'
                        : inst.state === AgentState.Finished
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      <span className={`w-[5px] h-[5px] rounded-full ${
                        inst.state === AgentState.Running ? 'bg-blue-400 animate-pulse' : 'bg-current'
                      }`} />
                      {STATE_LABELS[inst.state]}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-xs text-[var(--aw-text-muted)]">
                    <ElapsedTime startTime={inst.startTime} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

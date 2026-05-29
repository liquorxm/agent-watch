import { useAgentStore } from '../../stores/agentStore';

export function CardMode() {
  const summaries = useAgentStore((s) => s.summaries);

  return (
    <div
      className="w-[210px] bg-[var(--aw-bg-overlay)] rounded-md border border-[var(--aw-border-subtle)] p-3.5 cursor-pointer shadow-sm"
    >
      {summaries.length === 0 ? (
        <p className="text-xs text-[var(--aw-text-secondary)] font-mono">No agents running</p>
      ) : (
        summaries.map((s) => (
          <div key={s.agentType} className="mb-1.5 last:mb-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold font-display text-[var(--aw-text-primary)]">{s.agentName}</span>
              <span className="text-[10px] text-[var(--aw-text-muted)] font-mono">({s.instanceCount})</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              {s.runningCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-blue-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {s.runningCount}
                </span>
              )}
              {s.errorCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-red-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {s.errorCount}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

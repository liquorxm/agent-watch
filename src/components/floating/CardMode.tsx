import { useAgentStore } from '../../stores/agentStore';

interface CardModeProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function CardMode({ onClick, onContextMenu }: CardModeProps) {
  const summaries = useAgentStore((s) => s.summaries);

  return (
    <div
      className="w-[210px] bg-white dark:bg-[#1f2937] rounded-md border border-black/10 dark:border-white/10 p-3.5 cursor-pointer shadow-sm"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {summaries.length === 0 ? (
        <p className="text-xs text-gray-400 font-mono">No agents running</p>
      ) : (
        summaries.map((s) => (
          <div key={s.agentType} className="mb-1.5 last:mb-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold font-display">{s.agentName}</span>
              <span className="text-[10px] text-gray-500 font-mono">({s.instanceCount})</span>
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

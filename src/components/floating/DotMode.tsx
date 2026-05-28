import { useAgentStore } from '../../stores/agentStore';
import { AgentState } from '../../types/agent';

const STATE_COLORS: Record<string, string> = {
  [AgentState.Running]: '#3B82F6',
  [AgentState.Finished]: '#10B981',
  [AgentState.Error]: '#EF4444',
};

function getHighestState(instances: Record<string, { state: AgentState }>): AgentState | null {
  const values = Object.values(instances);
  if (values.some((i) => i.state === AgentState.Error)) return AgentState.Error;
  if (values.some((i) => i.state === AgentState.Running)) return AgentState.Running;
  if (values.length > 0) return AgentState.Finished;
  return null;
}

interface DotModeProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function DotMode({ onClick, onContextMenu }: DotModeProps) {
  const instances = useAgentStore((s) => s.instances);
  const highestState = getHighestState(instances);
  const color = highestState ? STATE_COLORS[highestState] : '#5A5F68';

  return (
    <div
      className="w-[26px] h-[26px] rounded-full cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: color,
        boxShadow:
          highestState === AgentState.Error
            ? `0 0 16px ${color}40, 0 2px 8px rgba(0,0,0,0.3)`
            : `0 0 12px ${color}40, 0 2px 8px rgba(0,0,0,0.3)`,
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    />
  );
}

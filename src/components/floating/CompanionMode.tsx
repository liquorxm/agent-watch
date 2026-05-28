import { useAgentStore } from '../../stores/agentStore';
import { useConfigStore } from '../../stores/configStore';
import { AgentState } from '../../types/agent';
import { CompanionAnimalSVG } from './CompanionAnimals';

interface CompanionModeProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function CompanionMode({ onClick, onContextMenu }: CompanionModeProps) {
  const instances = useAgentStore((s) => s.instances);
  const animal = useConfigStore((s) => s.config.companionAnimal);
  const hasRunning = Object.values(instances).some(
    (i) => i.state === AgentState.Running,
  );

  return (
    <div
      className="w-[280px] bg-white dark:bg-[#1f2937] rounded-xl border border-black/10 dark:border-white/10 p-5 cursor-pointer text-center shadow-md"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className={hasRunning ? 'animate-bounce' : ''}>
        <CompanionAnimalSVG animal={animal} size={80} />
      </div>
      {hasRunning ? (
        <p className="text-xs font-semibold font-mono text-blue-500 mt-3">Working...</p>
      ) : (
        <p className="text-xs text-gray-400 font-mono mt-3">Idle</p>
      )}
      <p className="text-[10px] text-gray-400 font-mono mt-1">
        {Object.keys(instances).length} agent{Object.keys(instances).length !== 1 ? 's' : ''} monitored
      </p>
    </div>
  );
}

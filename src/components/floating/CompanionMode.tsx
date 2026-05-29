import { useAgentStore } from '../../stores/agentStore';
import { useConfigStore } from '../../stores/configStore';
import { AgentState } from '../../types/agent';
import { CompanionAnimalSVG } from './CompanionAnimals';

export function CompanionMode() {
  const instances = useAgentStore((s) => s.instances);
  const animal = useConfigStore((s) => s.config.companionAnimal);
  const hasRunning = Object.values(instances).some(
    (i) => i.state === AgentState.Running,
  );

  return (
    <div
      className="w-[280px] bg-[var(--aw-bg-overlay)] rounded-xl border border-[var(--aw-border-subtle)] p-5 cursor-pointer flex flex-col items-center shadow-md"
    >
      <div className={hasRunning ? 'animate-bounce' : ''}>
        <CompanionAnimalSVG animal={animal} size={80} />
      </div>
      {hasRunning ? (
        <p className="text-xs font-semibold font-mono text-blue-500 mt-3">Working...</p>
      ) : (
        <p className="text-xs text-[var(--aw-text-secondary)] font-mono mt-3">Idle</p>
      )}
      <p className="text-[10px] text-[var(--aw-text-muted)] font-mono mt-1">
        {Object.keys(instances).length} agent{Object.keys(instances).length !== 1 ? 's' : ''} monitored
      </p>
    </div>
  );
}

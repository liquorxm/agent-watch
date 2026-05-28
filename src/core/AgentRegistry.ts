import { AgentInstance, AgentState, AgentSummary } from '../types/agent';

export class AgentRegistry {
  private instances: Map<string, AgentInstance> = new Map();

  register(instance: AgentInstance): void {
    this.instances.set(instance.id, instance);
  }

  remove(id: string): boolean {
    return this.instances.delete(id);
  }

  find(id: string): AgentInstance | undefined {
    return this.instances.get(id);
  }

  list(): AgentInstance[] {
    return Array.from(this.instances.values());
  }

  findByPid(pid: number): AgentInstance | undefined {
    return this.list().find((inst) => inst.pid === pid);
  }

  findByType(agentType: string): AgentInstance[] {
    return this.list().filter((inst) => inst.agentType === agentType);
  }

  updateState(id: string, state: AgentState, exitCode?: number): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.state = state;
      instance.lastUpdateTime = Date.now();
      if (exitCode !== undefined) {
        instance.exitCode = exitCode;
      }
    }
  }

  getSummaries(): AgentSummary[] {
    const groups = new Map<string, AgentInstance[]>();
    for (const inst of this.instances.values()) {
      const list = groups.get(inst.agentType) || [];
      list.push(inst);
      groups.set(inst.agentType, list);
    }

    return Array.from(groups.entries()).map(([agentType, instances]) => ({
      agentType,
      agentName: instances[0]?.agentType ?? agentType,
      instanceCount: instances.length,
      runningCount: instances.filter((i) => i.state === AgentState.Running).length,
      errorCount: instances.filter((i) => i.state === AgentState.Error).length,
      instances,
    }));
  }
}

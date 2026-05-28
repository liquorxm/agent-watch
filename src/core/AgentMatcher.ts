import { AgentDefinition, ProcessInfo } from '../types/agent';

export class AgentMatcher {
  constructor(private agents: AgentDefinition[]) {}

  match(process: ProcessInfo): string | null {
    for (const agent of this.agents) {
      if (this.matchesAgent(process, agent)) {
        return agent.id;
      }
    }
    return null;
  }

  private matchesAgent(process: ProcessInfo, agent: AgentDefinition): boolean {
    const strategy = agent.matchStrategy || 'hybrid';

    switch (strategy) {
      case 'name':
        return this.matchByName(process, agent);
      case 'command':
        return this.matchByCommand(process, agent);
      case 'hybrid':
      default:
        return this.matchByName(process, agent) || this.matchByCommand(process, agent);
    }
  }

  private matchByName(process: ProcessInfo, agent: AgentDefinition): boolean {
    return agent.patterns.some((pattern) =>
      process.name.toLowerCase().includes(pattern.toLowerCase()),
    );
  }

  private matchByCommand(process: ProcessInfo, agent: AgentDefinition): boolean {
    return agent.patterns.some((pattern) =>
      process.command.toLowerCase().includes(pattern.toLowerCase()),
    );
  }

  setAgents(agents: AgentDefinition[]): void {
    this.agents = agents;
  }
}

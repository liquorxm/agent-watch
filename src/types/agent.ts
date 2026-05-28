export enum AgentState {
  Running = 'running',
  Finished = 'finished',
  Error = 'error',
}

export interface AgentDefinition {
  id: string;
  name: string;
  version?: string;
  patterns: string[];
  matchStrategy: 'hybrid' | 'name' | 'command';
}

export interface ProcessInfo {
  pid: number;
  name: string;
  command: string;
  ppid: number;
}

export interface AgentInstance {
  id: string;
  pid: number;
  agentType: string;
  state: AgentState;
  startTime: number;
  lastUpdateTime: number;
  exitCode?: number;
}

export interface AgentSummary {
  agentType: string;
  agentName: string;
  instanceCount: number;
  runningCount: number;
  errorCount: number;
  instances: AgentInstance[];
}

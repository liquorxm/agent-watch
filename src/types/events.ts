import { AgentState, ProcessInfo } from './agent';

export enum EventType {
  AgentDetected = 'agent:detected',
  AgentRemoved = 'agent:removed',
  StateChanged = 'agent:state-changed',
  NotificationRequested = 'notification:requested',
  ConfigUpdated = 'config:updated',
}

export interface AgentDetectedEvent {
  type: EventType.AgentDetected;
  process: ProcessInfo;
  agentType: string;
}

export interface AgentRemovedEvent {
  type: EventType.AgentRemoved;
  instanceId: string;
  pid: number;
  agentType: string;
  previousState: AgentState;
}

export interface StateChangedEvent {
  type: EventType.StateChanged;
  instanceId: string;
  previousState: AgentState;
  newState: AgentState;
  exitCode?: number;
}

export interface NotificationRequestedEvent {
  type: EventType.NotificationRequested;
  instanceId: string;
  state: AgentState;
  message?: string;
}

export type AgentEvent =
  | AgentDetectedEvent
  | AgentRemovedEvent
  | StateChangedEvent
  | NotificationRequestedEvent;

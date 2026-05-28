import { AgentState } from '../types/agent';
import { EventBus } from './EventBus';
import { EventType } from '../types/events';
import { DEFAULT_NOTIFICATION_THROTTLE, NotificationThrottleConfig } from '../types/config';

interface PendingTransition {
  instanceId: string;
  newState: AgentState;
  timer: ReturnType<typeof setTimeout>;
}

export class StateEngine {
  private states: Map<string, AgentState> = new Map();
  private pendingTransitions: Map<string, PendingTransition> = new Map();
  private instanceLastNotify: Map<string, number> = new Map();
  private globalNotifyTimestamps: number[] = [];
  private throttle: NotificationThrottleConfig;

  constructor(
    private bus: EventBus,
    throttle?: Partial<NotificationThrottleConfig>,
  ) {
    this.throttle = { ...DEFAULT_NOTIFICATION_THROTTLE, ...throttle };
  }

  transition(
    instanceId: string,
    pid: number,
    agentType: string,
    previousState: AgentState,
    newState: AgentState,
    exitCode?: number,
  ): void {
    if (previousState === newState) return;

    const current = this.states.get(instanceId) ?? previousState;
    if (current === newState) return;

    const pending = this.pendingTransitions.get(instanceId);
    if (pending) {
      clearTimeout(pending.timer);
    }

    const timer = setTimeout(() => {
      this.confirmTransition(instanceId);
    }, this.throttle.debounceMs);

    this.pendingTransitions.set(instanceId, { instanceId, newState, timer });
  }

  confirmTransition(instanceId: string): void {
    const pending = this.pendingTransitions.get(instanceId);
    if (!pending) return;

    this.pendingTransitions.delete(instanceId);
    const previousState = this.states.get(instanceId) ?? AgentState.Running;
    this.states.set(instanceId, pending.newState);

    this.bus.emit(EventType.StateChanged, {
      instanceId,
      previousState,
      newState: pending.newState,
    });

    if (
      pending.newState === AgentState.Finished ||
      pending.newState === AgentState.Error
    ) {
      this.tryNotify(instanceId, pending.newState);
    }
  }

  private tryNotify(instanceId: string, state: AgentState): void {
    const lastNotify = this.instanceLastNotify.get(instanceId) ?? 0;
    if (Date.now() - lastNotify < this.throttle.throttleMs) return;

    this.globalNotifyTimestamps = this.globalNotifyTimestamps.filter(
      (t) => Date.now() - t < 60000,
    );
    if (this.globalNotifyTimestamps.length >= this.throttle.rateLimitPerMinute) return;

    this.instanceLastNotify.set(instanceId, Date.now());
    this.globalNotifyTimestamps.push(Date.now());

    this.bus.emit(EventType.NotificationRequested, {
      instanceId,
      state,
    });
  }

  getState(instanceId: string): AgentState | undefined {
    return this.states.get(instanceId);
  }

  removeInstance(instanceId: string): void {
    this.states.delete(instanceId);
    const pending = this.pendingTransitions.get(instanceId);
    if (pending) {
      clearTimeout(pending.timer);
    }
    this.pendingTransitions.delete(instanceId);
  }
}

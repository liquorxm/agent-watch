import { ProcessInfo } from '../types/agent';
import { EventBus } from './EventBus';
import { AgentMatcher } from './AgentMatcher';
import { AgentRegistry } from './AgentRegistry';
import { EventType, AgentDetectedEvent, AgentRemovedEvent } from '../types/events';

export type ProcessListFn = () => Promise<ProcessInfo[]>;

export class ProcessWatcher {
  private knownPids: Map<string, Set<number>> = new Map();
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    private bus: EventBus,
    private matcher: AgentMatcher,
    private registry: AgentRegistry,
    private listProcesses: ProcessListFn,
    private scanIntervalMs: number = 3000,
  ) {}

  start(): void {
    this.scan();
    this.intervalId = setInterval(() => this.scan(), this.scanIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  async scan(): Promise<void> {
    try {
      const processes = await this.listProcesses();
      const currentPids = new Map<string, Set<number>>();

      for (const proc of processes) {
        const agentType = this.matcher.match(proc);
        if (!agentType) continue;

        if (!currentPids.has(agentType)) {
          currentPids.set(agentType, new Set());
        }
        currentPids.get(agentType)!.add(proc.pid);

        if (!this.isKnown(agentType, proc.pid)) {
          this.trackKnown(agentType, proc.pid);
          const instanceId = `${agentType}-${proc.pid}`;
          this.registry.register({
            id: instanceId,
            pid: proc.pid,
            agentType,
            state: 'running' as any,
            startTime: Date.now(),
            lastUpdateTime: Date.now(),
          });

          const event: AgentDetectedEvent = {
            type: EventType.AgentDetected,
            process: proc,
            agentType,
          };
          this.bus.emit(EventType.AgentDetected, event);
        }
      }

      for (const [agentType, pids] of this.knownPids.entries()) {
        const current = currentPids.get(agentType);
        for (const pid of pids) {
          if (!current?.has(pid)) {
            const instanceId = `${agentType}-${pid}`;
            this.registry.remove(instanceId);

            const event: AgentRemovedEvent = {
              type: EventType.AgentRemoved,
              instanceId,
              pid,
            };
            this.bus.emit(EventType.AgentRemoved, event);
          }
        }
      }

      this.knownPids = currentPids;
    } catch (err) {
      console.warn('ProcessWatcher scan failed:', err);
    }
  }

  private isKnown(agentType: string, pid: number): boolean {
    return this.knownPids.get(agentType)?.has(pid) ?? false;
  }

  private trackKnown(agentType: string, pid: number): void {
    if (!this.knownPids.has(agentType)) {
      this.knownPids.set(agentType, new Set());
    }
    this.knownPids.get(agentType)!.add(pid);
  }
}

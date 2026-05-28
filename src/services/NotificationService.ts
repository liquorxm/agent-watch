import { EventBus } from '../core/EventBus';
import { EventType, NotificationRequestedEvent } from '../types/events';
import { AgentState } from '../types/agent';

export class NotificationService {
  private granted = false;
  private agentNames: Map<string, string> = new Map();

  constructor(private bus: EventBus) {
    this.agentNames.set('claude', 'Claude Code');
    this.agentNames.set('codex', 'Codex');
    this.init();
  }

  private async init(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.granted = permission === 'granted';
    }

    this.bus.on(EventType.NotificationRequested, (event: NotificationRequestedEvent) => {
      this.send(event);
    });
  }

  private send(event: NotificationRequestedEvent): void {
    if (!this.granted) return;

    const agentName = this.agentNames.get(event.instanceId.split('-')[0]) ?? 'Agent';

    const title =
      event.state === AgentState.Error
        ? `${agentName} Error`
        : `${agentName} Finished`;

    const body = event.message ?? `${agentName} instance ${event.instanceId} changed to ${event.state}`;

    new Notification(title, { body });
  }
}

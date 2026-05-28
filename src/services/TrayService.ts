import { EventBus } from '../core/EventBus';
import { AgentState } from '../types/agent';
import { useAgentStore } from '../stores/agentStore';

const STATE_COLORS: Record<string, string> = {
  [AgentState.Running]: '#3B82F6',
  [AgentState.Finished]: '#10B981',
  [AgentState.Error]: '#EF4444',
};

export class TrayService {
  constructor(private bus: EventBus) {
    this.bus.on('agent:detected', () => this.updateTray());
    this.bus.on('agent:removed', () => this.updateTray());
    this.bus.on('agent:state-changed', () => this.updateTray());
  }

  private updateTray(): void {
    const instances = useAgentStore.getState().instances;
    if (Object.keys(instances).length === 0) {
      this.updateTrayIcon(null, 'AgentWatch - No agents running');
      return;
    }

    let highestState: AgentState | null = null;
    for (const inst of Object.values(instances)) {
      if (inst.state === AgentState.Error) {
        highestState = AgentState.Error;
        break;
      }
      if (inst.state === AgentState.Running) {
        highestState = AgentState.Running;
      }
    }

    if (!highestState) {
      highestState = AgentState.Finished;
    }

    const color = STATE_COLORS[highestState];
    const summaries = useAgentStore.getState().summaries;
    const tooltip = summaries
      .map((s) => `${s.agentName}: Running ${s.runningCount}, Error ${s.errorCount}`)
      .join('\n');

    this.updateTrayIcon(color, tooltip || 'AgentWatch');
  }

  private updateTrayIcon(color: string | null, tooltip: string): void {
    // Platform-specific tray icon update via Tauri API
    // For MVP, this is wired through the Tauri tray handle in main.rs
    // The frontend emits events; the Rust backend handles icon rendering
  }
}

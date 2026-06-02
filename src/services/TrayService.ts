import { emit } from '@tauri-apps/api/event';
import { EventBus } from '../core/EventBus';
import { AgentInstance, AgentState, AgentSummary } from '../types/agent';
import { useAgentStore } from '../stores/agentStore';

const STATE_COLORS: Record<string, string> = {
  [AgentState.Running]: '#3B82F6',
  [AgentState.Finished]: '#10B981',
  [AgentState.Error]: '#EF4444',
};

export interface TrayMenuItem {
  id: string;
  label: string;
  state: AgentState;
}

export interface TrayMenuGroup {
  agentType: string;
  agentName: string;
  count: number;
  items: TrayMenuItem[];
}

export interface TrayMenuState {
  tooltip: string;
  iconState: AgentState | null;
  iconColor: string | null;
  emptyLabel: string | null;
  widgetVisible: boolean;
  widgetToggleLabel: string;
  groups: TrayMenuGroup[];
}

function getHighestState(instances: Record<string, AgentInstance>): AgentState | null {
  const values = Object.values(instances);
  if (values.length === 0) return null;

  let highestState: AgentState | null = null;
  for (const inst of values) {
    if (inst.state === AgentState.Error) {
      return AgentState.Error;
    }
    if (inst.state === AgentState.Running) {
      highestState = AgentState.Running;
    }
  }

  return highestState ?? AgentState.Finished;
}

export function buildTrayMenuState(
  instances: Record<string, AgentInstance>,
  summaries: AgentSummary[],
  widgetVisible = true,
): TrayMenuState {
  const iconState = getHighestState(instances);
  const widgetToggleLabel = widgetVisible ? '✓ floating widget' : 'show floating widget';

  if (iconState === null) {
    return {
      tooltip: 'AgentWatch - No agents running',
      iconState,
      iconColor: null,
      emptyLabel: 'No agents running',
      widgetVisible,
      widgetToggleLabel,
      groups: [],
    };
  }

  const groups = summaries
    .filter((summary) => summary.instances.length > 0)
    .map((summary): TrayMenuGroup => ({
      agentType: summary.agentType,
      agentName: summary.agentName,
      count: summary.instanceCount,
      items: summary.instances.map((inst, index) => ({
        id: inst.id,
        label: `#${index + 1} · ${inst.state}`,
        state: inst.state,
      })),
    }));

  const tooltip = summaries
    .map((s) => `${s.agentName}: Running ${s.runningCount}, Error ${s.errorCount}`)
    .join('\n');

  return {
    tooltip: tooltip || 'AgentWatch',
    iconState,
    iconColor: STATE_COLORS[iconState],
    emptyLabel: null,
    widgetVisible,
    widgetToggleLabel,
    groups,
  };
}

export class TrayService {
  constructor(private bus: EventBus) {
    this.bus.on('agent:detected', () => this.updateTray());
    this.bus.on('agent:removed', () => this.updateTray());
    this.bus.on('agent:state-changed', () => this.updateTray());
  }

  private updateTray(): void {
    const instances = useAgentStore.getState().instances;
    const summaries = useAgentStore.getState().summaries;
    const menuState = buildTrayMenuState(instances, summaries);

    this.updateTrayIcon(menuState.iconColor, menuState.tooltip);
    emit('tray-menu-updated', menuState).catch(() => {});
  }

  private updateTrayIcon(color: string | null, tooltip: string): void {
    void color;
    void tooltip;
    // Platform-specific tray icon update via Tauri API
    // For MVP, this is wired through the Tauri tray handle in main.rs
    // The frontend emits events; the Rust backend handles icon rendering
  }
}

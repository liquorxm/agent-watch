import { describe, expect, it } from 'vitest';
import { AgentState, type AgentInstance, type AgentSummary } from '../types/agent';
import { buildTrayMenuState } from './TrayService';

function instance(id: string, agentType: string, state: AgentState, pid: number): AgentInstance {
  return {
    id,
    pid,
    agentType,
    state,
    startTime: 1,
    lastUpdateTime: 1,
  };
}

describe('buildTrayMenuState', () => {
  it('should_show_idle_menu_when_no_agents_are_running', () => {
    const menu = buildTrayMenuState({}, []);

    expect(menu.tooltip).toBe('AgentWatch - No agents running');
    expect(menu.iconState).toBeNull();
    expect(menu.groups).toEqual([]);
    expect(menu.emptyLabel).toBe('No agents running');
  });

  it('should_label_widget_toggle_from_visibility_state', () => {
    const visibleMenu = buildTrayMenuState({}, [], true);
    const hiddenMenu = buildTrayMenuState({}, [], false);

    expect(visibleMenu.widgetToggleLabel).toBe('✓ floating widget');
    expect(hiddenMenu.widgetToggleLabel).toBe('show floating widget');
  });

  it('should_group_instances_by_agent_summary_for_tray_menu', () => {
    const claude1 = instance('claude-101', 'claude', AgentState.Running, 101);
    const claude2 = instance('claude-102', 'claude', AgentState.Error, 102);
    const codex1 = instance('codex-201', 'codex', AgentState.Finished, 201);
    const summaries: AgentSummary[] = [
      {
        agentType: 'claude',
        agentName: 'Claude Code',
        instanceCount: 2,
        runningCount: 1,
        errorCount: 1,
        instances: [claude1, claude2],
      },
      {
        agentType: 'codex',
        agentName: 'Codex',
        instanceCount: 1,
        runningCount: 0,
        errorCount: 0,
        instances: [codex1],
      },
    ];

    const menu = buildTrayMenuState(
      {
        [claude1.id]: claude1,
        [claude2.id]: claude2,
        [codex1.id]: codex1,
      },
      summaries,
    );

    expect(menu.iconState).toBe(AgentState.Error);
    expect(menu.groups).toEqual([
      {
        agentType: 'claude',
        agentName: 'Claude Code',
        count: 2,
        items: [
          { id: 'claude-101', label: '#1 · running', state: AgentState.Running },
          { id: 'claude-102', label: '#2 · error', state: AgentState.Error },
        ],
      },
      {
        agentType: 'codex',
        agentName: 'Codex',
        count: 1,
        items: [
          { id: 'codex-201', label: '#1 · finished', state: AgentState.Finished },
        ],
      },
    ]);
  });
});

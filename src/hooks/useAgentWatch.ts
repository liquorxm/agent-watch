import { useEffect, useRef } from 'react';
import { EventBus } from '../core/EventBus';
import { ProcessWatcher } from '../core/ProcessWatcher';
import { AgentMatcher } from '../core/AgentMatcher';
import { AgentRegistry } from '../core/AgentRegistry';
import { StateEngine } from '../core/StateEngine';
import { ConfigManager } from '../core/ConfigManager';
import { NotificationService } from '../services/NotificationService';
import { TrayService } from '../services/TrayService';
import { useAgentStore } from '../stores/agentStore';
import { useConfigStore } from '../stores/configStore';
import { ProcessInfo, AgentState } from '../types/agent';
import { EventType, AgentDetectedEvent, AgentRemovedEvent, StateChangedEvent } from '../types/events';

export function useAgentWatch() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const bus = new EventBus();
    const config = new ConfigManager(useConfigStore.getState().config, bus);
    const matcher = new AgentMatcher(config.getAgents());
    const registry = new AgentRegistry();
    const stateEngine = new StateEngine(bus);
    const notifications = new NotificationService(bus);
    const tray = new TrayService(bus);

    const processWatcher = new ProcessWatcher(
      bus,
      matcher,
      registry,
      async (): Promise<ProcessInfo[]> => {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const raw: string[] = await invoke('get_processes');
          return raw.map((line) => {
            const [pid, name, command] = line.split('|');
            return { pid: parseInt(pid), name, command, ppid: 0 };
          });
        } catch {
          return [];
        }
      },
      3000,
    );

    bus.on(EventType.AgentDetected, (event: AgentDetectedEvent) => {
      useAgentStore.getState().addInstance({
        id: `${event.agentType}-${event.process.pid}`,
        pid: event.process.pid,
        agentType: event.agentType,
        state: AgentState.Running,
        startTime: Date.now(),
        lastUpdateTime: Date.now(),
      });
      useAgentStore.getState().updateSummaries(registry.getSummaries());
    });

    bus.on(EventType.AgentRemoved, (event: AgentRemovedEvent) => {
      const instance = registry.find(event.instanceId);
      const exitCode = 0;
      if (instance) {
        stateEngine.transition(
          event.instanceId,
          event.pid,
          instance.agentType,
          instance.state,
          exitCode === 0 ? AgentState.Finished : AgentState.Error,
          exitCode,
        );
      }
      useAgentStore.getState().removeInstance(event.instanceId);
      stateEngine.removeInstance(event.instanceId);
      useAgentStore.getState().updateSummaries(registry.getSummaries());
    });

    bus.on(EventType.StateChanged, (event: StateChangedEvent) => {
      useAgentStore.getState().updateState(event.instanceId, event.newState);
    });

    bus.on(EventType.ConfigUpdated, (newConfig: any) => {
      useConfigStore.getState().setConfig(newConfig);
      matcher.setAgents(newConfig.agents);
    });

    processWatcher.start();

    return () => {
      processWatcher.stop();
    };
  }, []);
}

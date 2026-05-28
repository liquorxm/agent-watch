import { useEffect, useRef } from 'react';
import { emit, listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
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
import { AppConfig } from '../types/config';
import { EventType, AgentDetectedEvent, AgentRemovedEvent, StateChangedEvent } from '../types/events';

async function syncToWidget() {
  try {
    console.log('[Main] syncToWidget: emitting with', Object.keys(useAgentStore.getState().instances).length, 'instances');
    await emit('agent-state-sync', {
      instances: useAgentStore.getState().instances,
      summaries: useAgentStore.getState().summaries,
    });
    await emit('config-sync', {
      config: useConfigStore.getState().config,
    });
  } catch (err) {
    console.error('[Main] syncToWidget failed:', err);
  }
}

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
    new NotificationService(bus);
    new TrayService(bus);

    const processWatcher = new ProcessWatcher(
      bus,
      matcher,
      registry,
      async (): Promise<ProcessInfo[]> => {
        try {
          const raw: string[] = await invoke('get_processes');
          return raw.map((line): ProcessInfo => {
            const firstPipe = line.indexOf('|');
            const secondPipe = line.indexOf('|', firstPipe + 1);
            if (firstPipe === -1 || secondPipe === -1) {
              const [pid, name, command] = line.split('|');
              return { pid: parseInt(pid), name, command, ppid: 0 };
            }
            const pid = parseInt(line.slice(0, firstPipe), 10);
            const name = line.slice(firstPipe + 1, secondPipe);
            const command = line.slice(secondPipe + 1);
            return { pid: isNaN(pid) ? 0 : pid, name, command, ppid: 0 };
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
      syncToWidget();
    });

    bus.on(EventType.AgentRemoved, (event: AgentRemovedEvent) => {
      const exitCode = 0;
      stateEngine.transition(
        event.instanceId,
        event.pid,
        event.agentType,
        event.previousState,
        exitCode === 0 ? AgentState.Finished : AgentState.Error,
        exitCode,
      );
      useAgentStore.getState().removeInstance(event.instanceId);
      useAgentStore.getState().updateSummaries(registry.getSummaries());
      syncToWidget();
    });

    bus.on(EventType.StateChanged, (event: StateChangedEvent) => {
      useAgentStore.getState().updateState(event.instanceId, event.newState);
      syncToWidget();
    });

    bus.on(EventType.ConfigUpdated, (newConfig: AppConfig) => {
      useConfigStore.getState().setConfig(newConfig);
      matcher.setAgents(newConfig.agents);
      syncToWidget();
    });

    processWatcher.start();

    let unlistenSync: (() => void) | undefined;
    listen('request-sync', () => {
      console.log('[Main] Received request-sync from another window');
      syncToWidget();
    }).then((fn) => {
      unlistenSync = fn;
    }).catch((err) => {
      console.error('[Main] Failed to register request-sync listener:', err);
    });

    return () => {
      initialized.current = false;
      processWatcher.stop();
      bus.removeAllListeners();
      unlistenSync?.();
    };
  }, []);
}

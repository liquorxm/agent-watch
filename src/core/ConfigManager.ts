import { AppConfig, DEFAULT_CONFIG, AgentDefinition } from '../types/config';
import { EventBus } from './EventBus';
import { EventType } from '../types/events';

export class ConfigManager {
  private config: AppConfig;
  private bus?: EventBus;

  constructor(initial?: Partial<AppConfig>, bus?: EventBus) {
    this.config = { ...DEFAULT_CONFIG, ...initial };
    this.bus = bus;
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  getAgents(): AgentDefinition[] {
    return [...this.config.agents];
  }

  getAgent(id: string): AgentDefinition | undefined {
    return this.config.agents.find((a) => a.id === id);
  }

  update<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
    this.bus?.emit(EventType.ConfigUpdated, this.getAll());
  }

  addAgent(agent: AgentDefinition): void {
    if (!this.config.agents.find((a) => a.id === agent.id)) {
      this.config.agents.push(agent);
      this.bus?.emit(EventType.ConfigUpdated, this.getAll());
    }
  }

  removeAgent(id: string): void {
    this.config.agents = this.config.agents.filter((a) => a.id !== id);
    this.bus?.emit(EventType.ConfigUpdated, this.getAll());
  }
}

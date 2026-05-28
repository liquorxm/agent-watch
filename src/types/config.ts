import { AgentDefinition } from './agent';

export type WidgetMode = 'dot' | 'card' | 'companion';
export type ThemeMode = 'oled' | 'light';
export type CompanionAnimal =
  | 'pixel-fox'
  | 'circuit-cat'
  | 'binary-owl'
  | 'data-dog'
  | 'glitch-raccoon'
  | 'cyber-penguin';

export interface NotificationConfig {
  error: boolean;
  finished: boolean;
}

export interface AppConfig {
  configVersion: number;
  startup: boolean;
  theme: ThemeMode;
  widgetMode: WidgetMode;
  companionAnimal: CompanionAnimal;
  notifications: NotificationConfig;
  agents: AgentDefinition[];
}

export interface NotificationThrottleConfig {
  debounceMs: number;
  throttleMs: number;
  rateLimitPerMinute: number;
}

export const DEFAULT_NOTIFICATION_THROTTLE: NotificationThrottleConfig = {
  debounceMs: 3000,
  throttleMs: 10000,
  rateLimitPerMinute: 5,
};

export const DEFAULT_AGENTS: AgentDefinition[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    patterns: ['claude'],
    matchStrategy: 'hybrid',
  },
  {
    id: 'codex',
    name: 'Codex',
    patterns: ['codex'],
    matchStrategy: 'hybrid',
  },
];

export const DEFAULT_CONFIG: AppConfig = {
  configVersion: 1,
  startup: true,
  theme: 'oled',
  widgetMode: 'dot',
  companionAnimal: 'data-dog',
  notifications: {
    error: true,
    finished: true,
  },
  agents: DEFAULT_AGENTS,
};

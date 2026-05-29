import { useConfigStore } from '../../stores/configStore';
import { WidgetMode, ThemeMode, CompanionAnimal } from '../../types/config';

const COMPANION_OPTIONS: { value: CompanionAnimal; label: string }[] = [
  { value: 'data-dog', label: 'Data Dog' },
  { value: 'circuit-cat', label: 'Circuit Cat' },
  { value: 'pixel-fox', label: 'Pixel Fox' },
  { value: 'binary-owl', label: 'Binary Owl' },
  { value: 'glitch-raccoon', label: 'Glitch Raccoon' },
  { value: 'cyber-penguin', label: 'Cyber Penguin' },
];

export function Settings() {
  const config = useConfigStore((s) => s.config);
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);
  const setTheme = useConfigStore((s) => s.setTheme);
  const setCompanionAnimal = useConfigStore((s) => s.setCompanionAnimal);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-mono text-[10px] text-[var(--aw-text-muted)] uppercase tracking-wider mb-2.5">
          widget mode
        </h3>
        <div className="flex gap-1.5">
          {(['dot', 'card', 'companion'] as WidgetMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setWidgetMode(mode)}
              className={`px-4 py-1.5 rounded text-[11px] font-mono border transition-colors capitalize ${
                config.widgetMode === mode
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-[var(--aw-bg-elevated)] border-[var(--aw-border-subtle)] text-[var(--aw-text-secondary)] hover:border-[var(--aw-border)]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-mono text-[10px] text-[var(--aw-text-muted)] uppercase tracking-wider mb-2.5">
          companion
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {COMPANION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCompanionAnimal(opt.value)}
              className={`px-3 py-1.5 rounded text-[11px] font-mono border transition-colors ${
                config.companionAnimal === opt.value
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-[var(--aw-bg-elevated)] border-[var(--aw-border-subtle)] text-[var(--aw-text-secondary)] hover:border-[var(--aw-border)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-mono text-[10px] text-[var(--aw-text-muted)] uppercase tracking-wider mb-2.5">
          theme
        </h3>
        <div className="flex gap-1.5">
          {(['oled', 'light'] as ThemeMode[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              className={`px-4 py-1.5 rounded text-[11px] font-mono border transition-colors capitalize ${
                config.theme === theme
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-[var(--aw-bg-elevated)] border-[var(--aw-border-subtle)] text-[var(--aw-text-secondary)] hover:border-[var(--aw-border)]'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-mono text-[10px] text-[var(--aw-text-muted)] uppercase tracking-wider mb-2.5">
          notifications
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between py-2">
            <span className="text-[13px] text-[var(--aw-text-secondary)]">error notifications</span>
            <input
              type="checkbox"
              checked={config.notifications.error}
              onChange={(e) =>
                useConfigStore.setState((s) => ({
                  config: { ...s.config, notifications: { ...s.config.notifications, error: e.target.checked } },
                }))
              }
              className="w-4 h-4"
            />
          </label>
          <label className="flex items-center justify-between py-2">
            <span className="text-[13px] text-[var(--aw-text-secondary)]">finished notifications</span>
            <input
              type="checkbox"
              checked={config.notifications.finished}
              onChange={(e) =>
                useConfigStore.setState((s) => ({
                  config: { ...s.config, notifications: { ...s.config.notifications, finished: e.target.checked } },
                }))
              }
              className="w-4 h-4"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="font-mono text-[10px] text-[var(--aw-text-muted)] uppercase tracking-wider mb-2.5">
          general
        </h3>
        <label className="flex items-center justify-between py-2">
          <span className="text-[13px] text-[var(--aw-text-secondary)]">launch on startup</span>
          <input
            type="checkbox"
            checked={config.startup}
            onChange={(e) =>
              useConfigStore.setState((s) => ({
                config: { ...s.config, startup: e.target.checked },
              }))
            }
            className="w-4 h-4"
          />
        </label>
      </section>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { emit } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { useConfigStore } from '../../stores/configStore';
import { DotMode } from './DotMode';
import { CardMode } from './CardMode';
import { CompanionMode } from './CompanionMode';

export function FloatingWidget() {
  const widgetMode = useConfigStore((s) => s.config.widgetMode);
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMainDashboard = useCallback(() => {
    emit('open-dashboard', {}).catch(() => {});
  }, []);

  const handleClick = useCallback(() => {
    if (widgetMode === 'dot') {
      setWidgetMode('card');
    } else {
      openMainDashboard();
    }
  }, [widgetMode, setWidgetMode, openMainDashboard]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(true);
  }, []);

  return (
    <div
      className="fixed inset-0 select-none flex items-center justify-center"
      data-tauri-drag-region
    >
      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {widgetMode === 'dot' && <DotMode onClick={handleClick} onContextMenu={handleContextMenu} />}
        {widgetMode === 'card' && <CardMode onClick={handleClick} onContextMenu={handleContextMenu} />}
        {widgetMode === 'companion' && <CompanionMode onClick={handleClick} onContextMenu={handleContextMenu} />}
      </div>
      {menuOpen && (
        <ContextMenu
          x={80}
          y={20}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

function ContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);

  const openDashboard = () => {
    emit('open-dashboard', {}).catch(() => {});
  };

  const items = [
    { label: 'Dot Mode', action: () => setWidgetMode('dot') },
    { label: 'Card Mode', action: () => setWidgetMode('card') },
    { label: 'Companion', action: () => setWidgetMode('companion') },
    { label: '---', action: () => {} },
    { label: 'Dashboard', action: () => openDashboard() },
    { label: '---', action: () => {} },
    { label: 'Quit', action: () => { invoke('quit_app').catch(() => {}); } },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[10001]" onClick={onClose} />
      <div
        className="fixed z-[10002] bg-white dark:bg-[#1f2937] rounded-lg shadow-xl border border-black/10 dark:border-white/10 py-1 min-w-[160px]"
        style={{ left: x, top: y }}
      >
        {items.map((item, i) =>
          item.label === '---' ? (
            <div key={i} className="border-t border-black/5 dark:border-white/10 my-1" />
          ) : (
            <button
              key={i}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/5 font-mono"
              onClick={() => { item.action(); onClose(); }}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
    </>
  );
}

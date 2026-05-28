import { useState, useCallback, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { LogicalSize } from '@tauri-apps/api/dpi';
import { useConfigStore } from '../../stores/configStore';
import { DotMode } from './DotMode';
import { CardMode } from './CardMode';
import { CompanionMode } from './CompanionMode';

const PAD = 12;
const MENU_W = 170;
const MENU_H = 210;
const GAP = 6;

interface ContentSize {
  w: number;
  h: number;
}

const MODE_CONTENT: Record<string, ContentSize> = {
  dot: { w: 80, h: 80 },
  card: { w: 250, h: 140 },
  companion: { w: 320, h: 220 },
};

function widgetPixelSize(mode: string): ContentSize {
  switch (mode) {
    case 'dot': return { w: 26, h: 26 };
    case 'card': return { w: 210, h: 110 };
    case 'companion': return { w: 280, h: 160 };
    default: return { w: 26, h: 26 };
  }
}

function calcMenuLayout(mode: string): { winW: number; winH: number; mx: number; my: number } {
  const { w: ww, h: wh } = widgetPixelSize(mode);

  if (mode === 'dot') {
    const mx = PAD + ww + GAP;
    const my = PAD;
    return {
      winW: mx + MENU_W + PAD,
      winH: Math.max(PAD + wh + PAD, my + MENU_H + PAD),
      mx,
      my,
    };
  }

  const mx = PAD;
  const my = PAD + wh + GAP;
  return {
    winW: Math.max(MODE_CONTENT[mode]?.w ?? 250, PAD + MENU_W + PAD),
    winH: my + MENU_H + PAD,
    mx,
    my,
  };
}

export function FloatingWidget() {
  const widgetMode = useConfigStore((s) => s.config.widgetMode);
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const prevSizeRef = useRef<ContentSize>({ w: 80, h: 80 });

  const applySize = useCallback((w: number, h: number) => {
    getCurrentWindow().setSize(new LogicalSize(w, h)).catch(() => {});
  }, []);

  // Resize window when mode changes (no menu open)
  useEffect(() => {
    if (menuOpen) return;
    const size = MODE_CONTENT[widgetMode] ?? MODE_CONTENT.dot;
    prevSizeRef.current = size;
    applySize(size.w, size.h);
  }, [widgetMode, menuOpen, applySize]);

  // Expand for menu / shrink when closed
  useEffect(() => {
    if (menuOpen) {
      const { winW, winH } = calcMenuLayout(widgetMode);
      applySize(winW, winH);
    } else {
      const size = MODE_CONTENT[widgetMode] ?? MODE_CONTENT.dot;
      applySize(size.w, size.h);
    }
  }, [menuOpen, widgetMode, applySize]);

  // Initial resize on mount
  useEffect(() => {
    const size = MODE_CONTENT[widgetMode] ?? MODE_CONTENT.dot;
    prevSizeRef.current = size;
    applySize(size.w, size.h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = useCallback(() => {
    getCurrentWindow().startDragging().catch(() => {});
  }, []);

  const openMainDashboard = useCallback(() => {
    invoke('show_dashboard').catch(() => {});
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

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const { mx, my } = calcMenuLayout(widgetMode);

  return (
    <div className="fixed inset-0 select-none">
      <div style={{ position: 'absolute', left: PAD, top: PAD }} onMouseDown={handleMouseDown}>
        {widgetMode === 'dot' && <DotMode onClick={handleClick} onContextMenu={handleContextMenu} />}
        {widgetMode === 'card' && <CardMode onClick={handleClick} onContextMenu={handleContextMenu} />}
        {widgetMode === 'companion' && <CompanionMode onClick={handleClick} onContextMenu={handleContextMenu} />}
      </div>
      {menuOpen && (
        <ContextMenu x={mx} y={my} onClose={handleCloseMenu} />
      )}
    </div>
  );
}

function ContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);

  const openDashboard = () => {
    invoke('show_dashboard').catch(() => {});
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
        className="absolute z-[10002] bg-white dark:bg-[#1f2937] rounded-lg shadow-xl border border-black/10 dark:border-white/10 py-1 min-w-[160px]"
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

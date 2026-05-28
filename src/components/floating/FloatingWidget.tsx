import { useState, useCallback, useEffect, useRef } from 'react';
import { useConfigStore } from '../../stores/configStore';
import { useUIStore } from '../../stores/uiStore';
import { DotMode } from './DotMode';
import { CardMode } from './CardMode';
import { CompanionMode } from './CompanionMode';

interface Position {
  x: number;
  y: number;
}

export function FloatingWidget() {
  const widgetMode = useConfigStore((s) => s.config.widgetMode);
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);
  const toggleDashboard = useUIStore((s) => s.toggleDashboard);
  const visible = useUIStore((s) => s.widgetVisible);

  const [pos, setPos] = useState<Position>({ x: window.screen.width - 80, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dragRef = useRef({ offsetX: 0, offsetY: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      dragRef.current = { offsetX: e.clientX - pos.x, offsetY: e.clientY - pos.y };
    },
    [pos],
  );

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - dragRef.current.offsetX, y: e.clientY - dragRef.current.offsetY });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleClick = useCallback(() => {
    if (dragging) return;
    if (widgetMode === 'dot') {
      setWidgetMode('card');
    } else {
      toggleDashboard();
    }
  }, [dragging, widgetMode, setWidgetMode, toggleDashboard]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed z-[9999] select-none" style={{ left: pos.x, top: pos.y }}>
      <div onMouseDown={handleMouseDown}>
        {widgetMode === 'dot' && <DotMode onClick={handleClick} onContextMenu={handleContextMenu} />}
        {widgetMode === 'card' && <CardMode onClick={handleClick} onContextMenu={handleContextMenu} />}
        {widgetMode === 'companion' && <CompanionMode onClick={handleClick} onContextMenu={handleContextMenu} />}
      </div>
      {menuOpen && (
        <ContextMenu
          x={pos.x}
          y={pos.y + 40}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

function ContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const setWidgetMode = useConfigStore((s) => s.setWidgetMode);
  const toggleDashboard = useUIStore((s) => s.toggleDashboard);

  const items = [
    { label: 'Dot Mode', action: () => setWidgetMode('dot') },
    { label: 'Card Mode', action: () => setWidgetMode('card') },
    { label: 'Companion', action: () => setWidgetMode('companion') },
    { label: '---', action: () => {} },
    { label: 'Dashboard', action: () => toggleDashboard() },
    { label: '---', action: () => {} },
    { label: 'Quit', action: () => {} },
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
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
    </>
  );
}

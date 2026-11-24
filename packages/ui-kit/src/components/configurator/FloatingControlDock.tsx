import React, { useEffect, useRef, type ReactNode, type CSSProperties, type KeyboardEvent } from 'react';

export interface DockTabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface FloatingControlDockProps {
  items: DockTabItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  activePopoverContent?: ReactNode;
  onClosePopover?: () => void;
  position?: 'bottom' | 'top';
  elevation?: 'ambient' | 'float';
  className?: string;
  style?: CSSProperties;
}

export const FloatingControlDock: React.FC<FloatingControlDockProps> = ({
  items,
  activeId,
  onSelect,
  activePopoverContent,
  onClosePopover,
  position = 'bottom',
  elevation = 'float',
  className = '',
  style
}) => {
  const dockRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && activePopoverContent && onClosePopover) {
        onClosePopover();
      }
    };
    if (activePopoverContent) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activePopoverContent, onClosePopover]);

  // Handle keyboard navigation across dock tabs
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let targetIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = items.length - 1;
    }

    if (targetIndex !== null && items[targetIndex] && !items[targetIndex].disabled) {
      onSelect(items[targetIndex].id);
      const buttons = dockRef.current?.querySelectorAll<HTMLButtonElement>('.vs-floating-dock__tab');
      if (buttons && buttons[targetIndex]) {
        buttons[targetIndex].focus();
      }
    }
  };

  return (
    <div
      className={`vs-floating-control-dock-wrapper vs-floating-control-dock-wrapper--${position} ${className}`.trim()}
      style={style}
    >
      {/* Expandable Popover Bubble */}
      {activePopoverContent && (
        <div
          ref={popoverRef}
          className="vs-floating-dock-popover-bubble"
          role="region"
          aria-label="Dock Tool Options"
        >
          <div className="vs-floating-dock-popover-bubble__header">
            <button
              type="button"
              className="vs-floating-dock-popover-bubble__close-btn"
              onClick={onClosePopover}
              aria-label="Close options"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="12" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="vs-floating-dock-popover-bubble__content">
            {activePopoverContent}
          </div>
        </div>
      )}

      {/* Main Pill Dock */}
      <nav
        ref={dockRef}
        className={`vs-floating-control-dock vs-floating-control-dock--elevation-${elevation}`}
        role="tablist"
        aria-label="Configurator Controls"
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={isActive && activePopoverContent ? `vs-dock-tabpanel-${item.id}` : undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              className={`vs-floating-dock__tab ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              {item.icon && <span className="vs-floating-dock__tab-icon">{item.icon}</span>}
              <span className="vs-floating-dock__tab-label">{item.label}</span>
              {item.badge !== undefined && (
                <span className="vs-floating-dock__tab-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

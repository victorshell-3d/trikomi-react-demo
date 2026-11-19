import React, { useEffect, useState, type ReactNode, type CSSProperties } from 'react';

export interface DrawerTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface GlassInspectorDrawerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  side?: 'right' | 'left';
  isOpen?: boolean;
  onClose?: () => void;
  collapsible?: boolean;
  tabs?: DrawerTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  footer?: ReactNode;
  children: ReactNode;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
}

export const GlassInspectorDrawer: React.FC<GlassInspectorDrawerProps> = ({
  title,
  subtitle,
  side = 'right',
  isOpen = true,
  onClose,
  collapsible = true,
  tabs,
  activeTab,
  onTabChange,
  footer,
  children,
  width = 360,
  className = '',
  style
}) => {
  const [collapsed, setCollapsed] = useState(!isOpen);

  useEffect(() => {
    setCollapsed(!isOpen);
  }, [isOpen]);

  // Handle Escape key to close/collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !collapsed) {
        if (onClose) {
          onClose();
        } else if (collapsible) {
          setCollapsed(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, onClose, collapsible]);

  const toggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (nextState && onClose) {
      onClose();
    }
  };

  const parsedWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <aside
      className={`vs-glass-inspector-drawer vs-glass-inspector-drawer--${side} ${collapsed ? 'is-collapsed' : ''} ${className}`.trim()}
      role="region"
      aria-label={typeof title === 'string' ? title : 'Configuration Inspector'}
      aria-expanded={!collapsed}
      style={{
        ...style,
        ...(collapsed ? {} : { width: parsedWidth })
      }}
    >
      {/* Mobile Drag Handle */}
      <div className="vs-inspector-drawer__mobile-handle" aria-hidden="true" onClick={toggleCollapse} />

      {/* Header */}
      <div className="vs-inspector-drawer__header">
        <div className="vs-inspector-drawer__header-titles">
          <h2 className="vs-inspector-drawer__title">{title}</h2>
          {subtitle && <p className="vs-inspector-drawer__subtitle">{subtitle}</p>}
        </div>

        {collapsible && (
          <button
            type="button"
            className="vs-inspector-drawer__collapse-btn"
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand inspector panel' : 'Collapse inspector panel'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              aria-hidden="true"
              style={{
                transform: collapsed
                  ? side === 'right' ? 'rotate(180deg)' : 'rotate(0deg)'
                  : side === 'right' ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.25s ease'
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && !collapsed && (
        <div className="vs-inspector-drawer__tabs" role="tablist" aria-label="Inspector Sections">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`vs-inspector-drawer__tab ${isActive ? 'is-active' : ''}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.icon && <span className="vs-inspector-drawer__tab-icon">{tab.icon}</span>}
                <span className="vs-inspector-drawer__tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable Body Content */}
      {!collapsed && (
        <div className="vs-inspector-drawer__body">
          {children}
        </div>
      )}

      {/* Footer */}
      {footer && !collapsed && (
        <div className="vs-inspector-drawer__footer">
          {footer}
        </div>
      )}
    </aside>
  );
};

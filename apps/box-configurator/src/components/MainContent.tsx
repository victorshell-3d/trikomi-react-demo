import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Editor2D } from './Editor2D';
import { ThreeCanvas } from './ThreeCanvas';

export interface MainContentProps {
  viewMode?: '2d' | '3d' | 'split';
  onViewModeChange?: (mode: '2d' | '3d' | 'split') => void;
}

export const MainContent: React.FC<MainContentProps> = observer(({
  viewMode: controlledViewMode,
  onViewModeChange
}) => {
  const [internalViewMode, setInternalViewMode] = useState<'2d' | '3d' | 'split'>('split');
  const activeViewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

  const handleModeChange = (mode: '2d' | '3d' | 'split') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // Recalculate canvas sizes when view mode (2D, 3D, or Split) changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(timer);
  }, [activeViewMode]);

  return (
    <div className="main-content" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Floating View Switcher */}
      <div
        className="vs-box-view-switcher"
        style={{
          position: 'absolute',
          top: '72px',
          left: '20px',
          zIndex: 30,
          display: 'flex',
          gap: '4px',
          padding: '4px',
          borderRadius: '999px',
          background: 'rgba(23, 20, 39, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        {(['2d', 'split', '3d'] as const).map((mode) => {
          const isActive = activeViewMode === mode;
          const label = mode === '2d' ? '2D Layout' : mode === 'split' ? 'Split View' : '3D Mockup';
          return (
            <button
              key={mode}
              type="button"
              className={`vs-box-view-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => handleModeChange(mode)}
              style={{
                border: 'none',
                background: isActive ? 'var(--vs-primary, #4338ca)' : 'transparent',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div
        className="editor-2d-wrapper"
        style={{ display: activeViewMode === '3d' ? 'none' : 'block' }}
      >
        <Editor2D />
      </div>
      <div
        className="canvas-container"
        style={{ display: activeViewMode === '2d' ? 'none' : 'block' }}
      >
        <ThreeCanvas />
      </div>
    </div>
  );
});

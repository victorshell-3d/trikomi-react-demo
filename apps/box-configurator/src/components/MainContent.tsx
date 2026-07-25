import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Editor2D } from './Editor2D';
import { ThreeCanvas } from './ThreeCanvas';

export const MainContent = observer(() => {
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'split'>('split');

  // Recalculate canvas sizes when view mode (2D, 3D, or Split) changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(timer);
  }, [viewMode]);

  return (
    <div className="main-content">
      {/* Floating View Switcher */}
      <div className="view-switcher-container">
        <button
          className={`view-switcher-btn ${viewMode === '2d' ? 'active' : ''}`}
          onClick={() => setViewMode('2d')}
        >
          2D Layout
        </button>
        <button
          className={`view-switcher-btn ${viewMode === 'split' ? 'active' : ''}`}
          onClick={() => setViewMode('split')}
        >
          Split View
        </button>
        <button
          className={`view-switcher-btn ${viewMode === '3d' ? 'active' : ''}`}
          onClick={() => setViewMode('3d')}
        >
          3D Mockup
        </button>
      </div>
      <div
        className="editor-2d-wrapper"
        style={{ display: viewMode === '3d' ? 'none' : 'block' }}
      >
        <Editor2D />
      </div>
      <div
        className="canvas-container"
        style={{ display: viewMode === '2d' ? 'none' : 'block' }}
      >
        <ThreeCanvas />
      </div>
    </div>
  );
});

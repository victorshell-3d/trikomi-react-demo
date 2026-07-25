import React from 'react';
import { observer } from 'mobx-react-lite';
import { useViewerStore, ThreeViewer, OrbitControlsPlugin } from '@trikomi/core';

declare global {
  interface Window {
    __THREE_VIEWER_INSTANCE__?: ThreeViewer;
  }
}

export const CameraViews: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  const handleSetView = (axis: 'X' | '-X' | 'Y' | '-Y' | 'Z' | '-Z') => {
    const viewer = viewerStore.viewer as ThreeViewer;
    if (viewer) {
      const controlsPlugin = viewer.getPlugin(OrbitControlsPlugin);
      if (controlsPlugin) {
        controlsPlugin.setView(axis);
      }
    }
  };

  if (!viewerStore.showCameraViews) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '4px',
      background: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Camera Views
      </div>
      
      <button className="view-btn" onClick={() => handleSetView('Y')} title="Top (Y)">Top</button>
      <button className="view-btn" onClick={() => handleSetView('-Z')} title="Back (-Z)">Back</button>
      <button className="view-btn" onClick={() => handleSetView('-X')} title="Left (-X)">Left</button>
      
      <button className="view-btn" onClick={() => handleSetView('-Y')} title="Bottom (-Y)">Bot</button>
      <button className="view-btn" onClick={() => handleSetView('Z')} title="Front (Z)">Front</button>
      <button className="view-btn" onClick={() => handleSetView('X')} title="Right (X)">Right</button>

      <style>{`
        .view-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #eee;
          padding: 6px 4px;
          font-size: 11px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 44px;
        }
        .view-btn:hover {
          background: rgba(79, 143, 255, 0.2);
          border-color: #4f8fff;
          color: white;
        }
      `}</style>
    </div>
  );
});

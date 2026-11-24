import React, { type ReactNode, type CSSProperties } from 'react';

export interface CameraPreset {
  label: string;
  onClick: () => void;
  active?: boolean;
}

export interface CanvasControlToolbarProps {
  position?: 'bottom-center' | 'bottom-right' | 'top-right' | 'bottom-left';
  orientation?: 'horizontal' | 'vertical';
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRecenter?: () => void;
  onResetView?: () => void;
  onToggleGrid?: () => void;
  isGridActive?: boolean;
  onToggleWireframe?: () => void;
  isWireframeActive?: boolean;
  onCapture?: () => void;
  cameraPresets?: CameraPreset[];
  extraActions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const CanvasControlToolbar: React.FC<CanvasControlToolbarProps> = ({
  position = 'bottom-right',
  orientation = 'horizontal',
  onZoomIn,
  onZoomOut,
  onRecenter,
  onResetView,
  onToggleGrid,
  isGridActive = false,
  onToggleWireframe,
  isWireframeActive = false,
  onCapture,
  cameraPresets,
  extraActions,
  className = '',
  style
}) => {
  return (
    <div
      className={`vs-canvas-control-toolbar vs-canvas-control-toolbar--${position} vs-canvas-control-toolbar--${orientation} ${className}`.trim()}
      role="toolbar"
      aria-label="3D Viewport Controls"
      style={style}
    >
      {/* Zoom In Button */}
      {onZoomIn && (
        <button
          type="button"
          onClick={onZoomIn}
          className="vs-canvas-toolbar__btn"
          aria-label="Zoom in"
          title="Zoom In"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Zoom Out Button */}
      {onZoomOut && (
        <button
          type="button"
          onClick={onZoomOut}
          className="vs-canvas-toolbar__btn"
          aria-label="Zoom out"
          title="Zoom Out"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Recenter Camera */}
      {(onRecenter || onResetView) && (
        <button
          type="button"
          onClick={onRecenter || onResetView}
          className="vs-canvas-toolbar__btn"
          aria-label="Recenter camera view"
          title="Recenter Camera"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}

      {/* Divider */}
      {(onToggleGrid || onToggleWireframe || onCapture || (cameraPresets && cameraPresets.length > 0)) && (
        <div className="vs-canvas-toolbar__divider" aria-hidden="true" />
      )}

      {/* Grid Toggle */}
      {onToggleGrid && (
        <button
          type="button"
          onClick={onToggleGrid}
          className={`vs-canvas-toolbar__btn ${isGridActive ? 'is-active' : ''}`}
          aria-label={isGridActive ? 'Hide floor grid' : 'Show floor grid'}
          aria-pressed={isGridActive}
          title="Toggle Grid"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
        </button>
      )}

      {/* Wireframe Toggle */}
      {onToggleWireframe && (
        <button
          type="button"
          onClick={onToggleWireframe}
          className={`vs-canvas-toolbar__btn ${isWireframeActive ? 'is-active' : ''}`}
          aria-label={isWireframeActive ? 'Hide wireframe' : 'Show wireframe'}
          aria-pressed={isWireframeActive}
          title="Toggle Wireframe"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
            <polygon points="12 2 2 8.5 12 15 22 8.5 12 2" />
            <polyline points="2 15.5 12 22 22 15.5" />
          </svg>
        </button>
      )}

      {/* Snapshot / Capture */}
      {onCapture && (
        <button
          type="button"
          onClick={onCapture}
          className="vs-canvas-toolbar__btn"
          aria-label="Capture snapshot"
          title="Take Snapshot"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
      )}

      {/* Camera Presets */}
      {cameraPresets && cameraPresets.length > 0 && (
        <div className="vs-canvas-toolbar__presets">
          {cameraPresets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={preset.onClick}
              className={`vs-canvas-toolbar__preset-btn ${preset.active ? 'is-active' : ''}`}
              aria-label={`Switch to ${preset.label} view`}
              title={preset.label}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Extra Custom Actions */}
      {extraActions}
    </div>
  );
};

import React, { useState } from 'react';
import { useLocalImage } from '../hooks/useLocalImage';

const FloorPlanMap = ({ tourId, settings, scenes, currentSceneId, onSceneSelect }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredSceneId, setHoveredSceneId] = useState(null);
  const floorPlan = settings?.floorPlan;
  const localImageUrl = useLocalImage(tourId, floorPlan?.image);

  if (!floorPlan?.enabled || !floorPlan?.image) return null;

  if (isMinimized) {
    return (
      <div className="floorplan-toggle-btn" onClick={() => setIsMinimized(false)} title="Show Floor Plan">
        <span>🗺️</span>
      </div>
    );
  }

  return (
    <div className="floorplan-minimap">
      <div className="floorplan-minimap-head">
        <span>Floor Plan</span>
        <button onClick={() => setIsMinimized(true)} className="modal-close-btn" style={{ fontSize: '0.8rem', padding: 2 }} title="Minimize">
          ▼
        </button>
      </div>
      <div className="floorplan-minimap-body">
        {localImageUrl ? (
          <img src={localImageUrl} alt="Floor Plan" />
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Loading map…</div>
        )}

        {localImageUrl && scenes.map(scene => {
          if (!scene.floorPlanPosition) return null;
          const isActive = scene.id === currentSceneId;
          const isHovered = hoveredSceneId === scene.id;
          return (
            <div
              key={scene.id}
              onClick={(e) => { e.stopPropagation(); if (!isActive && onSceneSelect) onSceneSelect(scene); }}
              onMouseEnter={() => setHoveredSceneId(scene.id)}
              onMouseLeave={() => setHoveredSceneId(null)}
              className={`map-dot${isActive ? ' active' : ''}`}
              style={{ left: `${scene.floorPlanPosition.x}%`, top: `${scene.floorPlanPosition.y}%` }}
              title={scene.name}
            >
              {isHovered && (
                <div className="tooltip" style={{ bottom: '100%', left: '50%', marginBottom: 6 }}>
                  {scene.name}
                  <div className="tooltip-arrow"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlanMap;

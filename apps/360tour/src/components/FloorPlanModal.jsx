import React, { useState, useRef, useEffect } from 'react';
import { uploadApi } from '../api/dashboardApi';
import { useLocalImage } from '../hooks/useLocalImage';
import ImageSelectDialog from './ImageSelectDialog';

const FloorPlanModal = ({
  isOpen,
  onClose,
  tourId,
  tourSettings,
  onUpdateSettings,
  scenes,
  onUpdateScene
}) => {
  const [_uploading, setUploading] = useState(false);
  const [activeToolSceneId, setActiveToolSceneId] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen && scenes && scenes.length > 0 && !activeToolSceneId) {
      setActiveToolSceneId(scenes[0].id);
    }
  }, [isOpen, scenes]);

  const floorPlan = tourSettings?.floorPlan || { enabled: false, image: '' };
  const localImageUrl = useLocalImage(tourId, floorPlan.image);

  if (!isOpen) return null;

  const handleToggle = async () => {
    await onUpdateSettings({
      ...tourSettings,
      floorPlan: { ...floorPlan, enabled: !floorPlan.enabled }
    });
  };

  const _handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.uploadInfoImage(tourId, file);
      await onUpdateSettings({
        ...tourSettings,
        floorPlan: { ...floorPlan, image: result.url }
      });
    } catch (err) {
      console.error('Failed to upload floor plan image:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageClick = async (e) => {
    if (!imageRef.current || !activeToolSceneId) return;
    const rect = imageRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    await onUpdateScene(activeToolSceneId, { floorPlanPosition: { x: xPct, y: yPct } });
  };

  const handleClearPosition = async (sceneId) => {
    await onUpdateScene(sceneId, { floorPlanPosition: null });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-full" style={{ height: '90vh' }}>
        {/* Header */}
        <div className="modal-head">
          <span className="modal-head-title">🗺️ Floor Plan Manager</span>
          <div className="flex items-center gap-3">
            <div className="settings-row" style={{ padding: 0 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginRight: 8 }}>Enable Minimap</span>
              <div
                className={`toggle-switch${floorPlan.enabled ? ' active' : ''}`}
                onClick={handleToggle}
              />
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="floorplan-editor">
          {/* Left: Scene List */}
          <div className="floorplan-scene-list">
            <div className="floorplan-scene-list-header">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="btn btn-secondary btn-sm w-full"
                style={{ marginTop: 4 }}
              >
                Select / Upload Map
              </button>
            </div>
            <div className="floorplan-scene-list-help">
              1. Select a scene below.<br />
              2. Click on the map to place it.
            </div>
            <div className="floorplan-scene-list-items">
              {scenes.map((scene, idx) => {
                const isSelected = activeToolSceneId === scene.id;
                const isPlaced = !!scene.floorPlanPosition;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveToolSceneId(scene.id)}
                    className={`fp-scene-item${isSelected ? ' active' : ''}`}
                  >
                    <div className="fp-scene-left">
                      <div className={`fp-dot ${isPlaced ? 'placed' : 'unplaced'}`} title={isPlaced ? 'Placed' : 'Not Placed'} />
                      <span className="fp-scene-name">{idx + 1}. {scene.name}</span>
                    </div>
                    {isPlaced && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClearPosition(scene.id); }}
                        className="fp-clear-btn"
                        title="Clear Position"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Map Canvas */}
          <div className="floorplan-canvas">
            {!floorPlan.image ? (
              <div className="floorplan-empty">
                <div className="floorplan-empty-icon">🗺️</div>
                <p style={{ marginBottom: 4 }}>No floor plan image uploaded.</p>
                <p style={{ fontSize: '0.75rem' }}>Upload an image from the sidebar to begin mapping scenes.</p>
              </div>
            ) : !localImageUrl ? (
              <div style={{ color: 'var(--color-text-muted)' }}>Loading map image…</div>
            ) : (
              <div className="floorplan-canvas-image">
                <img
                  ref={imageRef}
                  src={localImageUrl}
                  alt="Floor Plan"
                  onClick={handleImageClick}
                  draggable={false}
                />
                {scenes.map(scene => {
                  if (!scene.floorPlanPosition) return null;
                  const isSelected = scene.id === activeToolSceneId;
                  return (
                    <div
                      key={scene.id}
                      onClick={(e) => { e.stopPropagation(); setActiveToolSceneId(scene.id); }}
                      className={`floorplan-marker${isSelected ? ' selected' : ''}`}
                      style={{ left: `${scene.floorPlanPosition.x}%`, top: `${scene.floorPlanPosition.y}%` }}
                      title={scene.name}
                    >
                      {scenes.indexOf(scene) + 1}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </div>
      </div>
      <ImageSelectDialog 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        tourId={tourId} 
        onImageSelect={async (image) => {
          await onUpdateSettings({
            ...tourSettings,
            floorPlan: { ...floorPlan, image: image.url }
          });
          setGalleryOpen(false);
        }} 
      />
    </div>
  );
};

export default FloorPlanModal;

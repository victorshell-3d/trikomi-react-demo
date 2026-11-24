import React, { useState, useRef, useEffect } from 'react';
import { uploadApi } from '../api/dashboardApi';
import { useLocalImage } from '../hooks/useLocalImage';
import { FrostedModalDialog } from '@trikomi/ui-kit';
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
    <>
      <FrostedModalDialog
        isOpen={isOpen}
        onClose={onClose}
        title="🗺️ Floor Plan Manager"
        subtitle="Place scene navigation dots on your 2D architectural map"
        size="xl"
        className="vs-floorplan-modal-dialog"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--vs-ink-muted)', fontWeight: 600 }}>Enable In Viewer:</span>
              <button
                type="button"
                className={`vs-btn vs-btn-sm ${floorPlan.enabled ? 'vs-btn-primary' : 'vs-btn-secondary'}`}
                onClick={handleToggle}
              >
                {floorPlan.enabled ? 'Minimap Enabled' : 'Minimap Disabled'}
              </button>
            </div>
            <button
              type="button"
              className="vs-btn vs-btn-secondary"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        }
      >
        <div className="floorplan-editor" style={{ display: 'flex', gap: '16px', minHeight: '480px' }}>
          {/* Left: Scene List */}
          <div className="floorplan-scene-list" style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="floorplan-scene-list-header">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="vs-btn vs-btn-primary vs-btn-sm"
                style={{ width: '100%' }}
              >
                Select / Upload Map
              </button>
            </div>
            <div className="floorplan-scene-list-help" style={{ fontSize: '0.75rem', color: 'var(--vs-ink-muted)', padding: '6px 0' }}>
              1. Select a scene below.<br />
              2. Click on the map to place it.
            </div>
            <div className="floorplan-scene-list-items" style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '360px' }}>
              {scenes.map((scene, idx) => {
                const isSelected = activeToolSceneId === scene.id;
                const isPlaced = !!scene.floorPlanPosition;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveToolSceneId(scene.id)}
                    className={`fp-scene-item${isSelected ? ' active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isSelected ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="fp-scene-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className={`fp-dot ${isPlaced ? 'placed' : 'unplaced'}`} title={isPlaced ? 'Placed' : 'Not Placed'} />
                      <span className="fp-scene-name" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--vs-ink)' }}>{idx + 1}. {scene.name}</span>
                    </div>
                    {isPlaced && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClearPosition(scene.id); }}
                        className="fp-clear-btn"
                        title="Clear Position"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--vs-crimson)' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Map Canvas */}
          <div className="floorplan-canvas" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            {!floorPlan.image ? (
              <div className="floorplan-empty" style={{ textAlign: 'center', padding: '32px' }}>
                <div className="floorplan-empty-icon" style={{ fontSize: '2rem' }}>🗺️</div>
                <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>No floor plan image uploaded.</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--vs-ink-muted)' }}>Upload an image from the sidebar to begin mapping scenes.</p>
              </div>
            ) : !localImageUrl ? (
              <div style={{ color: 'var(--vs-ink-muted)' }}>Loading map image…</div>
            ) : (
              <div className="floorplan-canvas-image" style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
                <img
                  ref={imageRef}
                  src={localImageUrl}
                  alt="Floor Plan"
                  onClick={handleImageClick}
                  draggable={false}
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '440px', objectFit: 'contain', cursor: 'crosshair' }}
                />
                {scenes.map(scene => {
                  if (!scene.floorPlanPosition) return null;
                  const isSelected = scene.id === activeToolSceneId;
                  return (
                    <div
                      key={scene.id}
                      onClick={(e) => { e.stopPropagation(); setActiveToolSceneId(scene.id); }}
                      className={`floorplan-marker${isSelected ? ' selected' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${scene.floorPlanPosition.x}%`,
                        top: `${scene.floorPlanPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--vs-primary)' : '#10B981',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer'
                      }}
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
      </FrostedModalDialog>

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
    </>
  );
};

export default FloorPlanModal;

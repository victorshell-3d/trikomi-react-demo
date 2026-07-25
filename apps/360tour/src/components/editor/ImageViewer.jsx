import ImageWithHotspots from './ImageWithHotspots';

const modeBarStyle = {
  position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
  padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem',
  zIndex: 30, display: 'flex', alignItems: 'center', gap: 8,
  color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid var(--color-panel-border)',
};

const toolBtnStyle = {
  width: 26, height: 26, borderRadius: 'var(--radius-sm)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.75rem', cursor: 'pointer', border: 'none',
  color: '#fff', transition: 'var(--transition-smooth)',
};

const ImageViewer = ({
  tourId, activeScene, uploading, _onUpload, error,
  leftSidebarOpen, rightSidebarOpen,
  onToggleLeftSidebar, onToggleRightSidebar,
  onBack, onShowProperties, onPreview, onExport,
  hotspotCreationMode, shapeCreationMode, audioPointCreationMode, initialViewCreationMode,
  currentShape, onImageClick, onShapeClick,
  onCancelHotspotCreation, onCancelShapeCreation, onCancelAudioPointCreation, onCancelInitialViewCreation,
  _fileInputKey, onOpenImageDialog
}) => {
  return (
    <div className="editor-canvas" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Mode Indicators */}
      {hotspotCreationMode && (
        <div style={{ ...modeBarStyle, background: 'rgba(99,102,241,0.85)' }}>
          <span>Click on image to place hotspot</span>
          <button onClick={onCancelHotspotCreation} style={{ ...toolBtnStyle, background: 'rgba(255,255,255,0.2)' }}>✕</button>
        </div>
      )}
      {audioPointCreationMode && (
        <div style={{ ...modeBarStyle, background: 'rgba(37,99,235,0.85)' }}>
          <span>Click on image to place audio point</span>
          <button onClick={onCancelAudioPointCreation} style={{ ...toolBtnStyle, background: 'rgba(255,255,255,0.2)' }}>✕</button>
        </div>
      )}
      {shapeCreationMode && (
        <div style={{ ...modeBarStyle, background: 'rgba(234,88,12,0.85)' }}>
          <span>Click on image to add shape points</span>
          <button onClick={onCancelShapeCreation} style={{ ...toolBtnStyle, background: 'rgba(255,255,255,0.2)' }}>✕</button>
        </div>
      )}
      {initialViewCreationMode && (
        <div style={{ ...modeBarStyle, background: 'rgba(16,185,129,0.85)' }}>
          <span>Click on image to set initial view</span>
          <button onClick={onCancelInitialViewCreation} style={{ ...toolBtnStyle, background: 'rgba(255,255,255,0.2)' }}>✕</button>
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        {error && !hotspotCreationMode && (
          <div className="error-bar" style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: 'auto' }}>
            {error}
          </div>
        )}

        {/* Top-Left Toolbar */}
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={onToggleLeftSidebar} style={{ ...toolBtnStyle, background: 'var(--color-panel)' }} title={leftSidebarOpen ? 'Hide Scenes' : 'Show Scenes'}>☰</button>
          <button onClick={onBack} style={{ ...toolBtnStyle, background: 'var(--color-panel)' }} title="Back">←</button>
          {activeScene && (
            <button onClick={onShowProperties} style={{ ...toolBtnStyle, background: 'var(--color-panel)' }} title="Scene Properties">⚙️</button>
          )}
          {onPreview && (
            <button onClick={onPreview} style={{ ...toolBtnStyle, background: 'rgba(16,185,129,0.7)' }} title="Preview Tour">👁️</button>
          )}
          {onExport && (
            <button onClick={onExport} style={{ ...toolBtnStyle, background: 'rgba(37,99,235,0.7)' }} title="Export Tour">📦</button>
          )}
        </div>

        {/* Top-Right Info */}
        {activeScene && (
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ background: 'var(--color-panel)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-panel-border)' }}>
              <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 500 }}>{activeScene.name}</span>
            </div>
            <button onClick={onToggleRightSidebar} style={{ ...toolBtnStyle, background: 'var(--color-panel)' }} title={rightSidebarOpen ? 'Hide Editor' : 'Show Editor'}>✎</button>
          </div>
        )}

        {activeScene ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!activeScene.panorama ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="empty-state" style={{ border: '2px dashed var(--color-panel-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
                  <div className="empty-state-icon">📸</div>
                  <h3 className="empty-state-title">Select 360° Panorama</h3>
                  <p className="empty-state-text">Equirectangular image</p>
                  <button 
                    onClick={onOpenImageDialog} 
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    Select / Upload Image
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, background: '#000', overflow: 'hidden', position: 'relative' }} id="panorama-container">
                <ImageWithHotspots
                  tourId={tourId}
                  panorama={activeScene.panorama}
                  hotspots={activeScene.hotspots}
                  shapes={activeScene.shapes}
                  audio_points={activeScene.audio_points || []}
                  hotspotCreationMode={hotspotCreationMode}
                  shapeCreationMode={shapeCreationMode}
                  audioPointCreationMode={audioPointCreationMode}
                  currentShape={currentShape}
                  onImageClick={onImageClick}
                  onShapeClick={onShapeClick}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.85rem' }}>No scene selected</p>
            <p style={{ fontSize: '0.75rem' }}>Add a scene to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;

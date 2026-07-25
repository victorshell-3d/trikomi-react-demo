import { sceneApi } from '../../api/dashboardApi';

const ScenePropertiesModal = ({ isOpen, onClose, activeScene, tourId, setActiveScene, uploading, onOpenPanoramaDialog, onSetInitialView }) => {
  if (!isOpen || !activeScene) return null;

  const handleNameChange = (e) => {
    const updated = { ...activeScene, name: e.target.value };
    setActiveScene(updated);
  };

  const handleNameBlur = (e) => {
    sceneApi.updateScene(tourId, activeScene.id, { name: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    const updated = { ...activeScene, description: e.target.value };
    setActiveScene(updated);
  };

  const handleDescriptionBlur = (e) => {
    sceneApi.updateScene(tourId, activeScene.id, { description: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-sm">
        <div className="modal-head">
          <span className="modal-head-title">Scene Properties</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 12 }}>
            <label className="label">Scene Name</label>
            <input type="text" value={activeScene.name} onChange={handleNameChange} onBlur={handleNameBlur} className="input-field" />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="label">Description</label>
            <textarea
              value={activeScene.description || ''}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              className="input-field"
              placeholder="Add description..."
              rows={2}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Panorama</label>
            <button onClick={onOpenPanoramaDialog} className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center' }} disabled={uploading}>
              {uploading ? 'Uploading…' : '📷 Replace'}
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Initial View</label>
            {activeScene.initial_view ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                Yaw: {parseFloat(activeScene.initial_view.yaw).toFixed(1)}°, Pitch: {parseFloat(activeScene.initial_view.pitch).toFixed(1)}°
              </div>
            ) : null}
            <button className="btn btn-secondary btn-sm w-full" onClick={onSetInitialView} style={{ justifyContent: 'center' }}>
              🎯 Set Initial View
            </button>
          </div>

          <hr className="divider" />

          <div style={{ marginTop: 12 }}>
            <span className="section-label">Stats</span>
            <div className="flex gap-2" style={{ marginTop: 8 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-panel-border)', borderRadius: 'var(--radius-sm)', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{activeScene.hotspots?.length || 0}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Hotspots</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-panel-border)', borderRadius: 'var(--radius-sm)', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{activeScene.shapes?.length || 0}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Shapes</div>
              </div>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 8 }}>
              {activeScene.image_width || '?'} × {activeScene.image_height || '?'}
            </p>
          </div>
        </div>
        <div className="modal-foot">
          <button onClick={onClose} className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ScenePropertiesModal;

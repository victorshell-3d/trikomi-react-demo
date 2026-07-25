import { useState } from 'react';
import { uploadApi } from '../../api/dashboardApi';
import { useLocalImage } from '../../hooks/useLocalImage';
import MiniSphereViewer from './MiniSphereViewer';
import ImageSelectDialog from '../ImageSelectDialog';

const AddHotspotModal = ({ isOpen, onClose, onAdd, scenes, currentSceneId, yaw, pitch, tourId }) => {
  const [title, setTitle] = useState('');
  const [targetSceneId, setTargetSceneId] = useState('');
  const [targetYaw, setTargetYaw] = useState(0);
  const [type, setType] = useState('scene');
  const [iconUrl, setIconUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [capturedThumbnail, setCapturedThumbnail] = useState(null);
  const [autoThumbnail, setAutoThumbnail] = useState(true);
  const [customThumbnail, setCustomThumbnail] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState(null);

  const targetScene = type === 'scene' && targetSceneId ? scenes.find(s => s.id === targetSceneId) : null;
  const localIconUrl = useLocalImage(tourId, iconUrl);
  const localTargetPanoramaUrl = useLocalImage(tourId, targetScene?.panorama);

  if (!isOpen) return null;

  const availableScenes = scenes.filter(s => s.id !== currentSceneId);

  const _handleUploadIcon = async (e) => {
    const file = e.target.files[0];
    if (!file || !tourId) return;
    try {
      setUploading(true);
      setError('');
      const url = await uploadApi.uploadAsset(tourId, file);
      setIconUrl(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (type === 'scene' && !targetSceneId) return;

    const targetScene = type === 'scene' ? availableScenes.find(s => s.id === targetSceneId) : null;

    onAdd({
      title: title.trim(),
      type,
      yaw,
      pitch,
      icon_url: iconUrl,
      target_scene_id: type === 'scene' ? targetSceneId : null,
      target_yaw: type === 'scene' ? targetYaw : undefined,
      auto_thumbnail: type === 'scene' ? autoThumbnail : undefined,
      thumbnail: type === 'scene' ? (autoThumbnail ? capturedThumbnail : (customThumbnail || (targetScene ? (targetScene.thumbnail || targetScene.thumbnail_url) : null))) : null
    });

    setTitle('');
    setTargetSceneId('');
    setType('scene');
    setIconUrl(null);
    setCapturedThumbnail(null);
    setCustomThumbnail(null);
    setAutoThumbnail(true);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-sm">
        <div className="modal-head">
          <span className="modal-head-title">Add Hotspot</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-bar">{error}</div>}
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
            Position: {yaw.toFixed(1)}°, {pitch.toFixed(1)}°
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g., Go to Kitchen" autoFocus />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="label">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                <option value="scene">🔗 Link to Scene</option>
                <option value="info">ℹ️ Info</option>
                <option value="url">🌐 URL</option>
              </select>
            </div>

            {type === 'scene' && (
              <div style={{ marginBottom: 12 }}>
                <label className="label">Target Scene</label>
                <select value={targetSceneId} onChange={(e) => setTargetSceneId(e.target.value)} className="input-field" required>
                  <option value="">Select a scene...</option>
                  {availableScenes.map(scene => (
                    <option key={scene.id} value={scene.id}>{scene.name}</option>
                  ))}
                </select>
                {availableScenes.length === 0 && (
                  <p style={{ fontSize: '0.65rem', color: 'var(--color-danger)', marginTop: 4 }}>
                    No other scenes available. Create more scenes first.
                  </p>
                )}
                
                {targetSceneId && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                      <input 
                        type="checkbox" 
                        id="autoThumbnail" 
                        checked={autoThumbnail} 
                        onChange={(e) => setAutoThumbnail(e.target.checked)}
                      />
                      <label htmlFor="autoThumbnail" style={{ fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>Auto Thumbnail (Dynamic from view direction)</label>
                    </div>

                    {autoThumbnail ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <label className="label" style={{ marginBottom: 0 }}>Target View Direction</label>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{targetYaw}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="-180" 
                          max="180" 
                          value={targetYaw} 
                          onChange={(e) => setTargetYaw(Number(e.target.value))}
                          className="slider"
                          style={{ width: '100%', marginBottom: 12 }}
                        />
                        {(() => {
                          return targetScene && localTargetPanoramaUrl ? <MiniSphereViewer imageUrl={localTargetPanoramaUrl} targetYaw={targetYaw} onCapture={setCapturedThumbnail} /> : null;
                        })()}
                      </>
                    ) : (
                      <div style={{ marginBottom: 12, padding: 12, background: 'var(--color-bg-sidebar)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <label className="label" style={{ marginBottom: 6 }}>Custom Thumbnail</label>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                          {customThumbnail ? (
                            <img src={customThumbnail.startsWith('http') || customThumbnail.startsWith('data:') || customThumbnail.startsWith('./') ? customThumbnail : `./images/${customThumbnail}`} alt="Custom Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>None</div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <button type="button" onClick={() => { setGalleryTarget('thumbnail'); setGalleryOpen(true); }} className="btn btn-secondary btn-sm">Select / Upload Thumbnail</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <label className="label">Custom Icon (Optional)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {localIconUrl && (
                  <div className="list-thumb" style={{ width: 32, height: 32, borderRadius: '50%' }}>
                    <img src={localIconUrl} alt="Icon" />
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={() => { setGalleryTarget('icon'); setGalleryOpen(true); }} 
                  className="btn btn-secondary btn-sm"
                >
                  Select / Upload Icon
                </button>
              </div>
            </div>

            <div className="flex gap-2" style={{ marginTop: 16 }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button
                type="submit"
                disabled={uploading || (type === 'scene' && (!targetSceneId || availableScenes.length === 0))}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {uploading ? 'Uploading...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ImageSelectDialog 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        tourId={tourId} 
        onImageSelect={(image) => {
          if (galleryTarget === 'icon') {
            setIconUrl(image.url);
          } else if (galleryTarget === 'thumbnail') {
            setCustomThumbnail(image.url);
          }
          setGalleryOpen(false);
        }} 
      />
    </div>
  );
};

export default AddHotspotModal;

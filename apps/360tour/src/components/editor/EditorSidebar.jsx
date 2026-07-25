import { useState, useEffect } from 'react';
import { uploadApi as _uploadApi } from '../../api/dashboardApi';
import { useLocalImage } from '../../hooks/useLocalImage';
import ImageSelectDialog from '../ImageSelectDialog';

const AudioPreview = ({ tourId, url }) => {
  const localUrl = useLocalImage(tourId, url);
  if (!localUrl) return <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Loading…</p>;
  return <audio src={localUrl} controls style={{ width: '100%', height: 24 }} />;
};

import MiniSphereViewer from './MiniSphereViewer';

const HotspotThumbnail = ({ tourId, url, style }) => {
  const localUrl = useLocalImage(tourId, url);
  if (!localUrl) return <span style={{ fontSize: '0.85rem' }}>🌐</span>;
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return <video src={localUrl} muted loop autoPlay playsInline style={style} />;
  }
  if (url.endsWith('.mp3') || url.endsWith('.wav')) {
    return <audio src={localUrl} controls style={{ width: '100%' }} />;
  }
  return <img src={localUrl} alt="Thumbnail" style={style} />;
};

const HotspotDirectionEditor = ({ tourId, hotspot, scenes, onUpdate }) => {
  const [localYaw, setLocalYaw] = useState(hotspot.target_yaw || 0);
  const [capturedThumbnail, setCapturedThumbnail] = useState(null);
  const targetScene = scenes.find(s => s.id === hotspot.target_scene_id);
  const localTargetPanoramaUrl = useLocalImage(tourId, targetScene?.panorama);

  // Sync state if hotspot changes
  useEffect(() => {
    setLocalYaw(hotspot.target_yaw || 0);
    setCapturedThumbnail(null);
  }, [hotspot.id, hotspot.target_yaw]);

  // Debounced Auto-Save
  useEffect(() => {
    const yawChanged = localYaw !== (hotspot.target_yaw || 0);
    const thumbChanged = (hotspot.auto_thumbnail !== false) && capturedThumbnail && capturedThumbnail !== hotspot.thumbnail;
    if (!yawChanged && !thumbChanged) return;

    const timer = setTimeout(() => {
      const updates = {};
      if (yawChanged) updates.target_yaw = localYaw;
      if (thumbChanged) updates.thumbnail = capturedThumbnail;
      onUpdate(hotspot.id, updates);
    }, 500);
    return () => clearTimeout(timer);
  }, [localYaw, capturedThumbnail, hotspot.id, hotspot.target_yaw, hotspot.thumbnail, hotspot.auto_thumbnail, onUpdate]);

  if (!targetScene) return null;

  return (
    <div className="detail-panel" style={{ marginTop: 8 }}>
      <div className="detail-title">Target View Direction</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{localYaw}°</span>
      </div>
      <input 
        type="range" 
        min="-180" 
        max="180" 
        value={localYaw} 
        onChange={(e) => setLocalYaw(Number(e.target.value))}
        className="slider"
        style={{ width: '100%', marginBottom: 12 }}
      />
      {localTargetPanoramaUrl && (
        <MiniSphereViewer 
          imageUrl={localTargetPanoramaUrl} 
          targetYaw={localYaw} 
          onCapture={setCapturedThumbnail} 
        />
      )}
    </div>
  );
};

const EditorSidebar = ({
  _rightSidebarOpen,
  activeTab,
  onTabChange,
  activeScene,
  scenes,
  hotspotCreationMode,
  shapeCreationMode,
  audioPointCreationMode,
  onStartHotspotCreation,
  onStartShapeCreation,
  onStartAudioPointCreation,
  onDeleteHotspot,
  onUpdateHotspot,
  onDeleteShape,
  onDeleteAudioPoint,
  onUpdateAudioPoint,
  tourId,
  selectedShape,
  onSelectShape,
  onUpdateShape,
  selectedAudioPoint,
  onSelectAudioPoint,
  onOpenImageDialog,
  onOpenSettings
}) => {
  if (!activeScene) return null;

  const [shapeActionType, setShapeActionType] = useState('none');
  const [shapeUrl, setShapeUrl] = useState('');
  const [shapeInfoContent, setShapeInfoContent] = useState('');
  const [_audioUrl, setAudioUrl] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [_uploadingThumbnail, _setUploadingThumbnail] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <div className="editor-right-sidebar">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={onOpenSettings} className="btn btn-secondary btn-sm" title="Tour Settings">⚙️ Tour Settings</button>
      </div>
      {/* Tab Bar */}
      <div className="tab-bar">
        <button onClick={() => onTabChange('hotspots')} className={`tab-btn${activeTab === 'hotspots' ? ' active' : ''}`}>📍 Hotspots</button>
        <button onClick={() => onTabChange('shapes')} className={`tab-btn${activeTab === 'shapes' ? ' active' : ''}`}>✏️ Shapes</button>
        <button onClick={() => onTabChange('audio')} className={`tab-btn${activeTab === 'audio' ? ' active' : ''}`}>🔊 Audio</button>
      </div>

      {/* Hotspots Tab */}
      {activeTab === 'hotspots' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{activeScene.hotspots?.length || 0} hotspots</span>
            <button
              onClick={onStartHotspotCreation}
              disabled={hotspotCreationMode}
              className="btn btn-primary btn-xs"
              style={hotspotCreationMode ? { opacity: 0.5 } : {}}
            >
              {hotspotCreationMode ? 'Click on image…' : '+ Add'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(activeScene.hotspots || []).map((hotspot, index) => (
              <div
                key={hotspot.id}
                className={`list-item${selectedHotspot?.id === hotspot.id ? ' active' : ''}`}
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <div className="list-text">
                  <div className="list-name">{hotspot.title || `Hotspot ${index + 1}`}</div>
                  <div className="list-sub">
                    {parseFloat(hotspot.yaw || 0).toFixed(1)}°, {parseFloat(hotspot.pitch || 0).toFixed(1)}°
                    {hotspot.targetScene && <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>→ {hotspot.targetScene.name}</span>}
                    {(hotspot.thumbnail || hotspot.targetScene?.thumbnail || hotspot.targetScene?.panorama) && <span style={{ color: 'var(--color-success)', marginLeft: 4 }}>🖼️</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDeleteHotspot(hotspot.id); }} className="list-delete" title="Delete hotspot">×</button>
              </div>
            ))}
            {(activeScene.hotspots || []).length === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
                {hotspotCreationMode ? 'Click on the image to place hotspot' : 'No hotspots yet'}
              </p>
            )}
          </div>

          {/* Hotspot Thumbnail Upload */}
          {selectedHotspot && (
            <div className="detail-panel">
              <div className="detail-title">Hotspot Thumbnail</div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                <input 
                  type="checkbox" 
                  id="editAutoThumbnail" 
                  checked={selectedHotspot.auto_thumbnail !== false} 
                  onChange={async (e) => {
                    const updated = await onUpdateHotspot(selectedHotspot.id, { auto_thumbnail: e.target.checked });
                    setSelectedHotspot(updated);
                  }}
                />
                <label htmlFor="editAutoThumbnail" style={{ fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>Auto Thumbnail</label>
              </div>

              {(selectedHotspot.thumbnail || selectedHotspot.targetScene?.thumbnail || selectedHotspot.targetScene?.panorama) && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <HotspotThumbnail
                    tourId={tourId}
                    url={selectedHotspot.thumbnail || selectedHotspot.targetScene?.thumbnail || selectedHotspot.targetScene?.panorama}
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-panel-border)' }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="btn btn-primary btn-xs w-full"
                  style={{ height: 28 }}
                >
                  Select / Upload Thumbnail
                </button>
                {selectedHotspot && selectedHotspot.auto_thumbnail !== false && (
                  <button
                    onClick={async () => {
                      setGeneratingThumbnail(true);
                      try {
                        const targetScene = (scenes || []).find(s => s.id === selectedHotspot.target_scene_id);
                        const thumb = targetScene?.thumbnail || targetScene?.thumbnail_url || targetScene?.panorama;
                        if (!thumb) throw new Error('Target scene does not have a panorama or thumbnail yet');
                        const updated = await onUpdateHotspot(selectedHotspot.id, { thumbnail: thumb });
                        setSelectedHotspot(updated);
                      } catch (err) {
                        console.error('Failed to generate thumbnail:', err);
                        alert('Failed to generate thumbnail: ' + err.message);
                      } finally {
                        setGeneratingThumbnail(false);
                      }
                    }}
                    disabled={generatingThumbnail || !selectedHotspot.target_scene_id}
                    className="btn btn-secondary btn-sm"
                    title="Generate thumbnail from linked scene panorama"
                    style={{ height: 28, minWidth: 32 }}
                  >
                    {generatingThumbnail ? '…' : '🎨'}
                  </button>
                )}
              </div>
              {(selectedHotspot.targetScene?.thumbnail || selectedHotspot.targetScene?.panorama) && !selectedHotspot.thumbnail && (
                <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 4 }}>
                  Using target scene thumbnail
                </p>
              )}
            </div>
          )}

          {selectedHotspot && selectedHotspot.target_scene_id && (
            <HotspotDirectionEditor 
              tourId={tourId} 
              hotspot={selectedHotspot} 
              scenes={scenes} 
              onUpdate={async (id, data) => {
                const updated = await onUpdateHotspot(id, data);
                setSelectedHotspot(updated);
              }} 
            />
          )}
        </div>
      )}

      {/* Shapes Tab */}
      {activeTab === 'shapes' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{activeScene.shapes?.length || 0} shapes</span>
            <button
              onClick={onStartShapeCreation}
              disabled={shapeCreationMode}
              className="btn btn-primary btn-xs"
              style={shapeCreationMode ? { opacity: 0.5 } : {}}
            >
              {shapeCreationMode ? 'Click on image…' : '+ Add'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(activeScene.shapes || []).map((shape, index) => (
              <div
                key={shape.id}
                className={`list-item${selectedShape?.id === shape.id ? ' active' : ''}`}
                onClick={() => {
                  onSelectShape(shape);
                  setShapeActionType(shape.action_type || 'none');
                  setShapeUrl(shape.url || '');
                  setShapeInfoContent(shape.info_content || '');
                }}
              >
                <div className="list-text">
                  <div className="list-name">{shape.name || `Shape ${index + 1}`}</div>
                  <div className="list-sub">
                    {shape.points?.length || 0} points
                    {shape.type && <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>{shape.type}</span>}
                    {shape.action_type && shape.action_type !== 'none' && <span style={{ color: 'var(--color-success)', marginLeft: 4 }}>• {shape.action_type}</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDeleteShape && onDeleteShape(shape.id); }} className="list-delete" title="Delete shape">×</button>
              </div>
            ))}
            {(activeScene.shapes || []).length === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
                {shapeCreationMode ? 'Click on image to add shape points' : 'No shapes yet'}
              </p>
            )}
          </div>

          {/* Shape Action Settings */}
          {selectedShape && (
            <div className="detail-panel">
              <div className="detail-title">Shape Actions</div>
              <select
                value={shapeActionType}
                onChange={(e) => {
                  setShapeActionType(e.target.value);
                  if (onUpdateShape) onUpdateShape(selectedShape.id, { action_type: e.target.value });
                }}
                className="input-field"
              >
                <option value="none">No Action</option>
                <option value="show_image">Show Image</option>
                <option value="open_url">Open URL</option>
                <option value="show_info">Show Info</option>
              </select>

              {shapeActionType === 'open_url' && (
                <input
                  type="url"
                  placeholder="Enter URL"
                  value={shapeUrl}
                  onChange={(e) => { setShapeUrl(e.target.value); if (onUpdateShape) onUpdateShape(selectedShape.id, { url: e.target.value }); }}
                  className="input-field"
                />
              )}

              <div style={{ marginTop: 8 }}>
                <div className="detail-title">Attached Media</div>
                <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>Media (Image/Video) will map directly to the shape, Audio will play spatially.</p>
                {selectedShape?.media_files && selectedShape.media_files.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--color-bg)', padding: 8, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-panel-border)', marginBottom: 8 }}>
                    <HotspotThumbnail tourId={tourId} url={selectedShape.media_files[0].file_path || selectedShape.media_files[0].url} style={{ maxHeight: 96, objectFit: 'contain' }} />
                  </div>
                )}
                <button onClick={() => onOpenImageDialog && onOpenImageDialog()} className="btn btn-primary btn-sm w-full">
                  {(selectedShape?.media_files && selectedShape.media_files.length > 0) || selectedShape?.media ? 'Change Media' : 'Attach Media'}
                </button>
              </div>

              {shapeActionType === 'show_info' && (
                <textarea
                  placeholder="Enter info content"
                  value={shapeInfoContent}
                  onChange={(e) => { setShapeInfoContent(e.target.value); if (onUpdateShape) onUpdateShape(selectedShape.id, { info_content: e.target.value }); }}
                  className="input-field"
                  rows={2}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Audio Tab */}
      {activeTab === 'audio' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{activeScene.audio_points?.length || 0} points</span>
            <button
              onClick={onStartAudioPointCreation}
              disabled={audioPointCreationMode}
              className="btn btn-primary btn-xs"
              style={audioPointCreationMode ? { opacity: 0.5 } : {}}
            >
              {audioPointCreationMode ? 'Click on image…' : '+ Add'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(activeScene.audio_points || []).map((point, index) => (
              <div
                key={point.id}
                className={`list-item${selectedAudioPoint?.id === point.id ? ' active' : ''}`}
                onClick={() => { onSelectAudioPoint(point); setAudioUrl(point.audio_url || point.url || ''); }}
              >
                <div className="list-text">
                  <div className="list-name">{point.title || `Audio ${index + 1}`}</div>
                  <div className="list-sub">
                    {parseFloat(point.yaw || 0).toFixed(1)}°, {parseFloat(point.pitch || 0).toFixed(1)}°
                    {(point.audio_url || point.url) && <span style={{ color: 'var(--color-success)', marginLeft: 4 }}>🔊</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDeleteAudioPoint && onDeleteAudioPoint(point.id); }} className="list-delete" title="Delete audio point">×</button>
              </div>
            ))}
            {(activeScene.audio_points || []).length === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
                {audioPointCreationMode ? 'Click on the image to place audio point' : 'No audio points yet'}
              </p>
            )}
          </div>

          {/* Audio Point Settings */}
          {selectedAudioPoint && (
            <div className="detail-panel">
              <div className="detail-title">Audio Settings</div>
              <input
                type="text"
                placeholder="Title"
                value={selectedAudioPoint.title || ''}
                onChange={(e) => {
                  if (onUpdateAudioPoint) {
                    onUpdateAudioPoint(selectedAudioPoint.id, { title: e.target.value });
                    onSelectAudioPoint({ ...selectedAudioPoint, title: e.target.value });
                  }
                }}
                className="input-field"
              />

              <div style={{ marginTop: 8 }}>
                <span className="section-label">Audio File</span>
                {(selectedAudioPoint.audio_url || selectedAudioPoint.url) ? (
                  <div style={{ background: 'var(--color-bg)', padding: 8, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-panel-border)', marginTop: 6 }}>
                    <p className="truncate" style={{ fontSize: '0.6rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                      {selectedAudioPoint.audio_url || selectedAudioPoint.url}
                    </p>
                    <AudioPreview tourId={tourId} url={selectedAudioPoint.audio_url || selectedAudioPoint.url} />
                  </div>
                ) : (
                  <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 4 }}>No audio file attached</p>
                )}
                <button onClick={() => onOpenImageDialog && onOpenImageDialog()} className="btn btn-primary btn-xs w-full" style={{ marginTop: 8 }}>
                  Select Audio
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {selectedHotspot && (
        <ImageSelectDialog 
          isOpen={galleryOpen} 
          onClose={() => setGalleryOpen(false)} 
          tourId={tourId} 
          onImageSelect={async (image) => {
            const updated = await onUpdateHotspot(selectedHotspot.id, { thumbnail: image.url, auto_thumbnail: false });
            setSelectedHotspot(updated);
            setGalleryOpen(false);
          }} 
        />
      )}
    </div>
  );
};

export default EditorSidebar;

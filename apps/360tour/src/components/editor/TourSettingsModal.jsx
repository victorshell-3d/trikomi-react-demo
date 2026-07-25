import React, { useState } from 'react';
import { uploadApi } from '../../api/dashboardApi';
import { useLocalImage } from '../../hooks/useLocalImage';
import ImageSelectDialog from '../ImageSelectDialog';

const TourSettingsModal = ({ isOpen, onClose, tourId, tourData, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [_uploading, setUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState(null);

  const settings = tourData?.settings || {
    auto_rotate: false,
    auto_rotate_speed: 1.0,
    global_audio_url: null,
    nadir_patch_url: null,
    nadir_patch_scale: 1.0,
    welcome_screen: { enabled: false, html: '' }
  };

  const globalAudioLocalUrl = useLocalImage(tourId, settings?.global_audio_url);
  const nadirPatchLocalUrl = useLocalImage(tourId, settings?.nadir_patch_url);

  if (!isOpen || !tourData) return null;

  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleWelcomeChange = (key, value) => {
    onUpdateSettings({
      ...settings,
      welcome_screen: { ...settings.welcome_screen, [key]: value }
    });
  };

  const _handleUploadImage = async (field, isWelcomeScreen = false) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.uploadInfoImage(tourId, file);
      if (isWelcomeScreen) {
        handleWelcomeChange(field, result.url);
      } else {
        handleChange(field, result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-md">
        <div className="modal-head">
          <span className="modal-head-title">⚙️ Tour Settings</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="tab-bar">
            <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
            <button className={`tab-btn ${activeTab === 'welcome' ? 'active' : ''}`} onClick={() => setActiveTab('welcome')}>Welcome Screen</button>
            <button className={`tab-btn ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}>Audio & Branding</button>
          </div>

          {activeTab === 'general' && (
            <div className="section" style={{ gap: 16 }}>
              <div className="settings-row">
                <div>
                  <div style={{ color: 'var(--color-text-primary)' }}>Auto-Rotation</div>
                  <div style={{ fontSize: '0.7rem' }}>Rotate scene when idle</div>
                </div>
                <div className={`toggle-switch ${settings.auto_rotate ? 'active' : ''}`} onClick={() => handleChange('auto_rotate', !settings.auto_rotate)} />
              </div>
              {settings.auto_rotate && (
                <div>
                  <label className="label">Rotation Speed ({settings.auto_rotate_speed}x)</label>
                  <input type="range" min="-5" max="5" step="0.5" value={settings.auto_rotate_speed} onChange={(e) => handleChange('auto_rotate_speed', parseFloat(e.target.value))} className="w-full" />
                </div>
              )}
              
            </div>
          )}

          {activeTab === 'welcome' && (
            <div className="section" style={{ gap: 16 }}>
              <div className="settings-row">
                <div>
                  <div style={{ color: 'var(--color-text-primary)' }}>Enable Welcome Screen</div>
                  <div style={{ fontSize: '0.7rem' }}>Show an intro overlay before starting</div>
                </div>
                <div className={`toggle-switch ${settings.welcome_screen?.enabled ? 'active' : ''}`} onClick={() => handleWelcomeChange('enabled', !settings.welcome_screen?.enabled)} />
              </div>
              
              {settings.welcome_screen?.enabled && (
                <div>
                  <label className="label">Custom HTML Content</label>
                  <textarea 
                    value={settings.welcome_screen.html || ''} 
                    onChange={(e) => handleWelcomeChange('html', e.target.value)} 
                    className="input-field" 
                    placeholder="<div>Welcome to our tour!</div>"
                    style={{ minHeight: '150px', fontFamily: 'monospace' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Enter standard HTML here. This will be centered over the tour before it starts.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="section" style={{ gap: 16 }}>
              <div>
                <label className="label">Global Background Audio (mp3)</label>
                {settings.global_audio_url && (
                  <div style={{ marginBottom: 12 }}>
                    {globalAudioLocalUrl ? (
                      <audio src={globalAudioLocalUrl} controls style={{ width: '100%', height: 32 }} />
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Loading audio preview...</div>
                    )}
                  </div>
                )}
                 <button type="button" onClick={() => { setGalleryTarget('global_audio_url'); setGalleryOpen(true); }} className="btn btn-secondary btn-sm w-full">Select / Upload Audio</button>
                {settings.global_audio_url && (
                  <button onClick={() => handleChange('global_audio_url', null)} className="btn btn-danger btn-sm" style={{ marginTop: 8 }}>Remove Audio</button>
                )}
              </div>
              
              <hr className="divider" />
              
              <div>
                <label className="label">Nadir Patch (Tripod Cover)</label>
                {settings.nadir_patch_url && (
                  <div style={{ marginBottom: 12 }}>
                    {nadirPatchLocalUrl ? (
                      <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-panel-border)', background: 'rgba(255,255,255,0.05)' }}>
                        <img src={nadirPatchLocalUrl} alt="Nadir Patch" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Loading image preview...</div>
                    )}
                  </div>
                )}
                 <button type="button" onClick={() => { setGalleryTarget('nadir_patch_url'); setGalleryOpen(true); }} className="btn btn-secondary btn-sm w-full">Select / Upload Patch</button>
                
                {settings.nadir_patch_url && (
                  <div style={{ marginTop: 12 }}>
                    <label className="label">Patch Scale ({settings.nadir_patch_scale || 1.0}x)</label>
                    <input type="range" min="0.1" max="3" step="0.1" value={settings.nadir_patch_scale || 1.0} onChange={(e) => handleChange('nadir_patch_scale', parseFloat(e.target.value))} className="w-full" />
                    <button onClick={() => handleChange('nadir_patch_url', null)} className="btn btn-danger btn-sm" style={{ marginTop: 8 }}>Remove Patch</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ImageSelectDialog 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        tourId={tourId} 
        onImageSelect={(image) => {
          handleChange(galleryTarget, image.url);
          setGalleryOpen(false);
        }} 
      />
    </div>
  );
};

export default TourSettingsModal;

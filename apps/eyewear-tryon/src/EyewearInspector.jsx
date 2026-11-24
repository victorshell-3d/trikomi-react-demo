import React from 'react';
import { observer } from 'mobx-react-lite';
import { GlassInspectorDrawer } from '@trikomi/ui-kit';
import { recordBlendshapesToCSV } from './Recorder';

const FRAME_COLORS = [
  { name: 'Black', hex: '#222222' },
  { name: 'Tortoise', hex: '#8b4513' },
  { name: 'Silver', hex: '#e0e0e0' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Clear', hex: '#ffffff' }
];

const LENS_COLORS = [
  { name: 'Dark', hex: '#111111' },
  { name: 'Green', hex: '#1d3e2b' },
  { name: 'Brown', hex: '#4a2f1d' },
  { name: 'Blue', hex: '#1c2d54' },
  { name: 'Purple', hex: '#3b1c54' }
];

export const EyewearInspector = observer(({
  isOpen = true,
  onClose,
  activeTab = 'models',
  onTabChange,
  models = [],
  activeModelIndex = 0,
  onSelectModel,
  store,
  className = ''
}) => {
  const currentModel = models[activeModelIndex] || models[0];

  const tabs = [
    { id: 'models', label: `Styles (${models.length})` },
    { id: 'frames', label: 'Frame' },
    { id: 'lenses', label: 'Lenses' },
    { id: 'camera', label: 'Camera' },
    { id: 'debug', label: 'Tools' }
  ];

  // Helper to find frame and lens material names from store
  const frameMatName = (store?.glassConfigs?.materials || []).find(m => m.toLowerCase().includes('frame'));
  const lensMatName = (store?.glassConfigs?.materials || []).find(m => m.toLowerCase().includes('lens'));

  const handleApplyFrameColor = (color) => {
    if (!store || !frameMatName) return;
    const p = { ...(store.materialProps[frameMatName] || {}) };
    p.color = color.hex;
    if (color.name === 'Clear') {
      p.opacity = 0.5;
      p.transparent = true;
    } else {
      p.opacity = 1.0;
    }
    store.materialProps[frameMatName] = p;
  };

  const handleApplyLensColor = (color) => {
    if (!store || !lensMatName) return;
    const p = { ...(store.materialProps[lensMatName] || {}) };
    p.color = color.hex;
    p.opacity = 0.7;
    store.materialProps[lensMatName] = p;
  };

  const handleCameraChange = (e) => {
    const deviceId = e.target.value;
    if (navigator.mediaDevices && store?.camera) {
      navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      }).then((stream) => {
        store.camera.srcObject = stream;
      }).catch(err => {
        console.warn('Failed to switch camera:', err);
      });
    }
  };

  return (
    <GlassInspectorDrawer
      title="Eyewear AR Studio"
      subtitle={currentModel?.name || 'Virtual Try-On Fitting'}
      isOpen={isOpen}
      onClose={onClose}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      side="right"
      width={360}
      className={`vs-eyewear-inspector ${className}`.trim()}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={() => {
              if (store) store.mirror = !store.mirror;
            }}
          >
            {store?.mirror ? '🪞 Mirror: On' : '🪞 Mirror: Off'}
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={() => {
              if (store) store.showOccluderWireframe = !store.showOccluderWireframe;
            }}
          >
            {store?.showOccluderWireframe ? 'Hide Occluder' : 'Show Occluder'}
          </button>
        </div>
      }
    >
      <div className="vs-eyewear-inspector-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Tab 1: Models Catalog */}
        {activeTab === 'models' && (
          <div className="vs-eyewear-models-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Eyewear Frame ({models.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {models.map((model, idx) => {
                const isActive = activeModelIndex === idx;
                return (
                  <div
                    key={model.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectModel && onSelectModel(idx)}
                    className={`vs-eyewear-card ${isActive ? 'is-active' : ''}`}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '12px',
                      background: isActive ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isActive ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '72px',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '8px',
                        padding: '4px'
                      }}
                    >
                      {model.thumb ? (
                        <img
                          src={model.thumb}
                          alt={model.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.4rem' }}>👓</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                        {model.name}
                      </div>
                      {isActive && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--vs-primary)', fontWeight: 700 }}>
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Frame Material & Color */}
        {activeTab === 'frames' && (
          <div className="vs-eyewear-frame-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Frame Material & Color
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FRAME_COLORS.map((c) => {
                const isSelected = store?.materialProps[frameMatName]?.color === c.hex;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleApplyFrameColor(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isSelected ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                        {c.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--vs-primary)', fontWeight: 700 }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Lens Tint & Protection */}
        {activeTab === 'lenses' && (
          <div className="vs-eyewear-lens-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Lens Tint & Optics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LENS_COLORS.map((c) => {
                const isSelected = store?.materialProps[lensMatName]?.color === c.hex;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleApplyLensColor(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isSelected ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                        {c.name} Tint
                      </span>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--vs-primary)', fontWeight: 700 }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Camera & AR Settings */}
        {activeTab === 'camera' && (
          <div className="vs-eyewear-camera-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AR Video & Camera
            </div>

            {/* Camera Select */}
            {store?.cameras && store.cameras.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--vs-ink-muted)', fontWeight: 600 }}>
                  Camera Source
                </label>
                <select
                  className="vs-select"
                  onChange={handleCameraChange}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.65)',
                    background: 'rgba(255, 255, 255, 0.55)',
                    color: 'var(--vs-ink)',
                    fontSize: '0.85rem'
                  }}
                >
                  {store.cameras.map((cam, idx) => (
                    <option key={cam.deviceId || idx} value={cam.deviceId}>
                      {cam.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mirror Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                Mirror Video Feed
              </span>
              <input
                type="checkbox"
                checked={store?.mirror ?? true}
                onChange={(e) => {
                  if (store) store.mirror = e.target.checked;
                }}
              />
            </label>

            {/* Natural Lighting */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                Natural Lighting Simulation
              </span>
              <input
                type="checkbox"
                checked={store?.naturalLighting ?? true}
                onChange={(e) => {
                  if (store) store.naturalLighting = e.target.checked;
                }}
              />
            </label>
          </div>
        )}

        {/* Tab 5: Tools & Debug */}
        {activeTab === 'debug' && (
          <div className="vs-eyewear-tools-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Try-On Tools & Developer Debug
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                Show Occluder Wireframe
              </span>
              <input
                type="checkbox"
                checked={store?.showOccluderWireframe ?? false}
                onChange={(e) => {
                  if (store) store.showOccluderWireframe = e.target.checked;
                }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                Show Dummy Reference Glasses
              </span>
              <input
                type="checkbox"
                checked={store?.showDummyGlasses ?? false}
                onChange={(e) => {
                  if (store) store.showDummyGlasses = e.target.checked;
                }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                Show Viewport Grid
              </span>
              <input
                type="checkbox"
                checked={store?.grid ?? false}
                onChange={(e) => {
                  if (store) store.grid = e.target.checked;
                }}
              />
            </label>

            <button
              type="button"
              className={`vs-btn ${store?.recording ? 'vs-btn-danger' : 'vs-btn-primary'}`}
              style={{ width: '100%', padding: '10px', marginTop: '6px' }}
              onClick={recordBlendshapesToCSV}
              disabled={!store?.tracking}
            >
              {store?.recording ? 'Stop Recording' : 'Record Blendshapes CSV'}
            </button>
          </div>
        )}
      </div>
    </GlassInspectorDrawer>
  );
});

export default EyewearInspector;
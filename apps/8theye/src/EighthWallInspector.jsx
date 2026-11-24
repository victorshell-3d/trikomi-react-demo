import React from 'react';
import { observer } from 'mobx-react-lite';
import { GlassInspectorDrawer } from '@trikomi/ui-kit';
import store from './Store';

export const FRAME_COLORS = [
  { name: 'Black', hex: '#222222' },
  { name: 'Tortoise', hex: '#8b4513' },
  { name: 'Silver', hex: '#e0e0e0' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Clear', hex: '#ffffff' }
];

export const LENS_COLORS = [
  { name: 'Dark', hex: '#111111' },
  { name: 'Green', hex: '#1d3e2b' },
  { name: 'Brown', hex: '#4a2f1d' },
  { name: 'Blue', hex: '#1c2d54' },
  { name: 'Purple', hex: '#3b1c54' }
];

const DRAWER_TABS = [
  { id: 'models', label: 'Styles', icon: '👓' },
  { id: 'frames', label: 'Frames', icon: '🎨' },
  { id: 'lenses', label: 'Lenses', icon: '🕶️' },
  { id: 'webar', label: 'WebAR', icon: '🌐' },
  { id: 'info', label: 'Info', icon: '📋' }
];

export const EighthWallInspector = observer(({
  isOpen,
  onClose,
  activeTab = 'models',
  onTabChange,
  models = [],
  activeModelIndex = 0,
  onSelectModel,
  onApplyColor,
  onResetDefaults,
  onRecenter,
  onOpenHelp
}) => {
  const currentModel = models[activeModelIndex] || models[0] || { name: 'Eyewear Model', scale: 0.3 };

  // Detect active frame and lens colors from store
  const activeFrameHex = (() => {
    for (const matName of store.glassConfigs?.materials || []) {
      if (matName.toLowerCase().includes('frame') && store.materialProps[matName]?.color) {
        return store.materialProps[matName].color;
      }
    }
    return '#222222';
  })();

  const activeLensHex = (() => {
    for (const matName of store.glassConfigs?.materials || []) {
      if (matName.toLowerCase().includes('lens') && store.materialProps[matName]?.color) {
        return store.materialProps[matName].color;
      }
    }
    return '#111111';
  })();

  const handleNextModel = () => {
    if (!models.length) return;
    const nextIdx = (activeModelIndex + 1) % models.length;
    if (onSelectModel) {
      onSelectModel(nextIdx);
    } else {
      store.modelIndex = nextIdx;
    }
  };

  const handleResetDefaults = () => {
    if (onSelectModel) {
      onSelectModel(0);
    } else {
      store.modelIndex = 0;
    }
    store.grid = false;
    store.naturalLighting = true;
  };

  return (
    <GlassInspectorDrawer
      isOpen={isOpen}
      onClose={onClose}
      tabs={DRAWER_TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      title="WebAR Eyewear Studio"
      position="right"
      width={360}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
            onClick={onResetDefaults || onRecenter || handleResetDefaults}
          >
            ↺ Reset Defaults
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-primary"
            style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
            onClick={handleNextModel}
          >
            👓 Next Style
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '16px' }}>

        {/* ------------------------------------------------------------------ */}
        {/* Tab 1: Styles / Models                                             */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'models' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Select Eyewear Style ({models.length})
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Real-time Niantic 8thWall WebAR head tracking and spatial placement.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {models.map((model, idx) => {
                const isActive = activeModelIndex === idx;
                return (
                  <div
                    key={model.name || idx}
                    onClick={() => {
                      if (onSelectModel) {
                        onSelectModel(idx);
                      } else {
                        store.modelIndex = idx;
                      }
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isActive
                        ? '2px solid var(--accent, #c084fc)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isActive
                        ? 'rgba(192, 132, 252, 0.12)'
                        : 'rgba(255, 255, 255, 0.03)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {model.thumb ? (
                          <img
                            src={model.thumb}
                            alt={model.name}
                            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: '20px' }}>👓</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#ffffff' }}>
                          {model.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.55)' }}>
                          Scale: {model.scale || 0.3} • 3D GLTF
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="vs-badge vs-badge-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 2: Frame Colors                                                */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'frames' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Frame Material Finishes ({FRAME_COLORS.length})
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Customize acetate, metallic, and transparent frame colors.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {FRAME_COLORS.map(c => {
                const isSelected = activeFrameHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      if (onApplyColor) {
                        onApplyColor('frame', c.hex, c.name);
                      }
                    }}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '50%',
                      background: c.hex,
                      border: isSelected
                        ? '3px solid #ffffff'
                        : '2px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: isSelected
                        ? '0 0 12px rgba(255, 255, 255, 0.6)'
                        : 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      transition: 'transform 0.15s ease'
                    }}
                    title={c.name}
                    aria-label={`Frame color ${c.name}`}
                  >
                    {isSelected && (
                      <span style={{
                        color: c.name === 'Clear' || c.name === 'Silver' ? '#000000' : '#ffffff',
                        fontSize: '13px',
                        fontWeight: 900
                      }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Color Information */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px'
            }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Active Frame:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {FRAME_COLORS.find(c => c.hex.toLowerCase() === activeFrameHex.toLowerCase())?.name || 'Custom'}
              </span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 3: Lens Tint Colors                                            */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'lenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Lens Tint Options ({LENS_COLORS.length})
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Select UV-tinted optical coatings and gradient glass tones.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {LENS_COLORS.map(c => {
                const isSelected = activeLensHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      if (onApplyColor) {
                        onApplyColor('lens', c.hex, c.name);
                      }
                    }}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '50%',
                      background: c.hex,
                      border: isSelected
                        ? '3px solid #ffffff'
                        : '2px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: isSelected
                        ? '0 0 12px rgba(255, 255, 255, 0.6)'
                        : 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      transition: 'transform 0.15s ease'
                    }}
                    title={c.name}
                    aria-label={`Lens color ${c.name}`}
                  >
                    {isSelected && (
                      <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 900 }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Lens Tint Information */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px'
            }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Active Lens Tint:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {LENS_COLORS.find(c => c.hex.toLowerCase() === activeLensHex.toLowerCase())?.name || 'Custom'}
              </span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 4: WebAR Controls & Telemetry                                  */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'webar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Niantic 8thWall WebAR
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Real-time SLAM camera tracking, depth occlusion, and environment mapping.
              </p>
            </div>

            {/* Tracking Status Card */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: store.tracking ? 'rgba(74, 222, 128, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              border: store.tracking ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: store.tracking ? '#4ade80' : '#f59e0b',
                boxShadow: store.tracking ? '0 0 10px #4ade80' : 'none'
              }} />
              <div style={{ fontSize: '12.5px', color: store.tracking ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>
                {store.tracking ? 'Face Anchor Tracked' : 'Searching for Face Anchor...'}
              </div>
            </div>

            {/* WebAR Viewport Toggles */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px', color: '#ffffff' }}>
                <span>Show Occluder Wireframe</span>
                <input
                  type="checkbox"
                  className="vs-checkbox"
                  checked={store.grid}
                  onChange={e => { store.grid = e.target.checked; }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px', color: '#ffffff' }}>
                <span>Natural Lighting Simulation</span>
                <input
                  type="checkbox"
                  className="vs-checkbox"
                  checked={store.naturalLighting}
                  onChange={e => { store.naturalLighting = e.target.checked; }}
                />
              </label>
            </div>

            {/* Help Guide Action */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="vs-btn vs-btn-secondary"
              style={{ padding: '9px 12px', fontSize: '12.5px', textAlign: 'center' }}
            >
              📖 WebAR Camera & Lighting Guide
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 5: Model Information & Specs                                   */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Eyewear Specifications
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                3D model metadata and optical specifications.
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Active Model:</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{currentModel.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Mesh Scale:</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{currentModel.scale || 0.3}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Occluder Depth:</span>
                <span style={{ fontWeight: 600, color: '#a78bfa' }}>Head Occluder GLB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Pipeline:</span>
                <span style={{ fontWeight: 600, color: '#f472b6' }}>Niantic 8thWall WebAR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="vs-btn vs-btn-secondary"
              style={{ padding: '8px 12px', fontSize: '12.5px' }}
            >
              ↺ Reset Eyewear Configuration
            </button>
          </div>
        )}

      </div>
    </GlassInspectorDrawer>
  );
});

export default EighthWallInspector;

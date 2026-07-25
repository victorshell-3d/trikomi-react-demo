import React from 'react';
import { observer } from 'mobx-react-lite';
import { viewerStore, OrbitControlsPlugin } from '@trikomi/core';
import { configStore } from '../../store/ConfigStore';

const StudioEnvironmentCard = observer(() => {
  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        Studio Environment
      </div>

      <div className="control-group">
        <label>Direct Light Intensity</label>
        <input
          type="range"
          min="0.5"
          max="4.0"
          step="0.1"
          value={viewerStore.lightIntensity}
          onChange={e => viewerStore.setLightIntensity(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Reflected Light Intensity</label>
        <input
          type="range"
          min="0.0"
          max="3.0"
          step="0.1"
          value={viewerStore.envIntensity}
          onChange={e => viewerStore.setEnvIntensity(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Reflected Light Angle</label>
        <input
          type="range"
          min="0"
          max="360"
          step="5"
          value={Math.round((viewerStore.envRotation * 180) / Math.PI)}
          onChange={e => viewerStore.setEnvRotation((parseFloat(e.target.value) * Math.PI) / 180)}
        />
      </div>

      <div className="control-group">
        <label>Camera Field of View</label>
        <input
          type="range"
          min="20"
          max="90"
          step="1"
          value={viewerStore.cameraFov}
          onChange={e => {
            viewerStore.setCameraFov(parseInt(e.target.value));
            const viewer = configStore.viewerInstance;
            if (viewer && viewer.camera) {
              viewer.camera.fov = parseInt(e.target.value);
              viewer.camera.updateProjectionMatrix();
            }
          }}
        />
      </div>

      <div className="toggle-switch-container">
        <span className="toggle-switch-label">Auto-Rotate View</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={viewerStore.autoRotate}
            onChange={e => viewerStore.setAutoRotate(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="toggle-switch-container">
        <span className="toggle-switch-label">Floor Grid</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={viewerStore.showGrid}
            onChange={e => viewerStore.setShowGrid(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
});

const MaterialFinishCard = observer(() => {
  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        Cardboard Finish & Finish
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <button
          className="camera-btn"
          onClick={() => {
            viewerStore.setSelectedMaterialRoughness(1.0);
            viewerStore.setSelectedMaterialMetalness(0.0);
          }}
          style={{ fontSize: '11px', padding: '6px', background: (viewerStore.selectedMaterialRoughness === 1 && viewerStore.selectedMaterialMetalness === 0) ? 'rgba(129, 140, 248, 0.15)' : '', borderColor: (viewerStore.selectedMaterialRoughness === 1 && viewerStore.selectedMaterialMetalness === 0) ? '#818cf8' : '' }}
        >
          Matte Cardboard
        </button>
        <button
          className="camera-btn"
          onClick={() => {
            viewerStore.setSelectedMaterialRoughness(0.2);
            viewerStore.setSelectedMaterialMetalness(0.05);
          }}
          style={{ fontSize: '11px', padding: '6px', background: (viewerStore.selectedMaterialRoughness === 0.2 && viewerStore.selectedMaterialMetalness === 0.05) ? 'rgba(129, 140, 248, 0.15)' : '', borderColor: (viewerStore.selectedMaterialRoughness === 0.2 && viewerStore.selectedMaterialMetalness === 0.05) ? '#818cf8' : '' }}
        >
          Glossy Coated
        </button>
        <button
          className="camera-btn"
          onClick={() => {
            viewerStore.setSelectedMaterialRoughness(0.55);
            viewerStore.setSelectedMaterialMetalness(0.05);
          }}
          style={{ fontSize: '11px', padding: '6px', background: (viewerStore.selectedMaterialRoughness === 0.55 && viewerStore.selectedMaterialMetalness === 0.05) ? 'rgba(129, 140, 248, 0.15)' : '', borderColor: (viewerStore.selectedMaterialRoughness === 0.55 && viewerStore.selectedMaterialMetalness === 0.05) ? '#818cf8' : '' }}
        >
          Satin Finish
        </button>
        <button
          className="camera-btn"
          onClick={() => {
            viewerStore.setSelectedMaterialRoughness(0.25);
            viewerStore.setSelectedMaterialMetalness(0.85);
          }}
          style={{ fontSize: '11px', padding: '6px', background: (viewerStore.selectedMaterialRoughness === 0.25 && viewerStore.selectedMaterialMetalness === 0.85) ? 'rgba(129, 140, 248, 0.15)' : '', borderColor: (viewerStore.selectedMaterialRoughness === 0.25 && viewerStore.selectedMaterialMetalness === 0.85) ? '#818cf8' : '' }}
        >
          Metallic Foil
        </button>
      </div>

      <div className="control-group">
        <label>Surface Roughness</label>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={viewerStore.selectedMaterialRoughness}
          onChange={e => viewerStore.setSelectedMaterialRoughness(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Metallic Reflection</label>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={viewerStore.selectedMaterialMetalness}
          onChange={e => viewerStore.setSelectedMaterialMetalness(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
});

const AdvancedShadersCard = observer(() => {
  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 22 22 22 12 2" />
        </svg>
        Advanced Shaders & Effects
      </div>

      <div className="toggle-switch-container">
        <span className="toggle-switch-label">Soft Shadows</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={viewerStore.progressiveShadowEnabled}
            onChange={e => viewerStore.setProgressiveShadowEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      
      <div className="toggle-switch-container">
        <span className="toggle-switch-label">Screen Space Reflections (SSR)</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={viewerStore.ssrEnabled}
            onChange={e => viewerStore.setSSREnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="toggle-switch-container">
        <span className="toggle-switch-label">Global Illumination (SSGI)</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={viewerStore.ssgiEnabled}
            onChange={e => viewerStore.setSsgiEnabled(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
});

const ViewportBackgroundsCard = observer(() => {
  const backdrops = [
    { name: 'Dark Space', color: '#0a0b0d' },
    { name: 'Slate Gray', color: '#1f2937' },
    { name: 'Clean White', color: '#ffffff' },
    { name: 'Transparent', color: 'transparent' }
  ];

  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
        3D View Background
      </div>
      <div className="color-swatch-grid">
        {backdrops.map(bd => (
          <div
            key={bd.name}
            className={`color-swatch-item ${viewerStore.backgroundColor === bd.color ? 'active' : ''}`}
            style={{ backgroundColor: bd.color === 'transparent' ? '#2d3748' : bd.color }}
            onClick={() => viewerStore.setBackgroundColor(bd.color)}
            title={bd.name}
          >
            {bd.color === 'transparent' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(45deg, transparent 45%, #ef4444 45%, #ef4444 55%, transparent 55%)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const CameraViewportsCard = observer(() => {
  const snapCamera = (view: 'reset' | 'X' | '-X' | 'Y' | '-Y' | 'Z' | '-Z') => {
    const viewer = configStore.viewerInstance;
    if (!viewer) return;
    const controlsPlugin = viewer.getPlugin(OrbitControlsPlugin);
    if (controlsPlugin) {
      if (view === 'reset') {
        controlsPlugin.resetView();
      } else {
        controlsPlugin.setView(view);
      }
    }
  };

  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        Camera Viewports
      </div>
      <div className="camera-grid">
        <button className="camera-btn" onClick={() => snapCamera('reset')}>Perspective</button>
        <button className="camera-btn" onClick={() => snapCamera('Y')}>Top View</button>
        <button className="camera-btn" onClick={() => snapCamera('Z')}>Front View</button>
        <button className="camera-btn" onClick={() => snapCamera('X')}>Side View</button>
      </div>
    </div>
  );
});

export const RenderTab = observer(() => {
  return (
    <>
      <StudioEnvironmentCard />
      <MaterialFinishCard />
      <AdvancedShadersCard />
      <ViewportBackgroundsCard />
      <CameraViewportsCard />
    </>
  );
});

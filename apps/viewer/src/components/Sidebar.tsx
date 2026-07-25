import React from 'react';
import { observer } from 'mobx-react-lite';
import { useViewerStore } from '@trikomi/core';
import { SceneGraphNode } from './SceneGraphNode';

export const Sidebar: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  if (!viewerStore.showSidebar) return null;

  // React to sceneGraphVersion changes to re-render the tree root when objects are added/removed
  const __version = viewerStore.sceneGraphVersion;

  return (
    <div className="sidebar-container">
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logos/trikomi.png" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} alt="Viewer Logo" />
        <div>
          <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.25rem', lineHeight: 1.1 }}>Trikomi 3D Viewer</h2>
          <span className="subtitle" style={{ margin: 0 }}>Powered by @trikomi/core</span>
        </div>
      </div>

      <hr className="divider" />

      {/* Model Info Section */}
      <div className="section">
        <span className="section-label">Active Model</span>
        <div className="model-badge">
          <div className="status-indicator active" />
          <span className="model-name">{viewerStore.activeModelName}</span>
        </div>
        {viewerStore.loadingProgress < 100 && (
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${viewerStore.loadingProgress}%` }} />
            <span className="progress-text">Loading Assets: {viewerStore.loadingProgress}%</span>
          </div>
        )}
      </div>

      {/* Scene Graph Explorer */}
      {viewerStore.currentModel && (
        <div className="section">
          <span className="section-label">Scene Hierarchy</span>
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
            padding: '8px 4px',
            marginTop: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <SceneGraphNode node={viewerStore.currentModel} />
          </div>
        </div>
      )}

      {/* Environment & Lighting Controls (IBL) */}
      <div className="section">
        <span className="section-label">Environment (HDRI)</span>
        
        <div className="toggle-row">
          <span>Show Environment</span>
          <button
            onClick={() => viewerStore.setShowEnvironment(!viewerStore.showEnvironment)}
            className={`toggle-btn ${viewerStore.showEnvironment ? 'active' : ''}`}
          >
            {viewerStore.showEnvironment ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.showEnvironment && (
          <div className="ssgi-params-panel">
            <div className="toggle-row" style={{ marginBottom: '8px' }}>
              <span>Use as Background</span>
              <button
                onClick={() => viewerStore.setUseEnvAsBackground(!viewerStore.useEnvAsBackground)}
                className={`toggle-btn ${viewerStore.useEnvAsBackground ? 'active' : ''}`}
              >
                {viewerStore.useEnvAsBackground ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="control-header">
              <span className="param-label">Rotation</span>
              <span className="value-label">{(viewerStore.envRotation * (180 / Math.PI)).toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI * 2}
              step="0.01"
              value={viewerStore.envRotation}
              onChange={(e) => viewerStore.setEnvRotation(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Intensity</span>
              <span className="value-label">{viewerStore.envIntensity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={viewerStore.envIntensity}
              onChange={(e) => viewerStore.setEnvIntensity(parseFloat(e.target.value))}
              className="slider"
            />

            {viewerStore.useEnvAsBackground && (
              <>
                <div className="control-header" style={{ marginTop: '8px' }}>
                  <span className="param-label">BG Blurriness</span>
                  <span className="value-label">{viewerStore.bgBlurriness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={viewerStore.bgBlurriness}
                  onChange={(e) => viewerStore.setBgBlurriness(parseFloat(e.target.value))}
                  className="slider"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Lighting Controls */}
      <div className="section">
        <div className="control-header">
          <span className="section-label">Direct Light Intensity</span>
          <span className="value-label">{viewerStore.lightIntensity.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0"
          max="4"
          step="0.1"
          value={viewerStore.lightIntensity}
          onChange={(e) => viewerStore.setLightIntensity(parseFloat(e.target.value))}
          className="slider"
        />
      </div>

      {/* Camera & Lens */}
      <div className="section">
        <span className="section-label">Camera & Lens</span>
        <div className="control-header">
          <span className="param-label">Field of View</span>
          <span className="value-label">{viewerStore.cameraFov}°</span>
        </div>
        <input
          type="range"
          min="20"
          max="120"
          step="1"
          value={viewerStore.cameraFov}
          onChange={(e) => viewerStore.setCameraFov(parseInt(e.target.value))}
          className="slider"
        />

        <div className="toggle-row" style={{ marginTop: '8px' }}>
          <span>Depth of Field (Bokeh)</span>
          <button
            onClick={() => viewerStore.setDofEnabled(!viewerStore.dofEnabled)}
            className={`toggle-btn ${viewerStore.dofEnabled ? 'active' : ''}`}
          >
            {viewerStore.dofEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.dofEnabled && (
          <div className="ssgi-params-panel">
            <div className="control-header">
              <span className="param-label">Focus Distance</span>
              <span className="value-label">{viewerStore.dofFocusDistance.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="50"
              step="0.1"
              value={viewerStore.dofFocusDistance}
              onChange={(e) => viewerStore.setDofFocusDistance(parseFloat(e.target.value))}
              className="slider"
            />
            
            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Focal Length</span>
              <span className="value-label">{viewerStore.dofFocalLength.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={viewerStore.dofFocalLength}
              onChange={(e) => viewerStore.setDofFocalLength(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Bokeh Scale</span>
              <span className="value-label">{viewerStore.dofBokehScale.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={viewerStore.dofBokehScale}
              onChange={(e) => viewerStore.setDofBokehScale(parseFloat(e.target.value))}
              className="slider"
            />
          </div>
        )}
      </div>





      {/* SSGI Controls */}
      <div className="section">
        <span className="section-label">Screen Space Global Illumination</span>
        
        <div className="toggle-row">
          <span>Enable SSGI (WebGPU)</span>
          <button
            onClick={() => viewerStore.setSsgiEnabled(!viewerStore.ssgiEnabled)}
            className={`toggle-btn ${viewerStore.ssgiEnabled ? 'active' : ''}`}
          >
            {viewerStore.ssgiEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.ssgiEnabled && (
          <div className="ssgi-params-panel" id="ssgi-params">
            <div className="control-header">
              <span className="param-label">Slice Count</span>
              <span className="value-label">{viewerStore.ssgiSliceCount}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={viewerStore.ssgiSliceCount}
              onChange={(e) => viewerStore.setSsgiSliceCount(parseInt(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Step Count</span>
              <span className="value-label">{viewerStore.ssgiStepCount}</span>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              step="1"
              value={viewerStore.ssgiStepCount}
              onChange={(e) => viewerStore.setSsgiStepCount(parseInt(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Radius</span>
              <span className="value-label">{viewerStore.ssgiRadius}</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={viewerStore.ssgiRadius}
              onChange={(e) => viewerStore.setSsgiRadius(parseInt(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Thickness</span>
              <span className="value-label">{viewerStore.ssgiThickness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="10"
              step="0.05"
              value={viewerStore.ssgiThickness}
              onChange={(e) => viewerStore.setSsgiThickness(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">GI Intensity</span>
              <span className="value-label">{viewerStore.ssgiGIIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={viewerStore.ssgiGIIntensity}
              onChange={(e) => viewerStore.setSsgiGIIntensity(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">AO Intensity</span>
              <span className="value-label">{viewerStore.ssgiAOIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={viewerStore.ssgiAOIntensity}
              onChange={(e) => viewerStore.setSsgiAOIntensity(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="toggle-row" style={{ marginTop: '12px' }}>
              <span>Temporal Filtering (TRAA)</span>
              <button
                onClick={() => viewerStore.setSsgiTemporalFiltering(!viewerStore.ssgiTemporalFiltering)}
                className={`toggle-btn ${viewerStore.ssgiTemporalFiltering ? 'active' : ''}`}
              >
                {viewerStore.ssgiTemporalFiltering ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SSR Controls */}
      <div className="section">
        <span className="section-label">Screen Space Reflections (SSR)</span>
        
        <div className="toggle-row">
          <span>Enable SSR</span>
          <button
            onClick={() => viewerStore.setSSREnabled(!viewerStore.ssrEnabled)}
            className={`toggle-btn ${viewerStore.ssrEnabled ? 'active' : ''}`}
          >
            {viewerStore.ssrEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.ssrEnabled && (
          <div className="ssgi-params-panel" id="ssr-params">
            <div className="control-header">
              <span className="param-label">Max Distance</span>
              <span className="value-label">{viewerStore.ssrMaxDistance.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={viewerStore.ssrMaxDistance}
              onChange={(e) => viewerStore.setSSRMaxDistance(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Opacity</span>
              <span className="value-label">{viewerStore.ssrOpacity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={viewerStore.ssrOpacity}
              onChange={(e) => viewerStore.setSSROpacity(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Thickness</span>
              <span className="value-label">{viewerStore.ssrThickness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={viewerStore.ssrThickness}
              onChange={(e) => viewerStore.setSSRThickness(parseFloat(e.target.value))}
              className="slider"
            />
          </div>
        )}
      </div>

      {/* Bloom Controls */}
      <div className="section">
        <span className="section-label">Bloom Post-Processing</span>
        
        <div className="toggle-row">
          <span>Enable Bloom</span>
          <button
            onClick={() => viewerStore.setBloomEnabled(!viewerStore.bloomEnabled)}
            className={`toggle-btn ${viewerStore.bloomEnabled ? 'active' : ''}`}
          >
            {viewerStore.bloomEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.bloomEnabled && (
          <div className="ssgi-params-panel" id="bloom-params">
            <div className="control-header">
              <span className="param-label">Strength</span>
              <span className="value-label">{viewerStore.bloomStrength.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={viewerStore.bloomStrength}
              onChange={(e) => viewerStore.setBloomStrength(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Radius</span>
              <span className="value-label">{viewerStore.bloomRadius.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={viewerStore.bloomRadius}
              onChange={(e) => viewerStore.setBloomRadius(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Threshold</span>
              <span className="value-label">{viewerStore.bloomThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={viewerStore.bloomThreshold}
              onChange={(e) => viewerStore.setBloomThreshold(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Smooth Width</span>
              <span className="value-label">{viewerStore.bloomSmoothWidth.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.005"
              value={viewerStore.bloomSmoothWidth}
              onChange={(e) => viewerStore.setBloomSmoothWidth(parseFloat(e.target.value))}
              className="slider"
            />
          </div>
        )}
      </div>
      
      {/* Cinematic Post-Processing Controls */}
      <div className="section">
        <span className="section-label">Cinematic Post-Processing</span>
        
        <div className="toggle-row">
          <span>Enable Cinematic Effects</span>
          <button
            onClick={() => viewerStore.setCinematicEnabled(!viewerStore.cinematicEnabled)}
            className={`toggle-btn ${viewerStore.cinematicEnabled ? 'active' : ''}`}
          >
            {viewerStore.cinematicEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.cinematicEnabled && (
          <div className="ssgi-params-panel" id="cinematic-params">
            <div className="control-header">
              <span className="param-label">Vignette Intensity</span>
              <span className="value-label">{viewerStore.cinematicVignette.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={viewerStore.cinematicVignette}
              onChange={(e) => viewerStore.setCinematicVignette(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Chromatic Aberration</span>
              <span className="value-label">{viewerStore.cinematicChromaticAberration.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={viewerStore.cinematicChromaticAberration}
              onChange={(e) => viewerStore.setCinematicChromaticAberration(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Film Grain Intensity</span>
              <span className="value-label">{viewerStore.cinematicFilmGrain.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={viewerStore.cinematicFilmGrain}
              onChange={(e) => viewerStore.setCinematicFilmGrain(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Exposure (Color Grading)</span>
              <span className="value-label">{viewerStore.cinematicExposure.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={viewerStore.cinematicExposure}
              onChange={(e) => viewerStore.setCinematicExposure(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Contrast (Color Grading)</span>
              <span className="value-label">{viewerStore.cinematicContrast.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={viewerStore.cinematicContrast}
              onChange={(e) => viewerStore.setCinematicContrast(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Saturation (Color Grading)</span>
              <span className="value-label">{viewerStore.cinematicSaturation.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={viewerStore.cinematicSaturation}
              onChange={(e) => viewerStore.setCinematicSaturation(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="toggle-row" style={{ marginTop: '12px' }}>
              <span className="param-label">Enable 3D LUT (Remy 24)</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={viewerStore.cinematicLutEnabled}
                  onChange={(e) => viewerStore.setCinematicLutEnabled(e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            {viewerStore.cinematicLutEnabled && (
              <>
                <div className="control-header" style={{ marginTop: '8px' }}>
                  <span className="param-label">3D LUT Intensity</span>
                  <span className="value-label">{viewerStore.cinematicLutIntensity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={viewerStore.cinematicLutIntensity}
                  onChange={(e) => viewerStore.setCinematicLutIntensity(parseFloat(e.target.value))}
                  className="slider"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Progressive Shadow Map Controls */}
      <div className="section">
        <span className="section-label">Progressive Shadow Map</span>
        
        <div className="toggle-row">
          <span>Enable Progressive Shadows</span>
          <button
            onClick={() => viewerStore.setProgressiveShadowEnabled(!viewerStore.progressiveShadowEnabled)}
            className={`toggle-btn ${viewerStore.progressiveShadowEnabled ? 'active' : ''}`}
          >
            {viewerStore.progressiveShadowEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {viewerStore.progressiveShadowEnabled && (
          <div className="ssgi-params-panel" id="progressive-shadow-params">
            <div className="control-header">
              <span className="param-label">Blend Window</span>
              <span className="value-label">{viewerStore.progressiveShadowBlendWindow}</span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              step="1"
              value={viewerStore.progressiveShadowBlendWindow}
              onChange={(e) => viewerStore.setProgressiveShadowBlendWindow(parseInt(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Light Radius</span>
              <span className="value-label">{viewerStore.progressiveShadowLightRadius}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={viewerStore.progressiveShadowLightRadius}
              onChange={(e) => viewerStore.setProgressiveShadowLightRadius(parseInt(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Ambient Weight (AO)</span>
              <span className="value-label">{viewerStore.progressiveShadowAmbientWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={viewerStore.progressiveShadowAmbientWeight}
              onChange={(e) => viewerStore.setProgressiveShadowAmbientWeight(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Shadow Contrast (Power)</span>
              <span className="value-label">{viewerStore.progressiveShadowContrast.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={viewerStore.progressiveShadowContrast}
              onChange={(e) => viewerStore.setProgressiveShadowContrast(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="control-header" style={{ marginTop: '8px' }}>
              <span className="param-label">Shadow Opacity (Intensity)</span>
              <span className="value-label">{viewerStore.progressiveShadowOpacity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={viewerStore.progressiveShadowOpacity}
              onChange={(e) => viewerStore.setProgressiveShadowOpacity(parseFloat(e.target.value))}
              className="slider"
            />

            <div className="toggle-row" style={{ marginTop: '12px' }}>
              <span>Blur Edges</span>
              <button
                onClick={() => viewerStore.setProgressiveShadowBlurEdges(!viewerStore.progressiveShadowBlurEdges)}
                className={`toggle-btn ${viewerStore.progressiveShadowBlurEdges ? 'active' : ''}`}
              >
                {viewerStore.progressiveShadowBlurEdges ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="toggle-row" style={{ marginBottom: '8px' }}>
          <span>Show Performance Stats</span>
          <button
            onClick={() => viewerStore.setShowStats(!viewerStore.showStats)}
            className={`toggle-btn ${viewerStore.showStats ? 'active' : ''}`}
          >
            {viewerStore.showStats ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="footer-stats">
          <span>Engine: Three.js r165</span>
          <span>State: MobX 6</span>
        </div>
      </div>
    </div>
  );
});
export default Sidebar;

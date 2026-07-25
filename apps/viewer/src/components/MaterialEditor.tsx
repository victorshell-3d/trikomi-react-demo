import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useViewerStore } from '@trikomi/core';

export const MaterialEditor: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!viewerStore.selectedMesh) {
    return null;
  }

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      viewerStore.setSelectedMaterialTexture(e.target.files[0]);
    }
  };

  const clearTexture = () => {
    viewerStore.setSelectedMaterialTexture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeEditor = () => {
    viewerStore.setSelectedMesh(null);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    outline: 'none',
    minWidth: '0'
  };

  const labelStyle = { fontSize: '0.75rem', color: '#9ca3af', width: '24px', flexShrink: 0 };
  const rowStyle = { display: 'flex', gap: '4px', alignItems: 'center' };

  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        width: '240px',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        backgroundColor: 'rgba(15, 15, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f8f9fa',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        zIndex: 50,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Object Editor
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
            {viewerStore.selectedMesh.name || 'Unnamed Object'}
          </p>
        </div>
        <button
          onClick={closeEditor}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: '0 4px'
          }}
        >
          &times;
        </button>
      </div>

      {/* Transform Section */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '8px' }}>Transform</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Position */}
          <div style={rowStyle}>
            <span style={labelStyle}>Pos</span>
            <input type="number" step="0.1" style={inputStyle} value={viewerStore.selectedMeshPosition[0]} onChange={e => viewerStore.setSelectedMeshPosition(parseFloat(e.target.value) || 0, viewerStore.selectedMeshPosition[1], viewerStore.selectedMeshPosition[2])} />
            <input type="number" step="0.1" style={inputStyle} value={viewerStore.selectedMeshPosition[1]} onChange={e => viewerStore.setSelectedMeshPosition(viewerStore.selectedMeshPosition[0], parseFloat(e.target.value) || 0, viewerStore.selectedMeshPosition[2])} />
            <input type="number" step="0.1" style={inputStyle} value={viewerStore.selectedMeshPosition[2]} onChange={e => viewerStore.setSelectedMeshPosition(viewerStore.selectedMeshPosition[0], viewerStore.selectedMeshPosition[1], parseFloat(e.target.value) || 0)} />
          </div>
          
          {/* Rotation */}
          <div style={rowStyle}>
            <span style={labelStyle}>Rot</span>
            <input type="number" step="1" style={inputStyle} value={Math.round(viewerStore.selectedMeshRotation[0])} onChange={e => viewerStore.setSelectedMeshRotation(parseFloat(e.target.value) || 0, viewerStore.selectedMeshRotation[1], viewerStore.selectedMeshRotation[2])} />
            <input type="number" step="1" style={inputStyle} value={Math.round(viewerStore.selectedMeshRotation[1])} onChange={e => viewerStore.setSelectedMeshRotation(viewerStore.selectedMeshRotation[0], parseFloat(e.target.value) || 0, viewerStore.selectedMeshRotation[2])} />
            <input type="number" step="1" style={inputStyle} value={Math.round(viewerStore.selectedMeshRotation[2])} onChange={e => viewerStore.setSelectedMeshRotation(viewerStore.selectedMeshRotation[0], viewerStore.selectedMeshRotation[1], parseFloat(e.target.value) || 0)} />
          </div>

          {/* Scale */}
          <div style={rowStyle}>
            <span style={labelStyle}>Scl</span>
            <input type="number" step="0.1" style={inputStyle} value={viewerStore.selectedMeshScale[0]} onChange={e => viewerStore.setSelectedMeshScale(parseFloat(e.target.value) || 0, viewerStore.selectedMeshScale[1], viewerStore.selectedMeshScale[2])} />
            <input type="number" step="0.1" style={inputStyle} value={viewerStore.selectedMeshScale[1]} onChange={e => viewerStore.setSelectedMeshScale(viewerStore.selectedMeshScale[0], parseFloat(e.target.value) || 0, viewerStore.selectedMeshScale[2])} />
            <input type="number" step="0.1" style={inputStyle} value={viewerStore.selectedMeshScale[2]} onChange={e => viewerStore.setSelectedMeshScale(viewerStore.selectedMeshScale[0], viewerStore.selectedMeshScale[1], parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>

      {viewerStore.selectedMaterial && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
          
          {/* Base Color Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb' }}>Base Color</span>
            <input
              type="color"
              value={viewerStore.selectedMaterialColor}
              onChange={(e) => viewerStore.setSelectedMaterialColor(e.target.value)}
              style={{
                width: '32px',
                height: '24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                padding: 0
              }}
            />
          </div>

          {/* Texture Upload Section */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '8px' }}>
              Albedo Texture
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleTextureUpload}
                style={{
                  display: 'block',
                  width: '100%',
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              />
              {(viewerStore.selectedMaterial as import('three').MeshStandardMaterial).map && (
                <button
                  onClick={clearTexture}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear Texture
                </button>
              )}
            </div>
          </div>

          {/* PBR Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#e5e7eb' }}>Metalness</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{viewerStore.selectedMaterialMetalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={viewerStore.selectedMaterialMetalness}
                onChange={(e) => viewerStore.setSelectedMaterialMetalness(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer', height: '4px' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#e5e7eb' }}>Roughness</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{viewerStore.selectedMaterialRoughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={viewerStore.selectedMaterialRoughness}
                onChange={(e) => viewerStore.setSelectedMaterialRoughness(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer', height: '4px' }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default MaterialEditor;

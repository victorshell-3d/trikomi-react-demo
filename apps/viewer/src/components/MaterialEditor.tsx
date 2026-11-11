import React, { useRef } from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import { useViewerStore, ThreeViewer } from '@trikomi/core';

export const MaterialEditor: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const viewer = viewerStore.viewer as ThreeViewer | null;
  const runtimeRoot = viewer?.runtimeRoot;
  const selectedNode = runtimeRoot?.selectedNode;

  if (!selectedNode) {
    return null;
  }

  const rawObject = selectedNode.nativeObject;
  const nativeMesh = (rawObject && 'isMesh' in rawObject && rawObject.isMesh)
    ? (rawObject as THREE.Mesh)
    : undefined;
  const rawMaterial = nativeMesh?.material;
  const standardMaterial = (
    Array.isArray(rawMaterial) ? rawMaterial[0] : rawMaterial
  ) as THREE.MeshStandardMaterial | undefined;

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && standardMaterial) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        standardMaterial.map = texture;
        standardMaterial.needsUpdate = true;
      });
    }
  };

  const clearTexture = () => {
    if (standardMaterial && standardMaterial.map) {
      standardMaterial.map.dispose();
      standardMaterial.map = null;
      standardMaterial.needsUpdate = true;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeEditor = () => {
    runtimeRoot.selectNode(null);
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

  // Read direct identity transforms from selectedNode
  const pos = selectedNode.position;
  const rotDeg = [
    (selectedNode.rotation.x * 180) / Math.PI,
    (selectedNode.rotation.y * 180) / Math.PI,
    (selectedNode.rotation.z * 180) / Math.PI
  ];
  const scl = selectedNode.scale;

  // Material color hex
  const currentColorHex = standardMaterial?.color
    ? `#${standardMaterial.color.getHexString()}`
    : '#ffffff';

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
            {selectedNode.nativeObject.name || 'Unnamed Object'}
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

      {/* Transform Section - Direct Identity */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '8px' }}>Transform</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Position */}
          <div style={rowStyle}>
            <span style={labelStyle}>Pos</span>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={pos.x}
              onChange={e => {
                pos.x = parseFloat(e.target.value) || 0;
              }}
            />
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={pos.y}
              onChange={e => {
                pos.y = parseFloat(e.target.value) || 0;
              }}
            />
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={pos.z}
              onChange={e => {
                pos.z = parseFloat(e.target.value) || 0;
              }}
            />
          </div>
          
          {/* Rotation (deg) */}
          <div style={rowStyle}>
            <span style={labelStyle}>Rot</span>
            <input
              type="number"
              step="1"
              style={inputStyle}
              value={Math.round(rotDeg[0])}
              onChange={e => {
                const deg = parseFloat(e.target.value) || 0;
                selectedNode.rotation.x = (deg * Math.PI) / 180;
              }}
            />
            <input
              type="number"
              step="1"
              style={inputStyle}
              value={Math.round(rotDeg[1])}
              onChange={e => {
                const deg = parseFloat(e.target.value) || 0;
                selectedNode.rotation.y = (deg * Math.PI) / 180;
              }}
            />
            <input
              type="number"
              step="1"
              style={inputStyle}
              value={Math.round(rotDeg[2])}
              onChange={e => {
                const deg = parseFloat(e.target.value) || 0;
                selectedNode.rotation.z = (deg * Math.PI) / 180;
              }}
            />
          </div>

          {/* Scale */}
          <div style={rowStyle}>
            <span style={labelStyle}>Scl</span>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={scl.x}
              onChange={e => {
                scl.x = parseFloat(e.target.value) || 0;
              }}
            />
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={scl.y}
              onChange={e => {
                scl.y = parseFloat(e.target.value) || 0;
              }}
            />
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={scl.z}
              onChange={e => {
                scl.z = parseFloat(e.target.value) || 0;
              }}
            />
          </div>
        </div>
      </div>

      {standardMaterial && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
          
          {/* Base Color Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb' }}>Base Color</span>
            <input
              type="color"
              value={currentColorHex}
              onChange={(e) => {
                standardMaterial.color.set(e.target.value);
                standardMaterial.needsUpdate = true;
              }}
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
              {standardMaterial.map && (
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
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{standardMaterial.metalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={standardMaterial.metalness}
                onChange={(e) => {
                  standardMaterial.metalness = parseFloat(e.target.value);
                }}
                style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer', height: '4px' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#e5e7eb' }}>Roughness</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{standardMaterial.roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={standardMaterial.roughness}
                onChange={(e) => {
                  standardMaterial.roughness = parseFloat(e.target.value);
                }}
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

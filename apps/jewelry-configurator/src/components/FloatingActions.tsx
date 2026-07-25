import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { ExportPlugin, GLTFPlugin, ThreeViewer } from '@trikomi/core';

interface FloatingActionsProps {
  viewerRef: React.MutableRefObject<ThreeViewer | null>;
}

export const FloatingActions: React.FC<FloatingActionsProps> = observer(({ viewerRef }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);




  const handleExport = () => {
    const viewer = viewerRef.current as ThreeViewer;
    if (viewer) {
      const exportPlugin = viewer.getPlugin(ExportPlugin);
      if (exportPlugin) {
        exportPlugin.exportGLTF();
      } else {
        alert("Export plugin not found.");
      }
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const viewer = viewerRef.current;
    if (viewer) {
      const gltfPlugin = viewer.getPlugin(GLTFPlugin);
      if (gltfPlugin) {
        gltfPlugin.loadModel(url, file.name);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '8px',
      zIndex: 20
    }}>
      <input
        type="file"
        accept=".glb,.gltf"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImport}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: 'rgba(10, 12, 28, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.09)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.85rem',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(10, 12, 28, 0.75)'}
      >
        Import GLB
      </button>
      <button
        onClick={handleExport}
        style={{
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          border: 'none',
          color: '#0f172a',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.85rem',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0, 242, 254, 0.3)'
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        Export
      </button>
    </div>
  );
});

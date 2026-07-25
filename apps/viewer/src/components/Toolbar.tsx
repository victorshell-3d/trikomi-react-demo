import React from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import {
  useViewerStore,
  ThreeViewer,
  GLTFPlugin,
  OrbitControlsPlugin,
  ExportPlugin
} from '@trikomi/core';
import { EighthWallSlamSDK } from '@trikomi/core/8thwall';

declare global {
  interface Window {
    __THREE_VIEWER_INSTANCE__?: ThreeViewer;
    __SLAM_SDK_INSTANCE__?: EighthWallSlamSDK;
  }
}

export const Toolbar: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const slamSdkRef = React.useRef<EighthWallSlamSDK | null>(null);

  const handleToggle8thAR = () => {
    const viewer = viewerStore.viewer as ThreeViewer;
    if (!viewer) return;

    if (viewerStore.isArActive) {
      if (slamSdkRef.current || window.__SLAM_SDK_INSTANCE__) {
        const instance = slamSdkRef.current || window.__SLAM_SDK_INSTANCE__;
        instance?.stop();
      }
      viewerStore.setIsArActive(false);
    } else {
      if (typeof window === 'undefined' || !(window as any).XR8) {
        alert('8th Wall WebAR engine is loading or not supported on this browser/device.');
        return;
      }
      if (!slamSdkRef.current) {
        slamSdkRef.current = new EighthWallSlamSDK(viewer);
        window.__SLAM_SDK_INSTANCE__ = slamSdkRef.current;
      }
      slamSdkRef.current.initialize();
      viewerStore.setIsArActive(true);
    }
  };

  const _handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddPrimitive = (type: 'box' | 'sphere' | 'cylinder') => {
    const viewer = viewerStore.viewer as ThreeViewer;
    if (!viewer) return;

    let geometry: THREE.BufferGeometry;
    if (type === 'box') geometry = new THREE.BoxGeometry(2, 2, 2);
    else if (type === 'sphere') geometry = new THREE.SphereGeometry(1.5, 32, 32);
    else geometry = new THREE.CylinderGeometry(1, 1, 2, 32);

    const material = new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff,
      roughness: 0.2,
      metalness: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${type.charAt(0).toUpperCase() + type.slice(1)}_${Math.floor(Math.random()*1000)}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Optional: position randomly so they don't exactly overlap
    mesh.position.set((Math.random() - 0.5) * 4, Math.random() * 2 + 1, (Math.random() - 0.5) * 4);

    const group = viewer.scene.getObjectByName('ModelGroup');
    if (group) {
      group.add(mesh);
    } else {
      viewer.scene.add(mesh);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.match(/\.(gltf|glb)$/i)) {
      const url = URL.createObjectURL(file);
      const viewer = viewerStore.viewer as ThreeViewer;
      const gltfPlugin = viewer?.getPlugin(GLTFPlugin);


      if (gltfPlugin) {
        gltfPlugin.loadModel(url, file.name);
      } else {
        console.error("GLTFPlugin not found on viewer");
        viewerStore.setModelError("GLTF Plugin not initialized");
      }
    } else if (file) {
      alert('Please select a valid .gltf or .glb file');
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetView = () => {
    const viewer = viewerStore.viewer as ThreeViewer;
    const orbitPlugin = viewer?.getPlugin(OrbitControlsPlugin);
    if (orbitPlugin && typeof orbitPlugin.resetView === 'function') {
      orbitPlugin.resetView();
    }
  };

  const handleExportGLB = () => {
    const viewer = viewerStore.viewer as ThreeViewer;
    if (viewer) {
      const exportPlugin = viewer.getPlugin(ExportPlugin);
      if (exportPlugin) {
        exportPlugin.exportGLTF();
      }
    }
  };

  const handleScreenshot = () => {
    const viewer = viewerStore.viewer as ThreeViewer;
    if (viewer) {
      const exportPlugin = viewer.getPlugin(ExportPlugin);
      if (exportPlugin) {
        exportPlugin.takeScreenshot();
      }
    }
  };



  return (
    <div className="toolbar-container">
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".gltf,.glb"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`toolbar-btn`}
        title="Upload GLTF/GLB Model"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </button>

      {/* Add Box Button */}
      <button
        onClick={() => handleAddPrimitive('box')}
        className={`toolbar-btn`}
        title="Add Box Primitive"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </button>

      {/* Add Sphere Button */}
      <button
        onClick={() => handleAddPrimitive('sphere')}
        className={`toolbar-btn`}
        title="Add Sphere Primitive"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
      </button>

      {/* Add Cylinder Button */}
      <button
        onClick={() => handleAddPrimitive('cylinder')}
        className={`toolbar-btn`}
        title="Add Cylinder Primitive"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 5v14c0 1.66-4 3-9 3s-9-1.34-9-3V5"></path>
        </svg>
      </button>

      {/* Export GLB Button */}
      <button
        onClick={handleExportGLB}
        className={`toolbar-btn`}
        title="Export Scene as GLB"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>

      {/* Screenshot Button */}
      <button
        onClick={handleScreenshot}
        className={`toolbar-btn`}
        title="Take High-Res Screenshot"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>



      {/* Animation Timeline Toggle */}
      {viewerStore.animations.length > 0 && (
        <button
          onClick={() => viewerStore.setShowAnimationTimeline(!viewerStore.showAnimationTimeline)}
          className={`toolbar-btn ${viewerStore.showAnimationTimeline ? 'active' : ''}`}
          title="Toggle Animation Timeline"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
          </svg>
        </button>
      )}

      {/* Sidebar Toggle */}
      <button
        onClick={() => viewerStore.setShowSidebar(!viewerStore.showSidebar)}
        className={`toolbar-btn ${viewerStore.showSidebar ? 'active' : ''}`}
        title="Toggle Left Sidebar"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

      {/* Camera Views Toggle */}
      <button
        onClick={() => viewerStore.setShowCameraViews(!viewerStore.showCameraViews)}
        className={`toolbar-btn ${viewerStore.showCameraViews ? 'active' : ''}`}
        title="Toggle Camera Views Panel"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <path d="M12 9v4" />
          <path d="M10 11h4" />
        </svg>
      </button>

      {/* Measurement Toggle */}
      <button
        onClick={() => viewerStore.setShowMeasurements(!viewerStore.showMeasurements)}
        className={`toolbar-btn ${viewerStore.showMeasurements ? 'active' : ''}`}
        title="Toggle Measurement Dimensions"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 1 0 2.828 2.828z" />
          <path d="m14 7 3 3" />
          <path d="m11 10 3 3" />
          <path d="m8 13 3 3" />
        </svg>
      </button>

      {/* Editing Mode Toggle */}
      <button
        onClick={() => viewerStore.setEditingMode(!viewerStore.editingMode)}
        className={`toolbar-btn ${viewerStore.editingMode ? 'active' : ''}`}
        title="Toggle Object Editing Mode"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      {/* Gizmo Tools (Only visible in Editing Mode) */}
      {viewerStore.editingMode && (
        <div style={{ display: 'flex', flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2px', marginLeft: '8px' }}>
          <button
            onClick={() => viewerStore.setTransformMode('translate')}
            className={`toolbar-btn ${viewerStore.transformMode === 'translate' ? 'active' : ''}`}
            title="Translate (Move)"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 9 2 12 5 15" />
              <polyline points="9 5 12 2 15 5" />
              <polyline points="19 9 22 12 19 15" />
              <polyline points="9 19 12 22 15 19" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </button>
          <button
            onClick={() => viewerStore.setTransformMode('rotate')}
            className={`toolbar-btn ${viewerStore.transformMode === 'rotate' ? 'active' : ''}`}
            title="Rotate"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button
            onClick={() => viewerStore.setTransformMode('scale')}
            className={`toolbar-btn ${viewerStore.transformMode === 'scale' ? 'active' : ''}`}
            title="Scale"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M21 3L3 21" />
              <path d="M21 15v6h-6" />
              <path d="M3 9V3h6" />
            </svg>
          </button>
        </div>
      )}

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className={`toolbar-btn`}
        title="Reset Camera View"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      {/* Grid & Axes Toggle */}
      <button
        onClick={() => viewerStore.setShowGrid(!viewerStore.showGrid)}
        className={`toolbar-btn ${viewerStore.showGrid ? 'active' : ''}`}
        title="Toggle Grid & Axes"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
      </button>

      {/* Auto-Rotate Toggle */}
      <button
        onClick={() => viewerStore.setAutoRotate(!viewerStore.autoRotate)}
        className={`toolbar-btn ${viewerStore.autoRotate ? 'active' : ''}`}
        title="Toggle Camera Auto-Rotate"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      </button>

      {/* Environment Lighting (IBL) Toggle */}
      <button
        onClick={() => viewerStore.setShowEnvironment(!viewerStore.showEnvironment)}
        className={`toolbar-btn ${viewerStore.showEnvironment ? 'active' : ''}`}
        title="Toggle Environment Lighting (IBL)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      </button>

      {/* Env as Background Toggle */}
      <button
        onClick={() => viewerStore.setUseEnvAsBackground(!viewerStore.useEnvAsBackground)}
        className={`toolbar-btn ${viewerStore.useEnvAsBackground ? 'active' : ''}`}
        title="Toggle Environment Background"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </button>

      {/* Floor Transparency Toggle */}
      <button
        onClick={() => viewerStore.setFloorTransparent(!viewerStore.floorTransparent)}
        className={`toolbar-btn ${viewerStore.floorTransparent ? 'active' : ''}`}
        title="Toggle Floor Transparency (Receive Shadows Only)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" strokeDasharray="3 3" />
        </svg>
      </button>

      {/* 8thAR SLAM World AR Toggle */}
      <button
        onClick={handleToggle8thAR}
        className={`toolbar-btn ${viewerStore.isArActive ? 'ar-active' : ''}`}
        title={viewerStore.isArActive ? 'Exit 8thAR Mode' : 'View Model in Physical Environment (8thAR)'}
        style={viewerStore.isArActive ? {
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: '#ffffff',
          boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)'
        } : undefined}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span style={{ fontSize: '10px', fontWeight: 700, marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>8thAR</span>
      </button>
    </div>
  );
});

export default Toolbar;

import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import * as THREE from 'three/webgpu';
import { ThreeViewer, OrbitControlsPlugin, EnvironmentPlugin, ExportPlugin, SSRPlugin, SSGIPlugin, ProgressiveShadowPlugin, viewerStore, GridHelperPlugin, FloorPlugin, CenterModelPlugin } from '@trikomi/core';
import { configStore } from '../store/ConfigStore';
import { BoxBuilder } from '@trikomi/core/box';
import { reaction } from 'mobx';

const ThreeCanvasToolbar = observer(({ handleZoom, handleRecenterCamera }: { handleZoom: (f: number) => void, handleRecenterCamera: () => void }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(26, 29, 36, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        zIndex: 5
      }}
    >
      {/* Zoom Out Button */}
      <button
        onClick={() => handleZoom(1.2)}
        title="Zoom Out"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '50%',
          outline: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Zoom In Button */}
      <button
        onClick={() => handleZoom(0.8)}
        title="Zoom In"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '50%',
          outline: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Vertical Divider */}
      <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

      {/* Recenter Camera Button */}
      <button
        onClick={handleRecenterCamera}
        title="Recenter Camera"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '50%',
          outline: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Vertical Divider */}
      <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

      {/* Toggle Grid Button */}
      <button
        onClick={() => viewerStore.setShowGrid(!viewerStore.showGrid)}
        title="Toggle Grid"
        style={{
          background: viewerStore.showGrid ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
          border: '1px solid ' + (viewerStore.showGrid ? '#818cf8' : 'rgba(255,255,255,0.15)'),
          color: viewerStore.showGrid ? '#a5b4fc' : 'var(--color-text-muted)',
          padding: '6px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
          <path d="M3 3h18v18H3z" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
      </button>

      {/* Toggle Solid Floor Button */}
      <button
        onClick={() => {
          const nextState = !viewerStore.floorTransparent;
          viewerStore.setFloorTransparent(nextState);
          viewerStore.setBackgroundColor(nextState ? 'transparent' : '#ffffff');
        }}
        title="Toggle Solid Floor"
        style={{
          background: !viewerStore.floorTransparent ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
          border: '1px solid ' + (!viewerStore.floorTransparent ? '#818cf8' : 'rgba(255,255,255,0.15)'),
          color: !viewerStore.floorTransparent ? '#a5b4fc' : 'var(--color-text-muted)',
          padding: '6px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z" />
        </svg>
      </button>

      {/* Vertical Divider */}
      <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

      {/* Take Screenshot (PNG) */}
      <button
        onClick={() => configStore.export3DSnapshot()}
        title="Take PNG Screenshot"
        style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e',
          color: '#86efac',
          padding: '6px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)'; e.currentTarget.style.color = '#86efac'; }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </button>

      {/* Export GLB */}
      <button
        onClick={() => configStore.export3DGLTF()}
        title="Export GLB Model"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'var(--color-text-muted)',
          padding: '6px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 15 16 10 5 21" />
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
        </svg>
      </button>
    </div>
  );
});

export const ThreeCanvas = observer(({ }: {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ThreeViewer | null>(null);
  const builderRef = useRef<BoxBuilder | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Use the shared global Viewer Store
    const engineStore = viewerStore;
    engineStore.backgroundColor = '#ffffff'; // Default to white
    engineStore.floorTransparent = false;    // Ensure floor transparency is turned off by default

    // 2. Initialize Viewer
    const assetBaseUrl = import.meta.env.PROD ? '../assets/' : '/packages/core/dist/assets/';
    const viewer = new ThreeViewer(containerRef.current, engineStore, { 
      assetBaseUrl,
      onAuthorized: () => {
        viewer.addPlugin(new EnvironmentPlugin());
        viewer.addPlugin(new ExportPlugin());
        viewer.addPlugin(new SSRPlugin());
        viewer.addPlugin(new SSGIPlugin());
        viewer.addPlugin(new ProgressiveShadowPlugin());
        viewer.addPlugin(new FloorPlugin());
      }
    });
    window.__THREE_VIEWER_INSTANCE__ = viewer;

    // 2. Add Free Plugins
    viewer.addPlugin(new OrbitControlsPlugin());
    viewer.addPlugin(new GridHelperPlugin());
    viewer.addPlugin(new CenterModelPlugin({ center: true, floor: true }));

    // 3. Initialize Box Builder
    const builder = new BoxBuilder(configStore);
    builder.update(); // Initial build
    const modelGroup = viewer.scene.getObjectByName('ModelGroup') as THREE.Group;
    if (modelGroup) {
      modelGroup.add(builder.root);
    } else {
      viewer.scene.add(builder.root);
    }

    viewerRef.current = viewer;
    builderRef.current = builder;

    configStore.setViewerInstance(viewer);

    // React to store changes to update box geometry and folding
    const disposeStoreReaction = reaction(
      () => ({
        unfoldProgress: configStore.unfoldProgress,
        textureCanvas: configStore.textureCanvas,
        tree: JSON.stringify(configStore.rootNode),
        layout: JSON.stringify(configStore.flattenedLayout),
        templates: JSON.stringify(configStore.templates),
        roughness: viewerStore.selectedMaterialRoughness,
        metalness: viewerStore.selectedMaterialMetalness
      }),
      () => {
        builder.update();
        const centerPlugin = viewer.getPlugin(CenterModelPlugin);
        if (centerPlugin) {
          centerPlugin.center(builder.root);
        }
      },
      { fireImmediately: true }
    );

    // Box Configurator specific: adjust shadow contrast based on floor transparency
    const disposeShadowReaction = reaction(
      () => viewerStore.floorTransparent,
      (isTransparent) => {
        viewerStore.setProgressiveShadowContrast(isTransparent ? 3.5 : 1.6);
      },
      { fireImmediately: true }
    );

    // Initial camera position
    viewer.camera.position.set(3, 3, 5);
    viewer.camera.lookAt(0, 0, 0);

    return () => {
      if (window.__THREE_VIEWER_INSTANCE__ === viewer) {
        window.__THREE_VIEWER_INSTANCE__ = undefined;
      }
      configStore.setViewerInstance(null);
      disposeStoreReaction();
      disposeShadowReaction();
      viewer.scene.remove(builder.root);
      viewer.dispose();
    };
  }, []);

  const handleZoom = (factor: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const orbitPlugin = viewer.getPlugin(OrbitControlsPlugin);
    const controls = orbitPlugin?.controls;
    if (controls) {
      const cam = viewer.camera;
      const target = controls.target;
      const dir = new THREE.Vector3().subVectors(cam.position, target);
      cam.position.copy(target).addScaledVector(dir, factor);
      controls.update();
    }
  };

  const handleRecenterCamera = () => {
    const viewer = viewerRef.current;
    const builder = builderRef.current;
    if (!viewer || !builder) return;

    const centerPlugin = viewer.getPlugin(CenterModelPlugin);
    if (centerPlugin) {
      // Re-trigger centering to ensure everything is aligned
      centerPlugin.center(builder.root);
    }

    const postBox = new THREE.Box3().setFromObject(builder.root);
    if (!postBox.isEmpty()) {
      const postCenter = new THREE.Vector3();
      postBox.getCenter(postCenter);

      // Position camera at an offset from the center of the box
      viewer.camera.position.copy(postCenter).add(new THREE.Vector3(3, 3, 5));

      const orbitPlugin = viewer.getPlugin(OrbitControlsPlugin);
      const controls = orbitPlugin?.controls;
      if (controls) {
        controls.target.copy(postCenter);
        controls.update();
      } else {
        viewer.camera.lookAt(postCenter);
      }
    } else {
      // Fallback if bounding box is not computed
      viewer.camera.position.set(3, 3, 5);
      viewer.camera.lookAt(0, 0, 0);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'radial-gradient(circle at center, #ffffff 0%, #e2e8f0 100%)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <ThreeCanvasToolbar handleZoom={handleZoom} handleRecenterCamera={handleRecenterCamera} />
    </div>
  );
});

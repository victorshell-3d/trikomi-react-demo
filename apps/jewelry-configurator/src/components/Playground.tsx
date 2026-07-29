import React, { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import {
  ThreeViewer,
  OrbitControlsPlugin,
  EnvironmentPlugin,
  SSRPlugin,
  SSGIPlugin,
  ProgressiveShadowPlugin,
  BloomPlugin,
  DiamondPlugin,
  ExportPlugin,
  FloorPlugin,
  GLTFPlugin,
  CenterModelPlugin,
  CinematicPlugin,
  useViewerStore,
  StatsPlugin
} from '@trikomi/core';
import { MaterialControls } from './MaterialControls';
import { FloatingActions } from './FloatingActions';


export const Playground = observer(() => {
  const viewerStore = useViewerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ThreeViewer | null>(null);




  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Configure default rendering flags on the shared global store
    // Background color is handled dynamically below
    viewerStore.floorTransparent = false;
    viewerStore.setSsgiEnabled(false);
    viewerStore.setSSREnabled(false);
    viewerStore.setProgressiveShadowEnabled(false);
    viewerStore.setBloomEnabled(true);

    // 2. Initialize ThreeViewer with all premium requested plugins
    const viewer = new ThreeViewer(containerRef.current, viewerStore, {
      onAuthorized: () => {
        viewer.addPlugin(new EnvironmentPlugin());
        viewer.addPlugin(new SSGIPlugin());
        viewer.addPlugin(new SSRPlugin());
        viewer.addPlugin(new ProgressiveShadowPlugin());
        viewer.addPlugin(new FloorPlugin());
        viewer.addPlugin(new BloomPlugin());
        viewer.addPlugin(new DiamondPlugin());
        viewer.addPlugin(new ExportPlugin());
        viewer.addPlugin(new CinematicPlugin());
      }
    });
    viewerStore.viewer = viewer;
    viewer.addPlugin(new StatsPlugin());
    viewerStore.showStats = true;

    viewer.addPlugin(new OrbitControlsPlugin());
    viewer.addPlugin(new GLTFPlugin());
    viewer.addPlugin(new CenterModelPlugin());

    // Setup initial camera
    viewer.camera.position.set(0, 2.5, 4.5);
    viewer.camera.lookAt(0, 0, 0);

    // Fetch the ModelGroup expected by the DiamondPlugin
    const modelGroup = viewer.scene.getObjectByName('ModelGroup') as THREE.Group;

    viewerRef.current = viewer;

    // Load initial ring.glb or custom model from widget options
    const modelToLoad = viewerStore.options.model || `${import.meta.env.BASE_URL}models/ring.glb`;
    const gltfPlugin = viewer.getPlugin(GLTFPlugin);
    if (gltfPlugin) {
      gltfPlugin.loadModel(modelToLoad, 'jewelry_model').then(model => {
        if (model) {
          modelGroup.add(model);
          viewer.getPlugin(OrbitControlsPlugin)?.resetView()
          viewerStore.setActiveModelName('jewelry_model');
        }
      }).catch(err => console.error(`Failed to load ${modelToLoad}`, err));
    }

    return () => {
      viewerStore.viewer = null;
      viewer.dispose();
    };
  }, []);

  useEffect(() => {
    viewerStore.backgroundColor = '#3a0ca3';
  }, []);

  // We removed procedural assembly and material updates to rely on the GLB model

  return (
    <>
      {/* 3D Canvas Viewport */}
      <div
        className="canvas-container"
        ref={containerRef}
      />

      {/* Loading Overlay */}
      {viewerStore.isModelLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(10, 12, 28, 0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#00f2fe' }}>
          <img src={`${import.meta.env.BASE_URL}svgs/spinner.svg`} width={60} alt="Loading..." style={{ marginBottom: '15px' }} />
          <div style={{ letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>LOADING MODEL...</div>
        </div>
      )}

      <FloatingActions viewerRef={viewerRef} />
      {/* Material Color Controls */}
      <MaterialControls viewerRef={viewerRef} />
    </>
  );
});

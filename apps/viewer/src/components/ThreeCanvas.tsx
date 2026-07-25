import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import {
  ThreeViewer,
  OrbitControlsPlugin,
  GridHelperPlugin,
  StatsPlugin,
  GLTFPlugin,
  EnvironmentPlugin,
  SSGIPlugin,
  SSRPlugin,
  ProgressiveShadowPlugin,
  FloorPlugin,
  BloomPlugin,
  DiamondPlugin,
  DOFPlugin,
  CameraPlugin,
  MaterialRaycasterPlugin,
  TransformGizmoPlugin,
  AnimationPlugin,
  ExportPlugin,
  OutlinePlugin,
  MeasurementPlugin,
  CinematicPlugin,
  useViewerStore
} from '@trikomi/core';

declare global {
  interface Window {
    __THREE_VIEWER_INSTANCE__?: ThreeViewer;
  }
}

export const ThreeCanvas = observer(() => {
  // Read the store from Context — provided by TrikomiViewerElement (widget)
  // or by the standalone dev entry point (main.tsx)
  const viewerStore = useViewerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<ThreeViewer | null>(null);
  const [isAuthComplete, setIsAuthComplete] = useState(false);


  // 1. Engine Instance Initialization
  useEffect(() => {
    if (!containerRef.current) return;

    const assetBaseUrl = import.meta.env.PROD ? '../assets/' : '/assets/';
    // Create a fresh viewer per mount — store from Context is already per-widget instance
    const v = new ThreeViewer(containerRef.current, viewerStore, {
      assetBaseUrl,
      onAuthorized: () => setIsAuthComplete(true)
    });
    // Publish into the store so sibling components (Toolbar, CameraViews, etc.)
    // can reach this viewer through their own Context store, not through window globals.
    viewerStore.viewer = v;
    setViewer(v);

    return () => {
      viewerStore.viewer = null;
      v.dispose?.();
    };
  }, []);



  // 2. Basic Engine Activation & Scene Setup (No license required)
  useEffect(() => {
    if (!viewer) return;

    // Attach basic plugins (No license required)
    viewer.addPlugin(new OrbitControlsPlugin());
    viewer.addPlugin(new GridHelperPlugin());
    viewer.addPlugin(new StatsPlugin());
    viewer.addPlugin(new GLTFPlugin());

    // Scene Setup
    if (viewerStore.options.model) {
      // Load user-provided model
      const gltfPlugin = viewer.getPlugin(GLTFPlugin);
      if (gltfPlugin) {
        viewerStore.setActiveModelName('Loading custom model...');
        gltfPlugin.loadModel(viewerStore.options.model).then(model => {
          viewerStore.setActiveModelName(model.name || 'Custom Model');
        });
      }
    } else {
      // Fallback: Default Torus Knot
      const modelGroup = viewer.scene.getObjectByName('ModelGroup') as THREE.Group;
      if (!modelGroup) {
        console.warn("ModelGroup not found for fallback geometry");
      }

      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 150, 16);
      const material = new THREE.MeshStandardMaterial({
        color: '#6366f1',
        metalness: 0.9,
        roughness: 0.1,
      });

      const torusKnot = new THREE.Mesh(geometry, material);
      torusKnot.name = 'TorusKnot';
      torusKnot.position.y = 1.8;
      torusKnot.castShadow = true;
      torusKnot.receiveShadow = true;
      modelGroup.add(torusKnot);

      viewerStore.setActiveModelName('Metallic Torus Knot (Protected Engine)');
    }
  }, [viewer]);

  // 3. Premium Plugin Activation (Requires license authorization)
  useEffect(() => {
    if (!isAuthComplete || !viewer) return;

    // Attach premium modules (Gated by license in ThreeViewer.ts)
    viewer.addPlugin(new EnvironmentPlugin());
    viewer.addPlugin(new SSGIPlugin());
    viewer.addPlugin(new SSRPlugin());
    viewer.addPlugin(new ProgressiveShadowPlugin());
    viewer.addPlugin(new FloorPlugin());
    viewer.addPlugin(new BloomPlugin());
    viewer.addPlugin(new DiamondPlugin());
    viewer.addPlugin(new DOFPlugin());
    viewer.addPlugin(new CameraPlugin());
    viewer.addPlugin(new MaterialRaycasterPlugin());
    viewer.addPlugin(new TransformGizmoPlugin());
    viewer.addPlugin(new AnimationPlugin());
    viewer.addPlugin(new ExportPlugin());
    viewer.addPlugin(new OutlinePlugin());
    viewer.addPlugin(new MeasurementPlugin());
    viewer.addPlugin(new CinematicPlugin());
  }, [isAuthComplete, viewer]);

  return (
    <>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', outline: 'none', background: '#03050c' }}
      />

      <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '1rem', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '5px 12px', borderRadius: '4px', border: '1px solid rgba(0, 242, 254, 0.3)', fontSize: '0.65rem', color: '#00f2fe' }}>
          VST_ENGINE_SHIELD: ACTIVE
        </div>
      </div>
    </>
  );
});

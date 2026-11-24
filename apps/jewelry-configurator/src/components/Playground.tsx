import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  AppHeaderBar,
  CanvasControlToolbar,
  FloatingControlDock,
  useVictorShellTheme
} from '@trikomi/ui-kit';
import {
  JewelryInspector,
  PRECIOUS_METALS,
  MetalOption,
  RingOption
} from './JewelryInspector';

const AVAILABLE_RINGS: RingOption[] = [
  {
    name: 'Classic Solitaire',
    url: `${import.meta.env.BASE_URL}models/ring.glb`,
    thumb: `${import.meta.env.BASE_URL}thumbs/ring1.png`
  },
  {
    name: 'Halo Setting',
    url: `${import.meta.env.BASE_URL}models/ring2.glb`,
    thumb: `${import.meta.env.BASE_URL}thumbs/ring2.png`
  }
];

export const Playground: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ThreeViewer | null>(null);

  // VictorShell Theme Context
  const { accent, setAccent } = useVictorShellTheme();

  // Configurator Selection State
  const [activeRingIndex, setActiveRingIndex] = useState(0);
  const [diamondThumbs, setDiamondThumbs] = useState<Record<string, string>>({});
  const [diamondGeometries, setDiamondGeometries] = useState<Record<string, THREE.BufferGeometry>>({});
  const [activeShape, setActiveShape] = useState<string | undefined>(undefined);
  const [zRotation, setZRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(100);
  const [yOffset, setYOffset] = useState<number>(0);
  const [selectedMetal, setSelectedMetal] = useState<MetalOption>(PRECIOUS_METALS[0]);

  // UI Drawer & Dock State
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [activeDockTab, setActiveDockTab] = useState('rings');
  const [isBloomActive, setIsBloomActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Responsive mobile collapse observer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsInspectorOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Initialize ThreeViewer with WebGPU Diamond dispersion plugins
  useEffect(() => {
    if (!containerRef.current) return;

    viewerStore.floorTransparent = false;
    viewerStore.setSsgiEnabled(false);
    viewerStore.setSSREnabled(false);
    viewerStore.setProgressiveShadowEnabled(false);
    viewerStore.setBloomEnabled(true);

    const viewer = new ThreeViewer(containerRef.current, viewerStore, {
      onAuthorized: () => {
        viewer.addPlugin(new SSGIPlugin());
        viewer.addPlugin(new SSRPlugin());
        viewer.addPlugin(new ProgressiveShadowPlugin());
        viewer.addPlugin(new FloorPlugin());
        viewer.addPlugin(new ExportPlugin());
        viewer.addPlugin(new CinematicPlugin());
      }
    });
    viewerStore.viewer = viewer;

    viewer.addPlugin(new EnvironmentPlugin());
    viewer.addPlugin(new BloomPlugin());
    viewer.addPlugin(new DiamondPlugin());
    viewer.addPlugin(new OrbitControlsPlugin());
    viewer.addPlugin(new GLTFPlugin());
    viewer.addPlugin(new CenterModelPlugin());
    viewer.addPlugin(new StatsPlugin());
    viewerStore.showStats = true;

    viewer.camera.position.set(0, 2.5, 4.5);
    viewer.camera.lookAt(0, 0, 0);

    viewerRef.current = viewer;

    // Load initial ring model
    const modelToLoad: string = (viewerStore.options as any)?.model || AVAILABLE_RINGS[0].url;
    const gltfPlugin = viewer.getPlugin(GLTFPlugin);
    if (gltfPlugin) {
      gltfPlugin.loadModel(modelToLoad, 'jewelry_model_0').then(() => {
        viewer.getPlugin(OrbitControlsPlugin)?.resetView();
        const diamondPlugin = viewer.getPlugin(DiamondPlugin) as any;
        if (diamondPlugin && typeof diamondPlugin.applyDiamondMaterial === 'function') {
          diamondPlugin.applyDiamondMaterial();
        }
      }).catch(err => console.error(`Failed to load ${modelToLoad}`, err));
    }

    return () => {
      viewerStore.viewer = null;
      viewer.dispose();
    };
  }, []);

  useEffect(() => {
    viewerStore.backgroundColor = '#171427';
  }, []);

  // 2. Fetch diamond thumbnail map
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}json/diamond_map.json`)
      .then(res => res.json())
      .then(data => setDiamondThumbs(data as Record<string, string>))
      .catch(err => console.error("Failed to load diamond map", err));
  }, []);

  // 3. Load diamond geometries in background with DRACO loader
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/gltf/`);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      `${import.meta.env.BASE_URL}models/diamonds.glb`,
      (gltf) => {
        const geos: Record<string, THREE.BufferGeometry> = {};
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            geos[mesh.name] = mesh.geometry;
          }
        });
        setDiamondGeometries(geos);
        dracoLoader.dispose();
      },
      undefined,
      (err) => {
        console.error("Failed to load diamond geometries", err);
      }
    );
  }, []);

  // Scan model meshes for diamond and metal components
  const scanModelMeshes = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return null;
    const targetModel = viewerStore.currentModel || viewer.runtimeRoot?.children[0]?.nativeObject || viewer.scene;
    if (!targetModel) return null;

    let foundDiamond: any = null;
    const metalMats: Array<{ mat: any; mesh: any }> = [];

    targetModel.traverse((child: any) => {
      if (child.isMesh || child.isInstancedMesh) {
        if (!child.userData.originalSize && child.geometry) {
          child.geometry.computeBoundingBox();
          const size = new THREE.Vector3();
          if (child.geometry.boundingBox) {
            child.geometry.boundingBox.getSize(size);
            child.userData.originalSize = size;
          }
        }
        if (!child.userData.originalGeometry && child.geometry) {
          child.userData.originalGeometry = child.geometry.clone();
        }

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: any) => {
          if (!mat) return;
          const isDiamondMat =
            (mat.name && mat.name.toLowerCase().includes('diamond')) ||
            (mat.color && mat.color.value && mat.color.value.isColor);
          if (isDiamondMat && !foundDiamond) {
            foundDiamond = child;
          } else if (!isDiamondMat) {
            metalMats.push({ mat, mesh: child });
          }
        });
      }
    });

    return { diamondMesh: foundDiamond, metalMaterials: metalMats };
  }, [viewerStore.currentModel]);

  // Apply precious metal alloy color to ring band and prongs
  const applyMetalToModel = useCallback((metal: MetalOption) => {
    const scanned = scanModelMeshes();
    if (!scanned) return;
    scanned.metalMaterials.forEach(({ mat }) => {
      if (mat) {
        if (mat.color && mat.color.value && mat.color.value.isColor) {
          mat.color.value.set(metal.hex);
        } else if (mat.color && mat.color.isColor) {
          mat.color.set(metal.hex);
        }
        mat.needsUpdate = true;
      }
    });
  }, [scanModelMeshes]);

  const handleSelectMetal = (metal: MetalOption) => {
    setSelectedMetal(metal);
    applyMetalToModel(metal);
  };

  // Apply diamond geometry cut, scale, and rotation transforms
  const applyGeometryTransform = useCallback(async (
    shapeName: string | undefined,
    rotationZ: number,
    scaleOffset: number,
    yOffsetVal: number,
    isFinal: boolean
  ) => {
    const scanned = scanModelMeshes();
    const mesh: any = scanned?.diamondMesh;
    if (!mesh) return;

    let cloned: THREE.BufferGeometry;

    if (shapeName && diamondGeometries[shapeName]) {
      const baseGeom = diamondGeometries[shapeName];
      cloned = baseGeom.clone();
      cloned.rotateY(rotationZ * (Math.PI / 180));

      if (mesh.userData.originalSize) {
        cloned.computeBoundingBox();
        const currentSize = new THREE.Vector3();
        if (cloned.boundingBox) {
          cloned.boundingBox.getSize(currentSize);
          const targetSize = mesh.userData.originalSize;
          const targetFootprint = Math.max(targetSize.x, targetSize.z);
          const currentFootprint = Math.max(currentSize.x, currentSize.z);

          if (currentFootprint > 0) {
            const s = (targetFootprint / currentFootprint) * (scaleOffset / 100);
            cloned.scale(s, s, s);
          }
        }
      }
    } else {
      if (!mesh.userData.originalGeometry) return;
      cloned = mesh.userData.originalGeometry.clone();
      cloned.rotateY(rotationZ * (Math.PI / 180));
      const s = scaleOffset / 100;
      cloned.scale(s, s, s);
    }

    if (yOffsetVal !== 0) {
      cloned.translate(0, yOffsetVal / 100, 0);
    }

    const viewer = viewerRef.current;
    if (viewer) {
      if (isFinal) {
        const diamondPlugin = viewer.getPlugin(DiamondPlugin) as any;
        if (diamondPlugin && diamondPlugin.updateDiamondGeometry) {
          await diamondPlugin.updateDiamondGeometry(mesh, cloned);
        } else {
          mesh.geometry = cloned;
        }
      } else {
        mesh.geometry = cloned;
      }
    }
  }, [diamondGeometries, scanModelMeshes]);

  const handleSelectShape = (shapeName: string) => {
    setActiveShape(shapeName);
    applyGeometryTransform(shapeName, zRotation, scale, yOffset, true);
  };

  const handleRotationChange = (val: number, isFinal: boolean) => {
    setZRotation(val);
    applyGeometryTransform(activeShape, val, scale, yOffset, isFinal);
  };

  const handleScaleChange = (val: number, isFinal: boolean) => {
    setScale(val);
    applyGeometryTransform(activeShape, zRotation, val, yOffset, isFinal);
  };

  const handleYOffsetChange = (val: number, isFinal: boolean) => {
    setYOffset(val);
    applyGeometryTransform(activeShape, zRotation, scale, val, isFinal);
  };

  // Ring setting change handler
  const handleRingChange = async (index: number) => {
    if (viewerStore.isModelLoading || index === activeRingIndex) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const plugin = viewer.getPlugin(GLTFPlugin);
    if (!plugin) return;

    setActiveRingIndex(index);
    setActiveShape(undefined);
    setZRotation(0);
    setScale(100);
    setYOffset(0);

    try {
      const ring = AVAILABLE_RINGS[index];
      await plugin.loadModel(ring.url, `jewelry_model_${index}`);
      viewer.getPlugin(OrbitControlsPlugin)?.resetView();
      const diamondPlugin = viewer.getPlugin(DiamondPlugin) as any;
      if (diamondPlugin && typeof diamondPlugin.applyDiamondMaterial === 'function') {
        diamondPlugin.applyDiamondMaterial();
      }
      applyMetalToModel(selectedMetal);
    } catch (e) {
      console.error('Error switching rings:', e);
    }
  };

  // Dynamic estimated price calculation
  const estimatedPrice = useMemo(() => {
    const baseSettingPrice = activeRingIndex === 0 ? 1950 : 2550;
    const metalPrice = selectedMetal?.priceModifier || 650;
    const caratMultiplier = (scale / 100) ** 1.8;
    const centerStonePrice = Math.round(1800 * caratMultiplier);
    return baseSettingPrice + metalPrice + centerStonePrice;
  }, [activeRingIndex, selectedMetal, scale]);

  // Bloom toggle handler
  const handleToggleBloom = () => {
    const next = !isBloomActive;
    setIsBloomActive(next);
    viewerStore.setBloomEnabled(next);
    const bloom = viewerRef.current?.getPlugin(BloomPlugin);
    if (bloom) {
      bloom.enabled = next;
    }
  };

  // Reset View handler
  const handleResetView = () => {
    viewerRef.current?.getPlugin(OrbitControlsPlugin)?.resetView();
  };

  // Export 3D GLTF handler
  const handleExport = () => {
    const exportPlugin = viewerRef.current?.getPlugin(ExportPlugin);
    if (exportPlugin) {
      exportPlugin.exportGLTF();
    }
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Floating dock tab click handler
  const handleDockTabClick = (tabId: string) => {
    if (isInspectorOpen && activeDockTab === tabId) {
      setIsInspectorOpen(false);
    } else {
      setActiveDockTab(tabId);
      setIsInspectorOpen(true);
    }
  };

  const dockItems = [
    {
      id: 'rings',
      icon: '💍',
      label: 'Setting'
    },
    {
      id: 'gemstones',
      icon: '💎',
      label: 'Diamond'
    },
    {
      id: 'metals',
      icon: '✨',
      label: 'Metals'
    },
    {
      id: 'optics',
      icon: '🔬',
      label: 'Optics'
    },
    {
      id: 'summary',
      icon: '🏷️',
      label: 'Price'
    }
  ];

  return (
    <div className="jewelry-studio-stage">
      {/* 3D Canvas Viewport */}
      <div
        className="canvas-container"
        ref={containerRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Loading Overlay */}
      {viewerStore.isModelLoading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10, 12, 28, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#e0aaff'
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}svgs/spinner.svg`}
            width={60}
            alt="Loading..."
            style={{ marginBottom: '15px' }}
          />
          <div style={{ letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>
            LOADING GEMSTONE MODEL...
          </div>
        </div>
      )}

      {/* Non-blocking UI Overlay */}
      <div
        className="vs-jewelry-ui-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 20
        }}
      >
        {/* Top Header Bar */}
        <div style={{ pointerEvents: 'auto' }}>
          <AppHeaderBar
            brandTitle="TRIKOMI"
            productTitle="Jewelry Configurator"
            statusBadge={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--vs-text-primary, #ffffff)'
                }}
              >
                <span>{AVAILABLE_RINGS[activeRingIndex]?.name}</span>
                <span style={{ opacity: 0.5 }}>•</span>
                <span>{selectedMetal.alloy}</span>
                <span style={{ opacity: 0.5 }}>•</span>
                <span style={{ color: 'var(--vs-accent-primary, #e0aaff)' }}>
                  ${estimatedPrice.toLocaleString()} USD
                </span>
              </span>
            }
            onBack={() => {
              window.location.hash = '#/';
            }}
            theme={accent}
            onThemeChange={setAccent}
          />
        </div>

        {/* Top-Right Canvas Controls */}
        <div style={{ pointerEvents: 'auto' }}>
          <CanvasControlToolbar
            position="top-right"
            onRecenter={handleResetView}
            extraActions={
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleToggleBloom}
                  className={`vs-canvas-toolbar__btn ${isBloomActive ? 'is-active' : ''}`}
                  title={isBloomActive ? 'Bloom Shimmer: Active' : 'Bloom Shimmer: Inactive'}
                  aria-label="Toggle Bloom"
                >
                  <span style={{ fontSize: '14px' }}>{isBloomActive ? '✨' : '💫'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="vs-canvas-toolbar__btn"
                  title="Export 3D Model"
                  aria-label="Export 3D"
                >
                  <span style={{ fontSize: '14px' }}>📥</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className={`vs-canvas-toolbar__btn ${isFullscreen ? 'is-active' : ''}`}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  aria-label="Toggle Fullscreen"
                >
                  <span style={{ fontSize: '14px' }}>⛶</span>
                </button>
              </div>
            }
          />
        </div>

        {/* Bottom Center Floating Dock */}
        <div style={{ pointerEvents: 'auto' }}>
          <FloatingControlDock
            position="bottom"
            items={dockItems}
            activeId={isInspectorOpen ? activeDockTab : null}
            onSelect={handleDockTabClick}
          />
        </div>

        {/* Right-Hand Glassmorphic Inspector Drawer */}
        <div style={{ pointerEvents: 'auto' }}>
          <JewelryInspector
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
            activeTab={activeDockTab}
            onTabChange={setActiveDockTab}
            rings={AVAILABLE_RINGS}
            activeRingIndex={activeRingIndex}
            onSelectRing={handleRingChange}
            diamondThumbs={diamondThumbs}
            activeShape={activeShape}
            onSelectShape={handleSelectShape}
            zRotation={zRotation}
            onRotationChange={handleRotationChange}
            scale={scale}
            onScaleChange={handleScaleChange}
            yOffset={yOffset}
            onYOffsetChange={handleYOffsetChange}
            selectedMetal={selectedMetal}
            onSelectMetal={handleSelectMetal}
            isBloomActive={isBloomActive}
            onToggleBloom={handleToggleBloom}
            onResetView={handleResetView}
            onExportGLTF={handleExport}
          />
        </div>
      </div>
    </div>
  );
});

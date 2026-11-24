import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ==========================================================================
   1. ViewerHero3DCanvas — Hero 3D Metallic Purple Torus Knot Experience
   ========================================================================== */

export interface ViewerHero3DCanvasProps {
  className?: string;
  themeMode?: 'light' | 'dark';
}

export const ViewerHero3DCanvas: React.FC<ViewerHero3DCanvasProps> = ({
  className = '',
  themeMode = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animId: number;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 440;

    // Scene & Camera (Closer camera framing to complement 18% larger 3D object)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 4.0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Environment Lighting
    const pmremGen = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGen.fromScene(new RoomEnvironment()).texture;

    // Directional Lighting Setup matching reference colors (Purple & Cyan neon)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xa855f7, 3.4);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00e5ff, 2.6);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 3.2);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Point lights for stage rim illumination
    const blueStageLight = new THREE.PointLight(0x38bdf8, 2.5, 6);
    blueStageLight.position.set(0, -0.6, 1.2);
    scene.add(blueStageLight);

    const purpleStageLight = new THREE.PointLight(0x9333ea, 2.5, 6);
    purpleStageLight.position.set(0, -0.6, -1.2);
    scene.add(purpleStageLight);

    // Multi-tiered circular metallic pedestal
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const tier1Geo = new THREE.CylinderGeometry(1.90, 2.05, 0.12, 64);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: 0x0b0e24,
      metalness: 0.9,
      roughness: 0.2
    });
    const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
    tier1.position.y = -1.0;
    tier1.receiveShadow = true;
    stageGroup.add(tier1);

    const tier2Geo = new THREE.CylinderGeometry(1.55, 1.68, 0.14, 64);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0x121838,
      metalness: 0.85,
      roughness: 0.25
    });
    const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2.position.y = -0.88;
    tier2.receiveShadow = true;
    stageGroup.add(tier2);

    // Glowing Neon Rings on Pedestal
    const neonRing1Geo = new THREE.TorusGeometry(1.94, 0.016, 16, 80);
    const neonRing1Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const neonRing1 = new THREE.Mesh(neonRing1Geo, neonRing1Mat);
    neonRing1.rotation.x = Math.PI / 2;
    neonRing1.position.y = -0.94;
    stageGroup.add(neonRing1);

    const neonRing2Geo = new THREE.TorusGeometry(1.58, 0.018, 16, 80);
    const neonRing2Mat = new THREE.MeshBasicMaterial({ color: 0x7c3aed });
    const neonRing2 = new THREE.Mesh(neonRing2Geo, neonRing2Mat);
    neonRing2.rotation.x = Math.PI / 2;
    neonRing2.position.y = -0.81;
    stageGroup.add(neonRing2);

    // Tilted Futuristic Polygon Portal Frame behind the knot
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0.35, -0.6);
    portalGroup.rotation.z = -0.15;
    portalGroup.rotation.x = 0.08;
    scene.add(portalGroup);

    const portalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.1, -1.3, 0),
      new THREE.Vector3(-2.2, 1.6, 0),
      new THREE.Vector3(0, 2.15, 0),
      new THREE.Vector3(2.2, 1.6, 0),
      new THREE.Vector3(2.1, -1.3, 0)
    ], true);
    const portalGeo = new THREE.TubeGeometry(portalCurve, 64, 0.022, 12, true);
    const portalMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalGroup.add(portalMesh);

    // Inner orbiting light ring
    const orbitRingGeo = new THREE.TorusGeometry(2.0, 0.012, 16, 100);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.8
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = 1.1;
    orbitRing.rotation.y = 0.4;
    portalGroup.add(orbitRing);

    // Center 3D Attraction: Torus Knot Geometry (18% Larger Scale per Prompt 02)
    const knotGroup = new THREE.Group();
    scene.add(knotGroup);

    const knotGeo = new THREE.TorusKnotGeometry(1.06, 0.35, 160, 32, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x1f0b3d,
      roughness: 0.12,
      metalness: 0.94,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      envMapIntensity: 2.2
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotMesh.castShadow = true;
    knotMesh.receiveShadow = true;
    knotGroup.add(knotMesh);

    knotGroup.position.set(0, 0.28, 0);

    // OrbitControls for real-time mouse drag & touch rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 2.4;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.minPolarAngle = Math.PI / 6;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    controls.addEventListener('start', () => setIsInteracting(true));
    controls.addEventListener('end', () => setIsInteracting(false));

    // Handle Resize & Responsive 3D Object Scaling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      camera.aspect = aspect;
      // On narrow mobile screens (aspect < 1.1), dynamically scale camera distance and FOV
      // to ensure the entire 3D Torus Knot and cyan orbit rings remain 100% visible with zero clipping
      if (aspect < 1.1) {
        camera.fov = Math.min(56, 45 / Math.max(0.72, aspect));
        camera.position.set(0, 0.35, 4.0 / Math.max(0.80, aspect));
      } else {
        camera.fov = 45;
        camera.position.set(0, 0.4, 4.0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle floating sine wave breathing animation
      knotGroup.position.y = 0.28 + Math.sin(elapsed * 1.5) * 0.05;

      // Slow portal ring spin
      orbitRing.rotation.z = elapsed * 0.25;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      pmremGen.dispose();
      scene.clear();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tk-hero-3d-canvas-wrap ${className}`}
      data-testid="hero-3d-viewport"
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        maxWidth: '520px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab'
      }}
    >
      {/* Floating Interactive 360 Hint Pill */}
      <div
        className="tk-hero-3d-hint"
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(13, 19, 43, 0.75)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          color: '#E2E8F0',
          fontSize: '12px',
          fontWeight: 600,
          backdropFilter: 'blur(12px)',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
          transition: 'opacity 0.25s ease',
          opacity: isInteracting ? 0.4 : 1
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        <span>Interactive 3D · Drag to Rotate</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. ViewerPreviewStudio — Commercial 3D Workstation Preview Panel
   ========================================================================== */

export interface ViewerPreviewStudioProps {
  className?: string;
  onLaunchDemo?: () => void;
  themeMode?: 'light' | 'dark';
}

interface MaterialSwatch {
  id: string;
  name: string;
  color: number;
  hex: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
}

const MATERIAL_SWATCHES: MaterialSwatch[] = [
  { id: 'purple-chrome', name: 'Violet Chrome', color: 0x9333ea, hex: '#9333EA', metalness: 0.95, roughness: 0.12, clearcoat: 1.0 },
  { id: 'electric-cyan', name: 'Electric Cyan', color: 0x00e5ff, hex: '#00E5FF', metalness: 0.90, roughness: 0.14, clearcoat: 0.9 },
  { id: 'royal-blue', name: 'Royal Blue', color: 0x2563eb, hex: '#2563EB', metalness: 0.88, roughness: 0.15, clearcoat: 0.8 },
  { id: 'gold', name: '24K Gold', color: 0xf59e0b, hex: '#F59E0B', metalness: 0.98, roughness: 0.10, clearcoat: 0.9 },
  { id: 'rose-gold', name: 'Rose Gold', color: 0xfb7185, hex: '#FB7185', metalness: 0.92, roughness: 0.16, clearcoat: 0.8 },
  { id: 'titanium', name: 'Titanium Silver', color: 0xe2e8f0, hex: '#E2E8F0', metalness: 0.96, roughness: 0.18, clearcoat: 0.7 },
  { id: 'obsidian', name: 'Obsidian Black', color: 0x1e293b, hex: '#1E293B', metalness: 0.85, roughness: 0.22, clearcoat: 1.0 }
];

interface ProductModelOption {
  id: string;
  label: string;
  url?: string;
  type: 'procedural' | 'gltf';
}

const PRODUCT_MODELS: ProductModelOption[] = [
  { id: 'torus', label: 'Torus Sculpture', type: 'procedural' },
  { id: 'ring', label: 'Diamond Ring', url: '/models/ring.glb', type: 'gltf' },
  { id: 'glasses', label: 'Eyewear Frame', url: '/models/glasses.glb', type: 'gltf' }
];

export const ViewerPreviewStudio: React.FC<ViewerPreviewStudioProps> = ({
  className = '',
  onLaunchDemo,
  themeMode = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRootRef = useRef<HTMLDivElement>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lightsRef = useRef<{ key: THREE.DirectionalLight; fill: THREE.DirectionalLight; rim: THREE.DirectionalLight } | null>(null);

  const [activeModelId, setActiveModelId] = useState<string>('torus');
  const [activeSwatch, setActiveSwatch] = useState<string>('purple-chrome');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<'neon' | 'studio' | 'sunset'>('neon');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper to load or create 3D model
  const loadModel = useCallback((modelId: string) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean up existing model
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current = null;
    }

    const newGroup = new THREE.Group();
    scene.add(newGroup);
    currentModelGroupRef.current = newGroup;

    const swatch = MATERIAL_SWATCHES.find(s => s.id === activeSwatch) || MATERIAL_SWATCHES[0];

    if (modelId === 'torus') {
      const knotGeo = new THREE.TorusKnotGeometry(0.85, 0.28, 140, 30, 2, 3);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: swatch.color,
        roughness: swatch.roughness,
        metalness: swatch.metalness,
        clearcoat: swatch.clearcoat || 0.8,
        clearcoatRoughness: 0.1,
        wireframe: isWireframe,
        envMapIntensity: 2.0
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      knotMesh.castShadow = true;
      knotMesh.receiveShadow = true;
      knotMesh.position.set(0, 0.05, 0);
      newGroup.add(knotMesh);
      setIsLoading(false);
    } else {
      const opt = PRODUCT_MODELS.find(m => m.id === modelId);
      if (opt && opt.url) {
        setIsLoading(true);
        const loader = new GLTFLoader();
        loader.load(
          opt.url,
          (gltf) => {
            const model = gltf.scene;

            // Center and normalize model dimensions
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetScale = modelId === 'ring' ? 1.7 / (maxDim || 1) : 2.0 / (maxDim || 1);

            model.scale.setScalar(targetScale);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center.multiplyScalar(targetScale));

            if (modelId === 'ring') {
              model.position.y += 0.05;
              model.rotation.set(0.3, -0.6, -0.3);
            } else if (modelId === 'glasses') {
              model.position.y += 0.12;
              model.rotation.set(0.05, -0.3, 0);
            }

            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (isWireframe && mesh.material) {
                  (mesh.material as THREE.Material).wireframe = true;
                }
              }
            });

            newGroup.add(model);
            setIsLoading(false);
          },
          undefined,
          (err) => {
            console.warn('[ViewerPreviewStudio] Model load warning, fallback to Torus:', err);
            // Fallback to Torus geometry
            const fallbackGeo = new THREE.TorusKnotGeometry(0.85, 0.28, 120, 24, 2, 3);
            const fallbackMat = new THREE.MeshPhysicalMaterial({ color: swatch.color, metalness: 0.9, roughness: 0.15 });
            newGroup.add(new THREE.Mesh(fallbackGeo, fallbackMat));
            setIsLoading(false);
          }
        );
      }
    }
  }, [activeSwatch, isWireframe]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animId: number;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.appendChild(renderer.domElement);

    // Environment map
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);

    const key = new THREE.DirectionalLight(0x9333ea, 3.2);
    key.position.set(3, 4, 3);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x00e5ff, 2.4);
    fill.position.set(-3, 2, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc084fc, 2.8);
    rim.position.set(0, 3, -3);
    scene.add(rim);

    lightsRef.current = { key, fill, rim };

    // Subdued Circular Grid Floor
    const gridHelper = new THREE.PolarGridHelper(2.4, 16, 8, 64, 0x9333ea, 0x1e293b);
    gridHelper.position.y = -0.92;
    scene.add(gridHelper);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.4;
    controls.minDistance = 1.8;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 0.05, 0);
    controlsRef.current = controls;

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle breathing motion for floating model
      if (currentModelGroupRef.current) {
        currentModelGroupRef.current.position.y = Math.sin(elapsed * 1.8) * 0.025;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Initial model load
    loadModel(activeModelId);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      pmrem.dispose();
      scene.clear();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Model Selection
  const handleSelectModel = (modelId: string) => {
    setActiveModelId(modelId);
    loadModel(modelId);
  };

  // Update Material Swatch Live
  const handleSelectSwatch = (swatch: MaterialSwatch) => {
    setActiveSwatch(swatch.id);
    if (!currentModelGroupRef.current) return;

    currentModelGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshPhysicalMaterial;
          if (mat.color) mat.color.setHex(swatch.color);
          if (mat.metalness !== undefined) mat.metalness = swatch.metalness;
          if (mat.roughness !== undefined) mat.roughness = swatch.roughness;
          if (swatch.clearcoat !== undefined && mat.clearcoat !== undefined) mat.clearcoat = swatch.clearcoat;
          mat.needsUpdate = true;
        }
      }
    });
  };

  // Toggle Wireframe
  const handleToggleWireframe = () => {
    setIsWireframe((prev) => {
      const next = !prev;
      if (currentModelGroupRef.current) {
        currentModelGroupRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              (mesh.material as THREE.Material).wireframe = next;
            }
          }
        });
      }
      return next;
    });
  };

  // Toggle Auto-Rotation
  const handleToggleAutoRotate = () => {
    setIsAutoRotate((prev) => {
      const next = !prev;
      if (controlsRef.current) {
        controlsRef.current.autoRotate = next;
      }
      return next;
    });
  };

  // Zoom In / Zoom Out Controls
  const handleZoom = (direction: 'in' | 'out') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const factor = direction === 'in' ? 0.8 : 1.25;
    camera.position.multiplyScalar(factor);
    controls.update();
  };

  // Cycle Lighting Preset
  const handleCycleLighting = () => {
    const next = lightingPreset === 'neon' ? 'studio' : lightingPreset === 'studio' ? 'sunset' : 'neon';
    setLightingPreset(next);
    if (!lightsRef.current) return;

    if (next === 'neon') {
      lightsRef.current.key.color.setHex(0x9333ea);
      lightsRef.current.fill.color.setHex(0x00e5ff);
      lightsRef.current.rim.color.setHex(0xc084fc);
    } else if (next === 'studio') {
      lightsRef.current.key.color.setHex(0xffffff);
      lightsRef.current.fill.color.setHex(0xe2e8f0);
      lightsRef.current.rim.color.setHex(0xffffff);
    } else {
      // Sunset
      lightsRef.current.key.color.setHex(0xf97316);
      lightsRef.current.fill.color.setHex(0xa855f7);
      lightsRef.current.rim.color.setHex(0xfde047);
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 0.35, 3.8);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    const root = studioRootRef.current;
    if (!root) return;

    if (!document.fullscreenElement) {
      root.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div
      ref={studioRootRef}
      className={`tk-preview-studio ${className} ${isFullscreen ? 'is-fullscreen' : ''}`}
      data-testid="preview-studio-panel"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: isFullscreen ? '100vw' : '580px',
        height: isFullscreen ? '100vh' : undefined,
        background: 'rgba(13, 19, 43, 0.85)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: isFullscreen ? '0' : '22px',
        overflow: 'hidden',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.45), 0 0 35px rgba(139, 92, 246, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Studio Top Control Bar */}
      <div
        className="tk-studio-topbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(7, 11, 25, 0.75)',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
            3D Studio
          </span>

          {/* Model Switcher Pills */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '6px', flexWrap: 'wrap' }}>
            {PRODUCT_MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectModel(m.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: activeModelId === m.id ? 'rgba(139, 92, 246, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                  border: activeModelId === m.id ? '1px solid #A855F7' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: activeModelId === m.id ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#C084FC',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            60 FPS · WebGPU
          </span>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#E2E8F0',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="tk-studio-canvas-wrap"
        style={{
          position: 'relative',
          flex: '1 1 0%',
          minHeight: 0,
          width: '100%',
          height: '100%',
          cursor: 'grab',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(7, 11, 25, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#C084FC',
              fontSize: '13px',
              fontWeight: 600,
              zIndex: 20
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                borderTopColor: '#A855F7',
                borderRadius: '50%',
                animation: 'tk-spin 0.8s linear infinite'
              }}
            />
            <span>Loading 3D Model...</span>
          </div>
        )}

        {/* Left Floating Toolbar */}
        <div
          className="tk-studio-toolbar"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: 'rgba(7, 11, 25, 0.75)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '10px',
            padding: '4px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            maxHeight: 'calc(100% - 24px)',
            overflowY: 'auto'
          }}
        >
          {/* Wireframe Toggle */}
          <button
            type="button"
            onClick={handleToggleWireframe}
            title={`Toggle Wireframe (${isWireframe ? 'ON' : 'OFF'})`}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: isWireframe ? 'rgba(139, 92, 246, 0.4)' : 'transparent',
              border: isWireframe ? '1px solid #A855F7' : 'none',
              color: isWireframe ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            title={`Toggle Auto-Rotation (${isAutoRotate ? 'ON' : 'OFF'})`}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: isAutoRotate ? 'rgba(139, 92, 246, 0.4)' : 'transparent',
              border: isAutoRotate ? '1px solid #A855F7' : 'none',
              color: isAutoRotate ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => handleZoom('in')}
            title="Zoom In"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          {/* Lighting Preset Cycle */}
          <button
            type="button"
            onClick={handleCycleLighting}
            title={`Lighting: ${lightingPreset.toUpperCase()} (Click to toggle)`}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset Camera View"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Material / Color Swatches Bar */}
      <div
        className="tk-studio-bottombar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'rgba(7, 11, 25, 0.85)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 10,
          gap: '12px',
          flexWrap: 'wrap',
          flexShrink: 0,
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', whiteSpace: 'nowrap' }}>
            Materials:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {MATERIAL_SWATCHES.map((swatch) => {
              const isSelected = activeSwatch === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => handleSelectSwatch(swatch)}
                  title={`${swatch.name} Material`}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: swatch.hex,
                    border: isSelected ? '2px solid #FFFFFF' : '2px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: isSelected ? `0 0 12px ${swatch.hex}, 0 2px 6px rgba(0, 0, 0, 0.4)` : '0 1px 3px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    flexShrink: 0
                  }}
                />
              );
            })}
          </div>
        </div>

        {onLaunchDemo && (
          <button
            type="button"
            className="tk-btn-studio-open"
            onClick={onLaunchDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(139, 92, 246, 0.45)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span>Open Studio</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

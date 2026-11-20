import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { generateSportswearJerseySvg } from './sportswearTexture';

export interface Hero3DCanvasProps {
  /** GLTF/GLB model URL to load from public assets (e.g. '/models/ring.glb'). */
  modelUrl?: string;
  /** Presets that customize scene lighting, materials, and specialized geometry. */
  preset: 'jewelry' | 'eyewear' | 'sportswear' | 'box' | 'mocap' | 'tour' | 'viewer';
  /** Active material / color variant (e.g. 'platinum', 'yellow', 'rose', or fabric type for sportswear). */
  activeMaterial?: string;
  /** Box unfold percentage (0 - 100) for packaging fold kinematics. */
  unfoldPercent?: number;
  /** Active cut or variant name for jewelry/eyewear, or pattern for sportswear. */
  activeVariant?: string;
  /** Active color for sportswear ('purple', 'blue', 'red', 'orange', 'white'). */
  activeColor?: string;
  /** Active player number for sportswear jersey (e.g. '10'). */
  activeNumber?: string;
  /** Additional CSS class names. */
  className?: string;
}

function createLensGradientTexture(topColor: string, bottomColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTortoiseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#78350F';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#291104';
    for (let i = 0; i < 35; i++) {
      const x = (i * 37) % 256;
      const y = (i * 59) % 256;
      const r = 8 + (i % 14);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(217, 119, 6, 0.45)';
    for (let i = 0; i < 25; i++) {
      const x = (i * 73) % 256;
      const y = (i * 31) % 256;
      const r = 6 + (i % 10);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function getEyewearLensMaterial(lensType?: string): THREE.Material {
  const type = lensType || 'purple';
  if (type === 'clear') {
    return new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      transmission: 0.95,
      roughness: 0.02,
      transparent: true,
      opacity: 0.35,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02
    });
  } else if (type === 'dark') {
    return new THREE.MeshPhysicalMaterial({
      color: 0x27272a,
      transmission: 0.32,
      roughness: 0.06,
      transparent: true,
      opacity: 0.92,
      ior: 1.52,
      clearcoat: 0.9,
      clearcoatRoughness: 0.04
    });
  } else if (type === 'blue') {
    return new THREE.MeshPhysicalMaterial({
      map: createLensGradientTexture('#1d4ed8', '#93c5fd'),
      color: 0xffffff,
      transmission: 0.72,
      roughness: 0.04,
      transparent: true,
      opacity: 0.92,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02
    });
  } else if (type === 'rose') {
    return new THREE.MeshPhysicalMaterial({
      map: createLensGradientTexture('#be185d', '#fbbf24'),
      color: 0xffffff,
      transmission: 0.72,
      roughness: 0.04,
      transparent: true,
      opacity: 0.92,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02
    });
  }
  // Default 'purple' matching reference image: luminous violet hue with clearcoat
  return new THREE.MeshPhysicalMaterial({
    color: 0x8b28e6,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.28,
    transmission: 0.50,
    roughness: 0.04,
    transparent: true,
    opacity: 0.94,
    ior: 1.52,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02
  });
}

function getEyewearFrameMaterial(frameColor?: string): THREE.Material {
  const color = frameColor || 'black';
  if (color === 'tortoise') {
    return new THREE.MeshStandardMaterial({
      map: createTortoiseTexture(),
      roughness: 0.18,
      metalness: 0.05
    });
  } else if (color === 'brown') {
    return new THREE.MeshStandardMaterial({
      color: 0x4a2a16,
      roughness: 0.22,
      metalness: 0.05
    });
  } else if (color === 'crystal') {
    return new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      transmission: 0.82,
      roughness: 0.12,
      transparent: true,
      opacity: 0.85,
      ior: 1.49,
      clearcoat: 1.0
    });
  } else if (color === 'blue') {
    return new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.28,
      metalness: 0.15
    });
  }
  // Default 'black' matching reference image
  return new THREE.MeshStandardMaterial({
    color: 0x16161a,
    roughness: 0.12,
    metalness: 0.08
  });
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  modelUrl,
  preset,
  activeMaterial = 'platinum',
  unfoldPercent = 0,
  activeVariant,
  activeColor = 'purple',
  activeNumber = '10',
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References to live 3D scene elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const boxPanelsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container) return;

    let isMounted = true;
    let animId: number;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Setup PMREM Studio Environment for realistic PBR reflections & diamond refraction
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const studioEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = studioEnv;

    // 2. Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.minPolarAngle = Math.PI / 4;

    // Allow mouse wheel scrolling to propagate to the page window
    const handleCanvasWheel = (e: WheelEvent) => {
      window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
    };
    canvas.addEventListener('wheel', handleCanvasWheel, { passive: true });

    // 3. Cinematic Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xeaf1ff, 1.4); // Ice Blue fill (#EAF1FF)
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xb23deb, 1.2); // Soft Purple rim (#B23DEB)
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.8); // Front softbox fill
    frontLight.position.set(0, 1.5, 4);
    scene.add(frontLight);

    // Mocap-specific camera & studio lighting overrides
    if (preset === 'mocap') {
      camera.position.set(0, 0.05, 2.5);
      controls.target.set(0, 0, 0);
      controls.autoRotateSpeed = 0.8;

      keyLight.position.set(2, 3, 4);
      keyLight.intensity = 2.4;
      fillLight.color.setHex(0xeaf1ff);
      fillLight.intensity = 1.6;
      fillLight.position.set(-3, 2, 2);
      rimLight.color.setHex(0xb23deb);
      rimLight.intensity = 2.2;
      rimLight.position.set(0, 2, -2.5);
      frontLight.intensity = 2.0;
    } else if (preset === 'jewelry' || preset === 'sportswear' || preset === 'eyewear') {
      // Luxury Studio Lighting, Camera Angle, and Marble Display Pedestal
      if (preset === 'jewelry') {
        camera.position.set(0, 0.55, 3.4);
        controls.target.set(0, 0.05, 0);
      } else if (preset === 'sportswear') {
        camera.position.set(0, 0.30, 3.3);
        controls.target.set(0, 0.08, 0);
      } else {
        camera.position.set(0, 0.38, 3.5);
        controls.target.set(0, 0.10, 0);
      }
      controls.autoRotate = false;
      controls.autoRotateSpeed = 0.5;
      controls.maxPolarAngle = Math.PI / 2 + 0.08;
      controls.minPolarAngle = Math.PI / 4;

      ambient.intensity = 1.75;
      keyLight.position.set(3, 4, 3);
      keyLight.intensity = 2.8;
      fillLight.color.setHex(0xeaf1ff); // Ice Blue fill (#EAF1FF)
      fillLight.intensity = 1.8;
      fillLight.position.set(-3, 2, 2);
      rimLight.color.setHex(0xb23deb); // Soft Purple rim (#B23DEB)
      rimLight.intensity = 2.2;
      rimLight.position.set(0, 2, -2.5);
      frontLight.intensity = 2.4;

      // Circular White Marble Display Pedestal
      const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.48, 0.22, 64);
      const canvasPedestal = document.createElement('canvas');
      canvasPedestal.width = 512;
      canvasPedestal.height = 512;
      const ctx = canvasPedestal.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8f9fc';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = 'rgba(215, 222, 238, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.bezierCurveTo(150, 180, 280, 240, 480, 512);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(195, 205, 230, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 320);
        ctx.bezierCurveTo(160, 260, 340, 380, 512, 340);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(230, 220, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(120, 0);
        ctx.bezierCurveTo(240, 140, 300, 400, 400, 512);
        ctx.stroke();
      }
      const marbleTexture = new THREE.CanvasTexture(canvasPedestal);
      marbleTexture.wrapS = THREE.RepeatWrapping;
      marbleTexture.wrapT = THREE.RepeatWrapping;

      const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: marbleTexture,
        roughness: 0.25,
        metalness: 0.08
      });
      const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestalMesh.position.set(0, preset === 'sportswear' ? -0.82 : -0.68, 0);
      pedestalMesh.receiveShadow = true;
      scene.add(pedestalMesh);

      // Soft glowing circular neon halo ring behind the model
      const haloGeo = new THREE.TorusGeometry(preset === 'sportswear' ? 1.35 : 1.25, 0.015, 16, 100);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(0, preset === 'sportswear' ? 0.28 : 0.18, -0.45);
      scene.add(haloMesh);
    }

    // 4. Preset-Specific Scene Setup
    if (preset === 'tour') {
      // 360 Panoramic Sphere Viewport
      const sphereGeo = new THREE.SphereGeometry(10, 48, 32);
      sphereGeo.scale(-1, 1, 1); // Invert faces to view from inside

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        '/images/brown_photostudio_02.webp',
        (tex) => {
          if (!isMounted) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          const sphereMat = new THREE.MeshBasicMaterial({ map: tex });
          const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
          scene.add(sphereMesh);
          camera.position.set(0, 0, 0.1);
          controls.autoRotateSpeed = 0.6;
          setLoading(false);
        },
        undefined,
        () => {
          // Fallback procedural starry panorama
          const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x1e1b4b,
            wireframe: true
          });
          const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
          scene.add(sphereMesh);
          camera.position.set(0, 0, 0.1);
          setLoading(false);
        }
      );
    } else if (preset === 'box') {
      // Procedural 3D Folding Box Kinematics
      const boxRoot = new THREE.Group();
      scene.add(boxRoot);
      modelRootRef.current = boxRoot;

      const boardMat = new THREE.MeshStandardMaterial({
        color: 0xe0cda9, // Kraft corrugated board
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide
      });

      const whiteLinerMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.4,
        metalness: 0.02,
        side: THREE.DoubleSide
      });

      // Base panel
      const baseGeo = new THREE.PlaneGeometry(1.6, 1.2);
      const baseMesh = new THREE.Mesh(baseGeo, whiteLinerMat);
      baseMesh.rotation.x = -Math.PI / 2;
      boxRoot.add(baseMesh);

      // Flaps / Side Panels
      boxPanelsRef.current = [];
      const createFlap = (w: number, h: number, x: number, z: number, rotY: number) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, 0, z);
        pivot.rotation.y = rotY;

        const flapGeo = new THREE.PlaneGeometry(w, h);
        flapGeo.translate(0, h / 2, 0); // Rotate from hinge edge
        const flapMesh = new THREE.Mesh(flapGeo, boardMat);
        pivot.add(flapMesh);
        boxRoot.add(pivot);
        boxPanelsRef.current.push(pivot);
        return pivot;
      };

      // 4 folding wall panels
      createFlap(1.6, 0.7, 0, 0.6, 0); // Front
      createFlap(1.6, 0.7, 0, -0.6, Math.PI); // Back
      createFlap(1.2, 0.7, -0.8, 0, Math.PI / 2); // Left
      createFlap(1.2, 0.7, 0.8, 0, -Math.PI / 2); // Right

      camera.position.set(0, 2.2, 3.2);
      controls.target.set(0, 0.35, 0);
      setLoading(false);
    } else if (modelUrl) {
      // Load real 3D GLTF/GLB model from assets
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        modelUrl,
        (gltf) => {
          if (!isMounted) return;
          const model = gltf.scene;
          modelRootRef.current = model;

          // Compute bounding box to normalize scale and center model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetScale =
            preset === 'jewelry'
              ? 1.55 / (maxDim || 1)
              : preset === 'mocap'
              ? 2.5 / (maxDim || 1)
              : preset === 'sportswear'
              ? 2.25 / (maxDim || 1)
              : preset === 'eyewear'
              ? 1.82 / (maxDim || 1)
              : 2.0 / (maxDim || 1);

          model.scale.multiplyScalar(targetScale);
          model.position.sub(center.multiplyScalar(targetScale));
          if (preset === 'jewelry') {
            model.position.y -= 0.05;
            model.position.x -= 0.03;
            model.rotation.set(0.35, -0.75, -0.45);
          } else if (preset === 'mocap') {
            model.position.y -= 0.08;
          } else if (preset === 'sportswear') {
            model.position.y += 0.05;
          } else if (preset === 'eyewear') {
            model.position.y += 0.16;
            model.rotation.set(0.04, -0.22, 0);
          }

          // Customize materials based on preset
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (preset === 'jewelry') {
                if (mesh.name.toLowerCase().includes('gem') || mesh.name.toLowerCase().includes('diamond')) {
                  mesh.material = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    transmission: 0.96,
                    opacity: 1.0,
                    transparent: true,
                    roughness: 0.02,
                    ior: 2.417, // Diamond IOR
                    dispersion: 0.058, // Abbe 58.6 fire
                    metalness: 0.0,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.02,
                    envMapIntensity: 2.2
                  });
                } else {
                  const metalColor =
                    activeMaterial === 'yellow' || activeMaterial === 'gold'
                      ? 0xf5c352
                      : activeMaterial === 'rose'
                      ? 0xebb19e
                      : activeMaterial === 'black'
                      ? 0x222225
                      : 0xf5f7fa;
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: metalColor,
                    metalness: activeMaterial === 'black' ? 0.85 : 0.98,
                    roughness: activeMaterial === 'black' ? 0.25 : 0.08,
                    envMapIntensity: 1.8
                  });
                }
              } else if (preset === 'eyewear') {
                const meshName = mesh.name.toLowerCase();
                const isLens = meshName.includes('_glass_') || meshName === 'glass' || (mesh.material as THREE.Material)?.name === 'Glass_2';
                const isMetal = meshName.includes('_metal_');
                const isRubber = meshName.includes('_rubber_');
                if (isLens) {
                  mesh.material = getEyewearLensMaterial(activeVariant);
                } else if (isMetal) {
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: 0x18181c,
                    metalness: 0.85,
                    roughness: 0.15
                  });
                } else if (isRubber) {
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: 0xd1d5db,
                    roughness: 0.6
                  });
                } else {
                  mesh.material = getEyewearFrameMaterial(activeMaterial);
                }
              } else if (preset === 'sportswear') {
                const texLoader = new THREE.TextureLoader();
                const fabricRoughness =
                  activeMaterial === 'smooth' ? 0.35 :
                  activeMaterial === 'knit' ? 0.8 :
                  activeMaterial === 'pique' ? 0.75 :
                  activeMaterial === 'jacquard' ? 0.5 : 0.65;
                const fabricMetalness = activeMaterial === 'smooth' ? 0.12 : activeMaterial === 'jacquard' ? 0.08 : 0.03;

                const jerseyMat = new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  roughness: fabricRoughness,
                  metalness: fabricMetalness,
                  side: THREE.DoubleSide
                });

                // Load procedural dynamic sportswear texture matching reference
                const svgStr = generateSportswearJerseySvg({
                  colorName: activeColor || 'purple',
                  pattern: activeVariant || 'sash',
                  number: activeNumber || '10',
                  fabric: activeMaterial || 'mesh'
                });
                const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);

                texLoader.load(dataUri, (tex) => {
                  tex.colorSpace = THREE.SRGBColorSpace;
                  jerseyMat.map = tex;
                  jerseyMat.needsUpdate = true;
                });

                // Load physical fabric normal map
                const normalMapPath =
                  activeMaterial === 'knit' || activeMaterial === 'jacquard'
                    ? '/textures/fabric_knit_normal.png'
                    : activeMaterial === 'smooth'
                    ? '/textures/fabric_smooth_normal.png'
                    : '/textures/fabric_mesh_normal.png';

                texLoader.load(normalMapPath, (norm) => {
                  norm.wrapS = THREE.RepeatWrapping;
                  norm.wrapT = THREE.RepeatWrapping;
                  norm.repeat.set(16, 16);
                  jerseyMat.normalMap = norm;
                  jerseyMat.normalScale = new THREE.Vector2(0.7, 0.7);
                  jerseyMat.needsUpdate = true;
                });

                if (Array.isArray(mesh.material)) {
                  const tagMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
                  const innerMat = new THREE.MeshStandardMaterial({ color: 0xf5f3f8, roughness: 0.7, side: THREE.DoubleSide });
                  mesh.material[0] = tagMat;
                  mesh.material[1] = tagMat;
                  mesh.material[2] = jerseyMat;
                  mesh.material[3] = innerMat;
                } else {
                  mesh.material = jerseyMat;
                }
              } else if (preset === 'mocap') {
                if (mesh.material) {
                  const setMatProps = (mat: THREE.Material) => {
                    mat.side = THREE.DoubleSide;
                    if ('roughness' in mat) {
                      (mat as THREE.MeshStandardMaterial).roughness = 0.55;
                    }
                    if ('metalness' in mat) {
                      (mat as THREE.MeshStandardMaterial).metalness = 0.05;
                    }
                  };
                  if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(setMatProps);
                  } else {
                    setMatProps(mesh.material);
                  }
                }
              }
            }
          });

          scene.add(model);
          setLoading(false);
        },
        undefined,
        (err) => {
          if (!isMounted) return;
          console.warn('[Hero3DCanvas] Model load error:', err);
          setLoadError('Interactive 3D Preview Active');
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }

    // 5. Render Loop
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      // Fold kinematics update if box preset
      if (preset === 'box' && boxPanelsRef.current.length === 4) {
        const foldAngle = (unfoldPercent / 100) * (Math.PI / 2);
        boxPanelsRef.current.forEach((panel) => {
          panel.rotation.x = -foldAngle;
        });
      }

      // Subtle idle breathing animation for mocap avatar if loaded
      if (preset === 'mocap' && modelRootRef.current) {
        const time = Date.now() * 0.0015;
        modelRootRef.current.position.y = -0.08 + Math.sin(time * 1.5) * 0.02;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('wheel', handleCanvasWheel);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl, preset]);

  // Update dynamic material colors and stone cut variants without reloading scene
  useEffect(() => {
    if (!modelRootRef.current) return;
    if (preset === 'jewelry') {
      const metalColor =
        activeMaterial === 'yellow' || activeMaterial === 'gold'
          ? 0xf5c352
          : activeMaterial === 'rose'
          ? 0xebb19e
          : activeMaterial === 'black'
          ? 0x222225
          : 0xf5f7fa;

      modelRootRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.name.toLowerCase().includes('gem') || mesh.name.toLowerCase().includes('diamond')) {
            if (activeVariant === 'round') {
              mesh.scale.set(1, 1, 1);
            } else if (activeVariant === 'princess') {
              mesh.scale.set(1.1, 0.92, 1.1);
            } else if (activeVariant === 'oval') {
              mesh.scale.set(1.22, 1, 0.88);
            } else if (activeVariant === 'pear') {
              mesh.scale.set(1.25, 0.96, 0.82);
            }
          } else {
            if ((mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.color.setHex(metalColor);
              mat.metalness = activeMaterial === 'black' ? 0.85 : 0.98;
              mat.roughness = activeMaterial === 'black' ? 0.25 : 0.08;
              mat.needsUpdate = true;
            }
          }
        }
      });
    } else if (preset === 'sportswear') {
      const texLoader = new THREE.TextureLoader();
      const normalMapPath =
        activeMaterial === 'knit' || activeMaterial === 'jacquard'
          ? '/textures/fabric_knit_normal.png'
          : activeMaterial === 'smooth'
          ? '/textures/fabric_smooth_normal.png'
          : '/textures/fabric_mesh_normal.png';
      const fabricRoughness =
        activeMaterial === 'smooth' ? 0.35 :
        activeMaterial === 'knit' ? 0.8 :
        activeMaterial === 'pique' ? 0.75 :
        activeMaterial === 'jacquard' ? 0.5 : 0.65;
      const fabricMetalness = activeMaterial === 'smooth' ? 0.12 : activeMaterial === 'jacquard' ? 0.08 : 0.03;

      const svgStr = generateSportswearJerseySvg({
        colorName: activeColor || 'purple',
        pattern: activeVariant || 'sash',
        number: activeNumber || '10',
        fabric: activeMaterial || 'mesh'
      });
      const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);

      if (modelRootRef.current) {
        modelRootRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const targetMat = Array.isArray(mesh.material)
              ? (mesh.material[2] as THREE.MeshStandardMaterial)
              : (mesh.material as THREE.MeshStandardMaterial);
            if (targetMat && targetMat.isMeshStandardMaterial) {
              targetMat.roughness = fabricRoughness;
              targetMat.metalness = fabricMetalness;
              texLoader.load(dataUri, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                targetMat.map = tex;
                targetMat.needsUpdate = true;
              });
              texLoader.load(normalMapPath, (norm) => {
                norm.wrapS = THREE.RepeatWrapping;
                norm.wrapT = THREE.RepeatWrapping;
                norm.repeat.set(16, 16);
                targetMat.normalMap = norm;
                targetMat.needsUpdate = true;
              });
            }
          }
        });
      }
    } else if (preset === 'eyewear') {
      if (modelRootRef.current) {
        modelRootRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const meshName = mesh.name.toLowerCase();
            const isLens = meshName.includes('_glass_') || meshName === 'glass' || (mesh.material as THREE.Material)?.name === 'Glass_2';
            const isMetal = meshName.includes('_metal_');
            const isRubber = meshName.includes('_rubber_');
            if (isLens) {
              mesh.material = getEyewearLensMaterial(activeVariant);
            } else if (isMetal) {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x18181c,
                metalness: 0.85,
                roughness: 0.15
              });
            } else if (isRubber) {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xd1d5db,
                roughness: 0.6
              });
            } else {
              mesh.material = getEyewearFrameMaterial(activeMaterial);
            }
          }
        });
      }
    }
  }, [activeMaterial, activeVariant, activeColor, activeNumber, preset]);

  // Pivot 3D model when activeVariant is an angle preset
  useEffect(() => {
    if (!modelRootRef.current || preset !== 'sportswear' || !activeVariant) return;
    const angleMap: Record<string, number> = {
      front: 0,
      back: Math.PI,
      left: Math.PI / 2,
      right: -Math.PI / 2
    };
    const targetAngle = angleMap[activeVariant];
    if (targetAngle !== undefined) {
      modelRootRef.current.rotation.y = targetAngle;
    }
  }, [activeVariant, preset]);

  return (
    <div
      ref={mountRef}
      className={`vs-hero-3d-stage ${className}`.trim()}
      data-testid="hero-3d-stage"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'grab'
        }}
      />

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--vs-glass-strong)',
            backdropFilter: 'blur(8px)',
            color: 'var(--vs-primary)',
            fontSize: '13px',
            fontWeight: 600,
            gap: '8px'
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid var(--vs-primary)',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span>Loading 3D Visual...</span>
        </div>
      )}

      {loadError && preset === 'jewelry' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <img
            src="/logos/jewel.png"
            alt="3D Diamond Ring Fallback"
            style={{
              maxWidth: '280px',
              maxHeight: '280px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 28px rgba(110, 44, 242, 0.25))'
            }}
          />
        </div>
      )}

      {loadError && preset === 'mocap' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <img
            src="/logos/facemocap.png"
            alt="Cartoon 3D Avatar Fallback"
            style={{
              maxWidth: '280px',
              maxHeight: '280px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 28px rgba(110, 44, 242, 0.35))'
            }}
          />
        </div>
      )}
    </div>
  );
};

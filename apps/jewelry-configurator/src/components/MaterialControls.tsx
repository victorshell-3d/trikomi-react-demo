import React, { useEffect, useState } from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import { useViewerStore, DiamondPlugin, GLTFPlugin, OrbitControlsPlugin } from '@trikomi/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const AVAILABLE_RINGS = [
  { name: 'Classic Solitaire', url: `${import.meta.env.BASE_URL}models/ring.glb`, thumb: `${import.meta.env.BASE_URL}thumbs/ring1.png` },
  { name: 'Halo Setting', url: `${import.meta.env.BASE_URL}models/ring2.glb`, thumb: `${import.meta.env.BASE_URL}thumbs/ring2.png` },

];

interface MaterialControlsProps {
  viewerRef: React.MutableRefObject<import('@trikomi/core').ThreeViewer | null>;
}

export const MaterialControls: React.FC<MaterialControlsProps> = observer(({ viewerRef }) => {
  const viewerStore = useViewerStore();
  const [materials, setMaterials] = useState<Array<{ id: string, name: string, color: string, mat: Record<string, unknown> | string | number | boolean, mesh: THREE.InstancedMesh | THREE.Mesh, isDiamond: boolean }>>([]);
  const [diamondThumbs, setDiamondThumbs] = useState<Record<string, string>>({});
  const [diamondGeometries, setDiamondGeometries] = useState<Record<string, THREE.BufferGeometry>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeShapes, setActiveShapes] = useState<Record<string, string>>({});
  const [zRotations, setZRotations] = useState<Record<string, number>>({});
  const [scales, setScales] = useState<Record<string, number>>({});
  const [yOffsets, setYOffsets] = useState<Record<string, number>>({});
  const [activeRingIndex, setActiveRingIndex] = useState(0);

  const handleRingChange = async (index: number) => {
    if (viewerStore.isModelLoading || index === activeRingIndex) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const plugin = viewer.getPlugin(GLTFPlugin);
    if (!plugin) return;

    setActiveRingIndex(index);
    viewerStore.setIsModelLoading(true);

    try {
      const modelGroup = viewer.scene.getObjectByName('ModelGroup') as THREE.Group;
      if (modelGroup) {
        // Remove existing children
        while (modelGroup.children.length > 0) {
          const child = modelGroup.children[0];
          modelGroup.remove(child);
        }

        // Reset selections
        setExpandedId(null);
        setActiveShapes({});
        setZRotations({});
        setScales({});
        setYOffsets({});

        const ring = AVAILABLE_RINGS[index];
        const newModel = await plugin.loadModel(ring.url, `jewelry_model_${index}`);
        viewer.getPlugin(OrbitControlsPlugin)?.resetView();
        if (newModel) {
          modelGroup.add(newModel);
          viewerStore.setActiveModelName(`jewelry_model_${index}`);
        }
      }
    } catch (e) {
      console.error('Error switching rings:', e);
    } finally {
      viewerStore.setIsModelLoading(false);
    }
  };

  // Fetch thumbnails
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}json/diamond_map.json`)
      .then(res => res.json())
      .then(data => setDiamondThumbs(data))
      .catch(err => console.error("Failed to load diamond map", err));
  }, []);

  // Load diamond geometries in background
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/gltf/`);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(`${import.meta.env.BASE_URL}models/diamonds.glb`, (gltf) => {
      const geos: Record<string, THREE.BufferGeometry> = {};
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          geos[mesh.name] = mesh.geometry;
        }
      });
      setDiamondGeometries(geos);
      dracoLoader.dispose();
    }, undefined, (err) => {
      console.error("Failed to load diamond geometries", err);
    });
  }, []);

  // Re-scan for materials whenever the active model changes or finishes loading
  useEffect(() => {
    if (viewerStore.isModelLoading) return;

    const viewer = viewerRef.current;
    if (!viewer) return;

    const timeoutId = setTimeout(() => {
      const modelGroup = viewer.scene.getObjectByName('ModelGroup');
      if (!modelGroup) return;

      const uniqueMats = new Map<string, { id: string, name: string, color: string, mat: THREE.Material | import('three/webgpu').NodeMaterial, mesh: THREE.Object3D, isDiamond: boolean }>();

      modelGroup.traverse((child: THREE.Object3D) => {
        if (child.isMesh || child.isInstancedMesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];

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

          mats.forEach((mat) => {
            if (!mat) return;
            let displayName = child.name;
            if (child.parent && child.parent.name && child.parent.name !== 'Scene' && child.parent.name !== 'ModelGroup') {
              displayName = child.parent.name;
            }
            if (!displayName) displayName = mat.name || 'Unnamed Material';

            const hash = mat.uuid;
            if (!uniqueMats.has(hash)) {
              let hexColor = '#ffffff';
              let isDiamond = false;

              if (mat.color && mat.color.value && mat.color.value.isColor) {
                hexColor = '#' + mat.color.value.getHexString();
                isDiamond = true;
              } else if (mat.color && mat.color.isColor) {
                hexColor = '#' + mat.color.getHexString();
                if (mat.name && mat.name.toLowerCase().includes('diamond')) isDiamond = true;
              }

              uniqueMats.set(hash, {
                id: hash,
                name: displayName,
                color: hexColor,
                mat: mat,
                mesh: child,
                isDiamond
              });
            }
          });
        }
      });

      setMaterials(Array.from(uniqueMats.values()));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [viewerStore.activeModelName, viewerStore.isModelLoading]);

  const handleColorChange = (index: number, newColorStr: string) => {
    const newMats = [...materials];
    newMats[index].color = newColorStr;
    setMaterials(newMats);

    const mat = newMats[index].mat;
    if (mat) {
      if (mat.color && mat.color.value && mat.color.value.isColor) {
        mat.color.value.set(newColorStr);
      } else if (mat.color && mat.color.isColor) {
        mat.color.set(newColorStr);
      }
      mat.needsUpdate = true;
    }
  };

  const applyGeometryTransform = async (matId: string, mesh: THREE.Mesh, shapeName: string | undefined, rotationZ: number, scaleOffset: number, yOffset: number, isFinal: boolean) => {
    let cloned: THREE.BufferGeometry;

    if (shapeName && diamondGeometries[shapeName]) {
      const baseGeom = diamondGeometries[shapeName];
      cloned = baseGeom.clone();

      cloned.rotateY(rotationZ * (Math.PI / 180));

      // Fix scale: Scale the new geometry to match the size of the original mesh.
      if (mesh.userData.originalSize) {
        cloned.computeBoundingBox();
        const currentSize = new THREE.Vector3();
        if (cloned.boundingBox) {
          cloned.boundingBox.getSize(currentSize);
          const targetSize = mesh.userData.originalSize;

          const targetFootprint = Math.max(targetSize.x, targetSize.z);
          const currentFootprint = Math.max(currentSize.x, currentSize.z);

          if (currentFootprint > 0) {
            const scale = (targetFootprint / currentFootprint) * (scaleOffset / 100);
            cloned.scale(scale, scale, scale);
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

    if (yOffset !== 0) {
      cloned.translate(0, yOffset / 100, 0);
    }

    const viewer = viewerRef.current;
    if (viewer) {
      if (isFinal) {
        const diamondPlugin = viewer.getPlugin(DiamondPlugin);
        if (diamondPlugin && diamondPlugin.updateDiamondGeometry) {
          await diamondPlugin.updateDiamondGeometry(mesh, cloned);
        } else {
          mesh.geometry = cloned;
        }
      } else {
        mesh.geometry = cloned;
      }
    }
  };

  const handleShapeChange = (matId: string, mesh: THREE.Mesh, shapeName: string) => {
    setActiveShapes(prev => ({ ...prev, [matId]: shapeName }));
    const currentRot = zRotations[matId] || 0;
    const currentScale = scales[matId] !== undefined ? scales[matId] : 100;
    const currentY = yOffsets[matId] || 0;
    applyGeometryTransform(matId, mesh, shapeName, currentRot, currentScale, currentY, true);
  };

  const handleRotationChange = (matId: string, mesh: THREE.Mesh, rotation: number, isFinal: boolean) => {
    setZRotations(prev => ({ ...prev, [matId]: rotation }));
    const currentShape = activeShapes[matId];
    const currentScale = scales[matId] !== undefined ? scales[matId] : 100;
    const currentY = yOffsets[matId] || 0;
    applyGeometryTransform(matId, mesh, currentShape, rotation, currentScale, currentY, isFinal);
  };

  const handleScaleChange = (matId: string, mesh: THREE.Mesh, scale: number, isFinal: boolean) => {
    setScales(prev => ({ ...prev, [matId]: scale }));
    const currentShape = activeShapes[matId];
    const currentRot = zRotations[matId] || 0;
    const currentY = yOffsets[matId] || 0;
    applyGeometryTransform(matId, mesh, currentShape, currentRot, scale, currentY, isFinal);
  };

  const handleYOffsetChange = (matId: string, mesh: THREE.Mesh, offset: number, isFinal: boolean) => {
    setYOffsets(prev => ({ ...prev, [matId]: offset }));
    const currentShape = activeShapes[matId];
    const currentRot = zRotations[matId] || 0;
    const currentScale = scales[matId] !== undefined ? scales[matId] : 100;
    applyGeometryTransform(matId, mesh, currentShape, currentRot, currentScale, offset, isFinal);
  };

  // Auto-select first material if none expanded
  useEffect(() => {
    if (!expandedId && materials.length > 0) {
      setExpandedId(materials[0].id);
    }
  }, [materials, expandedId]);

  if (materials.length === 0) return null;

  const activeMat = materials.find(m => m.id === expandedId) || materials[0];

  return (
    <>
      <style>{`
        .mc-scroll::-webkit-scrollbar { height: 4px; width: 4px; }
        .mc-scroll::-webkit-scrollbar-track { background: transparent; }
        .mc-scroll::-webkit-scrollbar-thumb { background: rgba(0, 242, 254, 0.3); border-radius: 10px; }
        .mc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 242, 254, 0.6); }
        .mc-range {
          -webkit-appearance: none;
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          outline: none;
        }
        .mc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00f2fe;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 242, 254, 0.5);
        }
      `}</style>

      {/* Left Panel: Materials & Colors */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: 'calc(100% - 40px)',
        maxWidth: '220px',
        maxHeight: 'calc(100dvh - 40px)',
        overflowY: 'auto',
        background: 'rgba(10, 12, 28, 0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 10,
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 242, 254, 0.05)',
        color: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <img src={`${import.meta.env.BASE_URL}logos/jewel.png`} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 40%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Trikomi Jewelry
            </h2>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              Configurator
            </span>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        <div className="mc-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '4px' }}>
          {materials.map((m, i) => {
            const isActive = expandedId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setExpandedId(m.id)}
                style={{

                  background: isActive ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span style={{ fontSize: '0.85rem', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600, color: isActive ? '#fff' : '#cbd5e1', textTransform: 'capitalize' }}>
                  {m.name.replace(/_/g, ' ')}
                </span>

                {/* Embedded Color Picker */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '24px', height: '24px',
                    flexShrink: 0,
                    borderRadius: '50%',

                    background: m.color,
                    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <input
                    type="color"
                    value={m.color}
                    onChange={(e) => handleColorChange(i, e.target.value)}
                    style={{
                      position: 'absolute', top: -5, left: -5, width: '34px', height: '34px',
                      opacity: 0, cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Relocated Scale and Rotation Sliders */}
          {activeMat && activeMat.isDiamond && (
            <>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '8px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 4px' }}>
                {/* Z Rotation Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Angle Offset</span>
                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                      {zRotations[activeMat.id] || 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    className="mc-range"
                    min="0" max="360" step="1"
                    value={zRotations[activeMat.id] || 0}
                    onChange={(e) => handleRotationChange(activeMat.id, activeMat.mesh, parseInt(e.target.value), false)}
                    onMouseUp={(e) => handleRotationChange(activeMat.id, activeMat.mesh, parseInt((e.target as HTMLInputElement).value), true)}
                    onTouchEnd={(e) => handleRotationChange(activeMat.id, activeMat.mesh, parseInt((e.target as HTMLInputElement).value), true)}
                  />
                </div>

                {/* Scale Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Scale Offset</span>
                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                      {scales[activeMat.id] !== undefined ? scales[activeMat.id] : 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    className="mc-range"
                    min="50" max="200" step="1"
                    value={scales[activeMat.id] !== undefined ? scales[activeMat.id] : 100}
                    onChange={(e) => handleScaleChange(activeMat.id, activeMat.mesh, parseInt(e.target.value), false)}
                    onMouseUp={(e) => handleScaleChange(activeMat.id, activeMat.mesh, parseInt((e.target as HTMLInputElement).value), true)}
                    onTouchEnd={(e) => handleScaleChange(activeMat.id, activeMat.mesh, parseInt((e.target as HTMLInputElement).value), true)}
                  />
                </div>

                {/* Y Offset Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Height Offset</span>
                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                      {yOffsets[activeMat.id] || 0}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="mc-range"
                    min="-50" max="50" step="1"
                    value={yOffsets[activeMat.id] || 0}
                    onChange={(e) => handleYOffsetChange(activeMat.id, activeMat.mesh, parseInt(e.target.value), false)}
                    onMouseUp={(e) => handleYOffsetChange(activeMat.id, activeMat.mesh, parseInt((e.target as HTMLInputElement).value), true)}
                    onTouchEnd={(e) => handleYOffsetChange(activeMat.id, activeMat.mesh, parseInt((e.target as HTMLInputElement).value), true)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Panel: Diamond Shapes */}
      {activeMat && activeMat.isDiamond && Object.keys(diamondThumbs).length > 0 && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          width: '80px',
          maxHeight: 'calc(100dvh - 120px)',
          background: 'rgba(10, 12, 28, 0.70)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.4)'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}>
            Shapes
          </span>
          <div className="mc-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', width: '100%', alignItems: 'center', paddingRight: '2px' }}>
            {Object.entries(diamondThumbs).map(([shapeName, path]) => {
              const isActive = activeShapes[activeMat.id] === shapeName;
              return (
                <div
                  key={shapeName}
                  onClick={() => handleShapeChange(activeMat.id, activeMat.mesh, shapeName)}
                  title={shapeName}
                  style={{
                    flex: '0 0 auto',
                    width: '48px', height: '48px',
                    background: isActive ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    padding: '6px',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 0 10px rgba(0, 242, 254, 0.2)' : 'none'
                  }}
                >
                  <img src={`${import.meta.env.BASE_URL}${(path as string).startsWith('/') ? (path as string).slice(1) : path}`} alt={shapeName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Center Panel: Ring Carousel */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        maxWidth: '90vw',
        background: 'rgba(10, 12, 28, 0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10,
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 242, 254, 0.05)',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }} className="mc-scroll">

        <button
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          onClick={() => {
            const len = AVAILABLE_RINGS.length;
            handleRingChange((activeRingIndex - 1 + len) % len);
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div style={{ display: 'flex', gap: '16px', overflow: 'hidden', padding: '4px 0' }}>
          {AVAILABLE_RINGS.map((ring, idx) => (
            <div
              key={ring.name + idx}
              onClick={() => handleRingChange(idx)}
              style={{
                width: '64px', height: '64px',
                borderRadius: '12px',
                background: activeRingIndex === idx ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: activeRingIndex === idx ? '2px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: activeRingIndex === idx ? '0 0 12px rgba(0, 242, 254, 0.3)' : 'none',
                opacity: viewerStore.isModelLoading && activeRingIndex !== idx ? 0.5 : 1
              }}
              title={ring.name}
            >
              <img src={ring.thumb} alt={ring.name} style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.8 }} />
              <span style={{ fontSize: '0.5rem', color: '#e2e8f0', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center', padding: '0 4px' }}>
                {ring.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        <button
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          onClick={() => {
            const len = AVAILABLE_RINGS.length;
            handleRingChange((activeRingIndex + 1) % len);
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

      </div>
    </>
  );
});

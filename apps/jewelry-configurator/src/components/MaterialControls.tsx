import React, { useEffect, useState } from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import { useViewerStore, DiamondPlugin, GLTFPlugin, OrbitControlsPlugin } from '@trikomi/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MobilePanelControls, ResponsivePanel, PanelHeading, ScrollList, SelectableColorRow, AdjustmentGroup, ValueRange, ThumbnailGrid, EmptyPanel, ModelPicker } from '../../../ui-kit/src/index';

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
    setExpandedId(null);
    setActiveShapes({});
    setZRotations({});
    setScales({});
    setYOffsets({});

    try {
      const ring = AVAILABLE_RINGS[index];
      await plugin.loadModel(ring.url, `jewelry_model_${index}`);
      viewer.getPlugin(OrbitControlsPlugin)?.resetView();
      const diamondPlugin = viewer.getPlugin(DiamondPlugin) as any;
      if (diamondPlugin && typeof diamondPlugin.applyDiamondMaterial === 'function') {
        diamondPlugin.applyDiamondMaterial();
      }
    } catch (e) {
      console.error('Error switching rings:', e);
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
      const targetModel = viewerStore.currentModel || viewer.runtimeRoot.children[0]?.nativeObject || viewer.scene;
      if (!targetModel) return;

      const uniqueMats = new Map<string, { id: string, name: string, color: string, mat: THREE.Material | import('three/webgpu').NodeMaterial, mesh: THREE.Object3D, isDiamond: boolean }>();

      targetModel.traverse((child: THREE.Object3D) => {
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
            if (child.parent && child.parent.name && child.parent.name !== 'Scene') {
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

  const [mobilePanel, setMobilePanel] = useState("Materials");
  const [panelOpen, setPanelOpen] = useState(false);

  if (materials.length === 0) return null;

  const activeMat = materials.find(m => m.id === expandedId) || materials[0];

  return (
    <>
      <MobilePanelControls label="Jewelry control panel" options={["Materials", "Diamonds"]} value={mobilePanel} open={panelOpen} onSelect={value => { setMobilePanel(value); setPanelOpen(true); }} onToggle={() => setPanelOpen(!panelOpen)} />
      <ResponsivePanel side="left" open={panelOpen && mobilePanel === "Materials"} label="Materials and colors">
        <PanelHeading eyebrow="CUSTOMIZE" title="Materials & colors" count={materials.length}/>
        <ScrollList>
          {materials.map((m, index) => <SelectableColorRow key={m.id} selected={expandedId === m.id} label={`Select material ${index + 1}: ${m.name.replace(/_/g, ' ')}`} title={m.name.replace(/_/g, ' ')} detail={`${m.isDiamond ? "Diamond" : "Material"} ${index + 1}`} icon={m.isDiamond ? "gem" : "layers"} color={m.color} colorLabel={`Color for material ${index + 1}: ${m.name.replace(/_/g, ' ')}`} onSelect={() => setExpandedId(m.id)} onColor={value => handleColorChange(index, value)} />)}
        </ScrollList>
        {activeMat?.isDiamond && <AdjustmentGroup title="Diamond adjustments">
          <ValueRange label="Angle offset" value={zRotations[activeMat.id] || 0} unit="°" min={0} max={360} step={1} onChange={value => handleRotationChange(activeMat.id, activeMat.mesh, value, false)} onCommit={value => handleRotationChange(activeMat.id, activeMat.mesh, value, true)} />
          <ValueRange label="Scale offset" value={scales[activeMat.id] !== undefined ? scales[activeMat.id] : 100} unit="%" min={50} max={200} step={1} onChange={value => handleScaleChange(activeMat.id, activeMat.mesh, value, false)} onCommit={value => handleScaleChange(activeMat.id, activeMat.mesh, value, true)} />
          <ValueRange label="Height offset" value={yOffsets[activeMat.id] || 0} min={-50} max={50} step={1} onChange={value => handleYOffsetChange(activeMat.id, activeMat.mesh, value, false)} onCommit={value => handleYOffsetChange(activeMat.id, activeMat.mesh, value, true)} />
        </AdjustmentGroup>}
      </ResponsivePanel>
      {activeMat?.isDiamond && Object.keys(diamondThumbs).length > 0 ? <ResponsivePanel side="right" open={panelOpen && mobilePanel === "Diamonds"} label="Diamond shapes">
        <PanelHeading eyebrow="DIAMOND" title="Shapes" count={Object.keys(diamondThumbs).length}/>
        <ThumbnailGrid items={Object.entries(diamondThumbs).map(([shapeName, path]) => ({ id: shapeName, label: shapeName.replace("shape", "Cut ") || "Original", accessibleLabel: `Diamond ${shapeName}`, image: `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}` }))} value={activeShapes[activeMat.id]} onChange={shapeName => handleShapeChange(activeMat.id, activeMat.mesh, shapeName)}/>
      </ResponsivePanel> : <ResponsivePanel side="right" empty open={panelOpen && mobilePanel === "Diamonds"} label="Diamond shapes"><EmptyPanel title="Diamond shapes" description="Select a diamond material in Materials to see its shapes and adjustments." action="Materials" onAction={() => setMobilePanel("Materials")}/></ResponsivePanel>}
      <ModelPicker label="Ring models" previousLabel="Previous ring" nextLabel="Next ring" items={AVAILABLE_RINGS.map((ring,index) => ({ id: String(index), label: ring.name, image: ring.thumb }))} value={String(activeRingIndex)} loading={viewerStore.isModelLoading} onChange={id => handleRingChange(Number(id))} onPrevious={() => handleRingChange((activeRingIndex - 1 + AVAILABLE_RINGS.length) % AVAILABLE_RINGS.length)} onNext={() => handleRingChange((activeRingIndex + 1) % AVAILABLE_RINGS.length)}/>
    </>
  );
});

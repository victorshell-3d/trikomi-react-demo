import React, { useState } from 'react';
import * as THREE from 'three/webgpu';
import { useViewerStore, GLTFPlugin, OrbitControlsPlugin, ThreeViewer } from '@trikomi/core';

interface DiamondData {
  id: string;
  name: string;
  thumbnail: string;
}

export const DiamondExtractor: React.FC = () => {
  const viewerStore = useViewerStore();
  const [loading, setLoading] = useState(false);
  const [diamonds, setDiamonds] = useState<DiamondData[]>([]);
  const [selectedFile, setSelectedFile] = useState('/models/diamonds.glb');

  const [loadingModel, setLoadingModel] = useState(false);

  const loadViewerModel = async () => {
    setLoadingModel(true);
    const viewer = viewerStore.viewer as ThreeViewer;
    if (!viewer) {
      alert("Viewer instance not found! Make sure ThreeCanvas is mounted.");
      setLoadingModel(false);
      return;
    }
    try {
      const gltfPlugin = viewer.getPlugin(GLTFPlugin);
      if (gltfPlugin) {
        await gltfPlugin.loadModel(selectedFile, selectedFile);
      } else {
        viewer.loadModelFromUrl(selectedFile);
      }
      // Wait for plugins and TSL shaders to compile and apply
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(e);
      alert('Error loading GLB through Viewer SDK');
    }
    setLoadingModel(false);
  };

  const extractDiamonds = async () => {
    setLoading(true);
    setDiamonds([]);

    const viewer = viewerStore.viewer as ThreeViewer;
    if (!viewer) {
      alert("Viewer instance not found! Make sure ThreeCanvas is mounted.");
      setLoading(false);
      return;
    }

    try {
      // If we need to load, do it
      if (viewerStore.activeModelName !== selectedFile) {
        await loadViewerModel();
      }
      
      // Wait for any plugins (like DiamondPlugin) to finish their async work
      while (viewerStore.isModelLoading) {
        await new Promise(r => setTimeout(r, 100));
      }
      
      const newDiamonds: DiamondData[] = [];
      const meshes: THREE.Mesh[] = [];

      viewerStore.currentModel?.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          meshes.push(child as import('three').Mesh);
        }
      });

      // Hide all meshes initially and disable shadows
      meshes.forEach(m => {
        m.visible = false;
        m.castShadow = false;
        m.receiveShadow = false;
      });

      // Save original camera state
      const origPos = viewer.camera.position.clone();
      const origRot = viewer.camera.rotation.clone();
      
      // Save original renderer and background state
      const origSize = new THREE.Vector2();
      viewer.renderer.getSize(origSize);
      const origBgColor = viewerStore.backgroundColor;
      const origUseEnvBg = viewerStore.useEnvAsBackground;
      const origSceneBg = viewer.scene.background;
      const origFloorTransparent = viewerStore.floorTransparent;

      // Prepare 200x200 transparent extraction
      viewer.renderer.setSize(200, 200, false);
      const origAspect = viewer.camera.aspect;
      viewer.camera.aspect = 1;
      viewer.camera.updateProjectionMatrix();
      
      viewerStore.setUseEnvAsBackground(false);
      viewerStore.setBackgroundColor('transparent');
      viewerStore.setFloorTransparent(true);
      viewer.scene.background = null;

      const orbitControlsPlugin = viewer.getPlugin(OrbitControlsPlugin);
      
      for (let i = 0; i < meshes.length; i++) {
        const mesh = meshes[i];
        mesh.visible = true;

        // Auto-fit camera to this specific diamond
        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = viewer.camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        // TOP ANGLE: View from straight above (Y axis) instead of front (Z axis)
        viewer.camera.position.set(center.x, center.y + cameraDistance * 1.5, center.z);
        
        if (orbitControlsPlugin && orbitControlsPlugin.controls) {
          orbitControlsPlugin.controls.target.copy(center);
          orbitControlsPlugin.controls.update();
        } else {
          viewer.camera.lookAt(center);
        }

        // Wait 300ms for camera to settle and WebGPU to flush
        await new Promise(r => setTimeout(r, 300));

        // Explicitly render a frame RIGHT BEFORE toDataURL to avoid blank buffer
        if (typeof (viewer.renderer as THREE.WebGPURenderer).renderAsync === 'function') {
          await (viewer.renderer as THREE.WebGPURenderer).renderAsync(viewer.scene, viewer.camera);
        } else {
          viewer.renderer.render(viewer.scene, viewer.camera);
        }

        const thumbnail = viewer.renderer.domElement.toDataURL('image/png');

        newDiamonds.push({
          id: `diamond_${i}`,
          name: mesh.name || `Diamond ${i+1}`,
          thumbnail
        });

        mesh.visible = false;
      }

      // Restore
      meshes.forEach(m => m.visible = true);
      
      // Restore renderer and background state
      viewer.renderer.setSize(origSize.x, origSize.y);
      viewer.camera.aspect = origAspect;
      viewer.camera.updateProjectionMatrix();
      
      viewerStore.setUseEnvAsBackground(origUseEnvBg);
      viewerStore.setBackgroundColor(origBgColor);
      viewerStore.setFloorTransparent(origFloorTransparent);
      viewer.scene.background = origSceneBg;

      if (orbitControlsPlugin && typeof orbitControlsPlugin.resetView === 'function') {
        orbitControlsPlugin.resetView();
      } else {
        viewer.camera.position.copy(origPos);
        viewer.camera.rotation.copy(origRot);
      }

      setDiamonds(newDiamonds);
    } catch (e) {
      console.error(e);
      alert('Error loading GLB through Viewer SDK');
    }
    
    setLoading(false);
  };

  const downloadPNG = (diamond: DiamondData) => {
    const a = document.createElement('a');
    a.href = diamond.thumbnail;
    a.download = `${diamond.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    a.click();
  };

  const [isExporting, setIsExporting] = useState(false);

  const exportJsonMap = async () => {
    setIsExporting(true);
    
    try {
      type FSAWindow = Window & { showDirectoryPicker?: (opts?: { mode: string }) => Promise<FileSystemDirectoryHandle> };
      const fsa = window as FSAWindow;
      if (!fsa.showDirectoryPicker) {
        alert("Your browser doesn't support the File System Access API. Please use Chrome or Edge.");
        setIsExporting(false);
        return;
      }
      const dirHandle = await fsa.showDirectoryPicker({ mode: 'readwrite' });

      
      const map: Record<string, string> = {};
      
      // Save images
      for (let i = 0; i < diamonds.length; i++) {
        const d = diamonds[i];
        const safeName = d.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        
        // Convert base64 to Blob
        const res = await fetch(d.thumbnail);
        const blob = await res.blob();
        
        // Write file
        const fileHandle = await dirHandle.getFileHandle(`${safeName}.png`, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        map[d.name] = `/thumbs/${safeName}.png`;
      }

      // Save JSON map
      const jsonFileHandle = await dirHandle.getFileHandle('diamond_map.json', { create: true });
      const jsonWritable = await jsonFileHandle.createWritable();
      await jsonWritable.write(JSON.stringify(map, null, 2));
      await jsonWritable.close();

      alert('Successfully saved all thumbnails and diamond_map.json to the selected folder!');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
        alert('Error saving files: ' + err.message);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '40px', background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)', color: 'white', fontFamily: 'sans-serif', zIndex: 10, position: 'relative', borderRadius: '12px', pointerEvents: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>Diamond Library Extractor</h1>
      <p style={{ marginBottom: '20px', color: '#9ca3af', fontSize: '14px' }}>
        First, load the model to preview it in the Trikomi engine. Then extract the diamonds to generate the thumbnail library.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <select 
          value={selectedFile} 
          onChange={e => setSelectedFile(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }}
        >
          <option value="/models/diamonds.glb">diamonds.glb</option>
          <option value="/models/diamonds2.glb">diamonds2.glb</option>
        </select>
        
        <button 
          onClick={loadViewerModel} 
          disabled={loadingModel || loading}
          style={{ padding: '8px 16px', background: (loadingModel || loading) ? '#374151' : '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: (loadingModel || loading) ? 'not-allowed' : 'pointer' }}
        >
          {loadingModel ? 'Loading...' : 'Load Model'}
        </button>

        <button 
          onClick={extractDiamonds} 
          disabled={loading || loadingModel}
          style={{ padding: '8px 16px', background: (loading || loadingModel) ? '#6B7280' : '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: (loading || loadingModel) ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Extracting...' : 'Extract Thumbnails'}
        </button>

        {diamonds.length > 0 && (
          <button 
            onClick={exportJsonMap}
            disabled={isExporting}
            style={{ 
              padding: '8px 16px', 
              background: isExporting ? '#6b7280' : '#10B981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.7 : 1
            }}
          >
            {isExporting ? 'Saving to disk...' : 'Export JSON'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
        {diamonds.map(d => (
          <div key={d.id} style={{ background: '#1F2937', borderRadius: '8px', overflow: 'hidden', border: '1px solid #374151' }}>
            <img src={d.thumbnail} alt={d.name} style={{ width: '100%', height: '250px', objectFit: 'contain', background: '#111827' }} />
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{d.name}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => downloadPNG(d)} style={{ flex: 1, padding: '6px', background: '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  DL .PNG
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

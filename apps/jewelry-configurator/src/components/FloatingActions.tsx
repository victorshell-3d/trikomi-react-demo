import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { ExportPlugin, GLTFPlugin, ThreeViewer } from '@trikomi/core';
import { Button, Icon, BrandHeader, FileInput } from '../../../ui-kit/src/index';

interface FloatingActionsProps {
  viewerRef: React.MutableRefObject<ThreeViewer | null>;
}

export const FloatingActions: React.FC<FloatingActionsProps> = observer(({ viewerRef }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);




  const handleExport = () => {
    const viewer = viewerRef.current as ThreeViewer;
    if (viewer) {
      const exportPlugin = viewer.getPlugin(ExportPlugin);
      if (exportPlugin) {
        exportPlugin.exportGLTF();
      } else {
        alert("Export plugin not found.");
      }
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const viewer = viewerRef.current;
    if (viewer) {
      const gltfPlugin = viewer.getPlugin(GLTFPlugin);
      if (gltfPlugin) {
        gltfPlugin.loadModel(url, file.name);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <BrandHeader product="Jewelry Configurator" actions={<>
      <FileInput accept=".glb,.gltf" inputRef={fileInputRef} aria-label="Import jewelry model" onChange={handleImport} />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}><Icon name="upload"/><span>Import GLB</span></Button>
      <Button variant="primary" onClick={handleExport}><Icon name="download"/><span>Export</span></Button>
    </>} />
  );
});

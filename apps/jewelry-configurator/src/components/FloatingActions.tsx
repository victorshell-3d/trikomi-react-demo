import { StudioHeader } from "../../../ui-kit/jewelry/StudioChrome";
import { Button } from "../../../ui-kit/controls";
import React, { useRef } from "react";
import { observer } from "mobx-react-lite";
import { ExportPlugin, GLTFPlugin, ThreeViewer } from "@trikomi/core";

interface FloatingActionsProps {
  onModelImported?: (name: string) => void;
  viewerRef: React.MutableRefObject<ThreeViewer | null>;
}

export const FloatingActions: React.FC<FloatingActionsProps> = observer(
  ({ viewerRef, onModelImported }) => {
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
          gltfPlugin
            .loadModel(url, file.name)
            .then(() => onModelImported?.(file.name))
            .catch(() =>
              alert(
                "This model could not be imported. Check that the file is a supported GLB or glTF.",
              ),
            )
            .finally(() => URL.revokeObjectURL(url));
        }
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <StudioHeader className="topbar local-guided-header" brand="VictorShell" subtitle="Jewelry Configurator" mark="V" showNote={false}>
        <div id="jewelry-cart-target" />
        <div className="original-actions" hidden>
          <input
            aria-label="Import jewelry model"
            type="file"
            accept=".glb,.gltf"
            ref={fileInputRef}
            hidden
            onChange={handleImport}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            Import GLB
          </Button>
          <Button variant="primary" onClick={handleExport}>
            Export
          </Button>
        </div>
      </StudioHeader>
    );
  },
);

import { useStudioMotion } from "./useStudioMotion";
import { StudioToolbar, StudioBackdrop } from "../../../ui-kit/jewelry/StudioSurfaces";
import { Button } from "../../../ui-kit/controls";
import { IconSymbols } from "../../../ui-kit/IconSymbols";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { observer } from "mobx-react-lite";
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
} from "@trikomi/core";
import { MaterialControls } from "./MaterialControls";
import { FloatingActions } from "./FloatingActions";

export const Playground = observer(() => {
  const viewerStore = useViewerStore();
  const [piece, setPiece] = useState({
    name: "Classic Solitaire",
    description: "Diamond-set band",
  });
  const [importRevision, setImportRevision] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [initialError, setInitialError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ThreeViewer | null>(null);

  const motion = useStudioMotion(viewerRef);
  const [activeView, setActiveView] = useState("Studio");

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Configure default rendering flags on the shared global store
    // Background color is handled dynamically below
    viewerStore.floorTransparent = false;
    viewerStore.setSsgiEnabled(false);
    viewerStore.setSSREnabled(false);
    viewerStore.setProgressiveShadowEnabled(false);
    viewerStore.setBloomEnabled(true);

    // 2. Initialize ThreeViewer with plugins
    const viewer = new ThreeViewer(containerRef.current, viewerStore, {
      onAuthorized: () => {
        viewer.addPlugin(new SSGIPlugin());
        viewer.addPlugin(new SSRPlugin());
        viewer.addPlugin(new ProgressiveShadowPlugin());
        viewer.addPlugin(new FloorPlugin());
        viewer.addPlugin(new ExportPlugin());
        viewer.addPlugin(new CinematicPlugin());
      },
    });
    viewerStore.viewer = viewer;

    // Attach core rendering plugins directly
    viewer.addPlugin(new EnvironmentPlugin());
    viewer.addPlugin(new BloomPlugin());
    viewer.addPlugin(new DiamondPlugin());
    viewer.addPlugin(new OrbitControlsPlugin());
    viewer.addPlugin(new GLTFPlugin());
    viewer.addPlugin(new CenterModelPlugin());

    viewerStore.showStats = false;

    // Setup initial camera
    viewer.camera.position.set(0, 2.5, 4.5);
    viewer.camera.lookAt(0, 0, 0);

    viewerRef.current = viewer;

    // Load initial ring.glb or custom model from widget options
    const modelToLoad =
      viewerStore.options.model || `${import.meta.env.BASE_URL}models/ring.glb`;
    const gltfPlugin = viewer.getPlugin(GLTFPlugin);
    if (gltfPlugin) {
      gltfPlugin
        .loadModel(modelToLoad, "jewelry_model")
        .then(() => {
          viewer.getPlugin(OrbitControlsPlugin)?.resetView();
          motion.introduce();
          const diamondPlugin = viewer.getPlugin(DiamondPlugin) as any;
          if (
            diamondPlugin &&
            typeof diamondPlugin.applyDiamondMaterial === "function"
          ) {
            diamondPlugin.applyDiamondMaterial();
          }
        })
        .catch((err) => {
          setInitialError(true);
          console.error(`Failed to load ${modelToLoad}`, err);
        });
    }

    return () => {
      viewerStore.viewer = null;
      viewer.dispose();
    };
  }, []);

  useEffect(() => {
    viewerStore.backgroundColor = "#08090c";
  }, []);


  return (
    <div className="js-app kit-atelier" onPointerDownCapture={(event) => {
      if (event.target instanceof Element && !event.target.closest("header, dialog")) event.currentTarget.dataset.interacting = "true";
    }} onPointerUpCapture={(event) => { event.currentTarget.dataset.interacting = "false"; }} onPointerCancelCapture={(event) => { event.currentTarget.dataset.interacting = "false"; }} onFocusCapture={(event) => { event.currentTarget.dataset.focused = String(event.target instanceof Element && event.target.matches(":focus-visible")); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.dataset.focused = "false"; }}>
      <IconSymbols />
      
      <StudioBackdrop />
      <FloatingActions
        viewerRef={viewerRef}
        onModelImported={(name) => {
          setPiece({ name, description: "Imported model" });
          setImportRevision((n) => n + 1);
        }}
      />
      <main className="js-workspace">
        <section className="js-stage" aria-busy={viewerStore.isModelLoading} aria-label="Original jewelry 3D preview">
          <div className="canvas-container" ref={containerRef} onPointerDown={motion.stopCamera} />
          <div id="studio-selection-target" />
          <StudioToolbar className="atelier-view-tools" aria-label="Preview controls">
            {["Studio", "Front", "Profile", "Top"].map((name) => <Button key={name} aria-pressed={activeView === name} onClick={() => { setActiveView(name); setRotating(false); motion.view(name); }}>{name}</Button>)}
            <Button
              aria-label="Rotate preview"
              aria-pressed={rotating}
              onClick={() => {
                const controls =
                  viewerRef.current?.getPlugin(OrbitControlsPlugin)?.controls;
                if (controls) {
                  viewerStore.autoRotate = !rotating;
                  setRotating(!rotating);
                }
              }}
            >
              {rotating ? "Pause" : "Rotate"}
            </Button>
            <Button
              aria-label="Zoom out"
              onClick={() => {
                const viewer = viewerRef.current,
                  controls = viewer?.getPlugin(OrbitControlsPlugin)?.controls;
                if (viewer && controls) {
                  motion.stopCamera();
                  viewer.camera.position
                    .sub(controls.target)
                    .multiplyScalar(1.15)
                    .add(controls.target);
                  controls.update();
                  viewer.needsRender = true;
                }
              }}
            >
              −
            </Button>
            <Button
              aria-label="Zoom in"
              onClick={() => {
                const viewer = viewerRef.current,
                  controls = viewer?.getPlugin(OrbitControlsPlugin)?.controls;
                if (viewer && controls) {
                  motion.stopCamera();
                  viewer.camera.position
                    .sub(controls.target)
                    .multiplyScalar(1 / 1.15)
                    .add(controls.target);
                  controls.update();
                  viewer.needsRender = true;
                }
              }}
            >
              +
            </Button>
            <Button
              aria-label="Fullscreen preview"
              onClick={() => {
                const stage = containerRef.current?.closest(".js-stage");
                if (document.fullscreenElement)
                  document.exitFullscreen().catch(() => {});
                else stage?.requestFullscreen?.().catch(() => {});
              }}
            >
              ⛶
            </Button>
            <Button
              aria-label="Reset preview"
              onClick={() => { setActiveView("Studio"); setRotating(false); motion.view("Studio"); }}
            >
              Reset
            </Button>
          </StudioToolbar>
          <p className="atelier-stage-hint">
            Drag to explore · Pinch or scroll to zoom
          </p>
          {initialError && (
            <div className="original-loader" role="alert">
              <span>The preview couldn't load.</span>
              <Button onClick={() => window.location.reload()}>
                Reload preview
              </Button>
            </div>
          )}
          {viewerStore.isModelLoading && (
            <div className="original-loader" role="status">
              <span className="noir-load-orbit" aria-hidden="true"><i /></span>
              <span>Preparing your 3D preview</span>
            </div>
          )}
        </section>
        <MaterialControls
          importRevision={importRevision}
          viewerRef={viewerRef}
          onMetalTone={motion.sweep}
          onPieceChange={(name, description) => { setPiece({ name, description }); setActiveView("Studio"); setRotating(false); motion.rememberHome(); }}
        />
      </main>
    </div>
  );
});

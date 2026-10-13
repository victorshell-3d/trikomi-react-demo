import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ThreeViewer, EnvironmentPlugin, OrbitControlsPlugin, CenterModelPlugin, ViewerStore, StatsPlugin, useViewerStore } from '@trikomi/core';
import { useConfigStore } from '../store/ConfiguratorStore';
import { SportswearConfigurator, type SportswearModelDef } from '@trikomi/core/sportswear';

const AVAILABLE_MODELS: SportswearModelDef[] = [
  { name: 'Rugby Jersey', url: `${import.meta.env.BASE_URL}models/RugbyJersey.gltf`, svg: `${import.meta.env.BASE_URL}textures/JSY-85 RL.svg`, mat: 'main' },
  { name: 'Basketball Singlet', url: `${import.meta.env.BASE_URL}models/BasketballSinglet.gltf`, svg: `${import.meta.env.BASE_URL}textures/BAS20_01.svg`, mat: 'main' },
  { name: 'Soccer Jersey', url: `${import.meta.env.BASE_URL}models/SoccerJersey.gltf`, svg: `${import.meta.env.BASE_URL}textures/FTB20_01.svg`, mat: 'main' }
];

export const ThreeCanvas: React.FC = observer(() => {
  const configStore = useConfigStore();
  const contextStore = useViewerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<SportswearConfigurator | null>(null);
  const [modelIndex, setModelIndex] = useState(0);
  const isInitialRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const engineStore = new ViewerStore();
    engineStore.backgroundColor = 'transparent';
    engineStore.showStats = false;

    const viewer = new ThreeViewer(containerRef.current, engineStore, {
      onAuthorized: () => {
        viewer.addPlugin(new EnvironmentPlugin());
      }
    });

    viewer.addPlugin(new OrbitControlsPlugin());
    const centerPlugin = new CenterModelPlugin({ center: true, floor: false, fitCamera: true });
    viewer.addPlugin(centerPlugin);

    viewer.camera.position.set(0, 1, 3);
    viewer.directionalLight.position.set(2, 5, 3);
    viewer.directionalLight.intensity = 1;

    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    const texBase = `${import.meta.env.BASE_URL}textures/`;

    const configurator = new SportswearConfigurator(viewer, configStore, texBase);
    configuratorRef.current = configurator;

    // React application bridge: sync store updates to GPU compositor
    configStore.onLogoTransform = (id, transform) => {
      configurator.compositor.updateOverlayTransform(
        id,
        transform.x,
        transform.y,
        transform.width,
        transform.height,
        transform.rotation
      );
      configurator.compositor.syncGizmo();
    };

    configStore.onSelectLogo = (id) => {
      configurator.compositor.selectedOverlayId = id;
      configurator.compositor.syncGizmo();
    };

    configStore.onLogosChanged = () => {
      configurator.compositor.updateOverlays(
        configStore.logos.map(l => ({ ...l })),
        configStore.selectedLogoId
      );
    };

    // Safety: ensure dragging state is always cleanly reset on pointer release
    const dom = viewer.renderer.domElement;
    const handleGlobalPointerUp = () => {
      (configurator as any)._isDraggingOverlay = false;
    };
    dom.addEventListener('pointerup', handleGlobalPointerUp);
    dom.addEventListener('pointercancel', handleGlobalPointerUp);

    const currentModelDef = AVAILABLE_MODELS[0];
    const url = contextStore?.options?.model || currentModelDef.url;
    const svgUrl = currentModelDef.svg;

    configurator.loadModel({ ...currentModelDef, url, svg: svgUrl }, centerPlugin);

    return () => {
      configStore.onLogoTransform = undefined;
      configStore.onSelectLogo = undefined;
      configStore.onLogosChanged = undefined;
      dom.removeEventListener('pointerup', handleGlobalPointerUp);
      dom.removeEventListener('pointercancel', handleGlobalPointerUp);
      configurator.dispose();
      viewer.dispose();
    };
  }, []);

  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    if (!configuratorRef.current) return;
    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    const currentModelDef = AVAILABLE_MODELS[modelIndex];
    const url = currentModelDef.url;
    const svgUrl = currentModelDef.svg;

    const centerPlugin = configuratorRef.current.viewer.getPlugin(CenterModelPlugin);
    configuratorRef.current.loadModel({ ...currentModelDef, url, svg: svgUrl }, centerPlugin || undefined);
  }, [modelIndex]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Left Carousel Arrow */}
      <button
        className="carousel-arrow left"
        onClick={() => setModelIndex((prev) => (prev > 0 ? prev - 1 : AVAILABLE_MODELS.length - 1))}
        aria-label="Previous Model"
        title={AVAILABLE_MODELS[(modelIndex > 0 ? modelIndex - 1 : AVAILABLE_MODELS.length - 1)].name}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right Carousel Arrow */}
      <button
        className="carousel-arrow right"
        onClick={() => setModelIndex((prev) => (prev < AVAILABLE_MODELS.length - 1 ? prev + 1 : 0))}
        aria-label="Next Model"
        title={AVAILABLE_MODELS[(modelIndex < AVAILABLE_MODELS.length - 1 ? modelIndex + 1 : 0)].name}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
});

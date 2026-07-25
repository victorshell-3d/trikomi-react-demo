import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ThreeViewer, EnvironmentPlugin, OrbitControlsPlugin, CenterModelPlugin, ViewerStore, StatsPlugin, useViewerStore } from '@trikomi/core';
import { useConfigStore } from '../store/ConfiguratorStore';
import { SportswearConfigurator, type SportswearModelDef } from '@trikomi/core/sportswear';

const AVAILABLE_MODELS: SportswearModelDef[] = [
  { name: 'Rugby Jersey', url: '/models/RugbyJersey.gltf', svg: '/textures/JSY-85 RL.svg', mat: 'main' },
  { name: 'Basketball Singlet', url: '/models/BasketballSinglet.gltf', svg: '/textures/BAS20_01.svg', mat: 'main' },
  { name: 'Soccer Jersey', url: '/models/SoccerJersey.gltf', svg: '/textures/FTB20_01.svg', mat: 'main' }
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
    engineStore.showStats = true;

    const viewer = new ThreeViewer(containerRef.current, engineStore, {
      onAuthorized: () => {
        viewer.addPlugin(new EnvironmentPlugin());
      }
    });

    viewer.addPlugin(new OrbitControlsPlugin());
    const centerPlugin = new CenterModelPlugin({ center: true, floor: false, fitCamera: true });
    viewer.addPlugin(centerPlugin);
    viewer.addPlugin(new StatsPlugin());

    viewer.camera.position.set(0, 1, 3);
    viewer.directionalLight.position.set(2, 5, 3);
    viewer.directionalLight.intensity = 1;

    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    const texBase = isDev ? '/textures/' : '../textures/';

    const configurator = new SportswearConfigurator(viewer, configStore, texBase);
    configuratorRef.current = configurator;

    const currentModelDef = AVAILABLE_MODELS[0];
    const url = contextStore?.options?.model || (isDev ? currentModelDef.url : `..${currentModelDef.url}`);
    const svgBase = isDev ? '' : '..';
    const svgUrl = `${svgBase}${currentModelDef.svg}`;

    configurator.loadModel({ ...currentModelDef, url, svg: svgUrl }, centerPlugin);

    return () => {
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
    const url = isDev ? currentModelDef.url : `..${currentModelDef.url}`;
    const svgBase = isDev ? '' : '..';
    const svgUrl = `${svgBase}${currentModelDef.svg}`;

    const centerPlugin = configuratorRef.current.viewer.getPlugin(CenterModelPlugin);
    configuratorRef.current.loadModel({ ...currentModelDef, url, svg: svgUrl }, centerPlugin || undefined);
  }, [modelIndex]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Model Selection Floating Bar */}
      <div style={{
        position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '20px',
        background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', padding: '12px 24px', borderRadius: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 10
      }}>
        <button
          onClick={() => setModelIndex((prev) => (prev > 0 ? prev - 1 : AVAILABLE_MODELS.length - 1))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#0f172a', display: 'flex', alignItems: 'center' }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a', minWidth: '120px', textAlign: 'center' }}>
          {AVAILABLE_MODELS[modelIndex].name}
        </div>

        <button
          onClick={() => setModelIndex((prev) => (prev < AVAILABLE_MODELS.length - 1 ? prev + 1 : 0))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#0f172a', display: 'flex', alignItems: 'center' }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
});

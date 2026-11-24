import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import * as THREE from 'three';
import virtualTourStore from '../store/VirtualTourStore';
import { loadEquirectangularPanorama, createHotspotsFromJSON, createShapesFromJSON, createAudioPointsFromJSON, switchScene } from '@trikomi/core/tour';
import {
  AppHeaderBar,
  FloatingControlDock,
  CanvasControlToolbar,
  useVictorShellTheme
} from '@trikomi/ui-kit';
import TourInspector from './TourInspector';
import MediaModal from './MediaModal';
import FloorPlanMap from './FloorPlanMap';
import { useLocalImage } from '../hooks/useLocalImage';
import DOMPurify from 'dompurify';

const VirtualTour = observer(({ customConfigMode }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const vtPluginRef = useRef(null);
  const currentSceneIdRef = useRef(null); // tracks current scene ID for teleport logic
  const motionBlurPluginRef = useRef(null);
  const currentGroupRef = useRef(null);
  const nextGroupRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const isMutedRef = useRef(true);
  const navigate = useNavigate();

  // Try using VictorShell theme context safely
  let themeContext = null;
  try {
    themeContext = useVictorShellTheme();
  } catch {
    // Fallback if rendered outside provider
  }
  const [localTheme, setLocalTheme] = useState('indigo');
  const activeAccent = themeContext ? themeContext.accent : localTheme;
  const setActiveAccent = themeContext ? themeContext.setAccent : setLocalTheme;

  const [isMuted, setIsMuted] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : false);
  const [activeDockTab, setActiveDockTab] = useState('scenes');
  const [showFloorPlan, setShowFloorPlan] = useState(true);

  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });
  const [mediaModal, setMediaModal] = useState({ show: false, content: null });
  const [engineReady, setEngineReady] = useState(false);
  const [tourStarted, setTourStarted] = useState(false);
  const globalAudioRef = useRef(null);

  // Responsive breakpoint observer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleViewportChange = (e) => {
      setIsMobile(e.matches);
      if (e.matches) {
        setIsInspectorOpen(false);
      }
    };
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  // Load tour on mount from API
  const { tourId: paramTourId } = useParams();
  const tourId = window.__STANDALONE__ ? 'standalone' : paramTourId;
  const globalAudioLocalUrl = useLocalImage(tourId, virtualTourStore.tourData?.settings?.global_audio_url);

  useEffect(() => {
    if (customConfigMode) return; // Skip API load if config was passed directly
    const tourToLoad = tourId || 1;
    virtualTourStore.loadTourFromApi(tourToLoad);
  }, [tourId, customConfigMode]);

  // Engine Initialization
  useEffect(() => {
    if (!containerRef.current) return;

    let viewer;
    import('@trikomi/core').then(({ ThreeViewer, ViewerStore, VirtualTourPlugin, MotionBlurPlugin }) => {
      const store = new ViewerStore();
      viewer = new ThreeViewer(containerRef.current, store, {
        assetBaseUrl: window.__STANDALONE__ ? './images/' : '/packages/core/dist/assets/'
      });

      const vtPlugin = new VirtualTourPlugin();
      const mbPlugin = new MotionBlurPlugin();
      
      viewer.addPlugin(vtPlugin);
      viewer.addPlugin(mbPlugin);

      vtPlugin.onHotspotClick = (targetSceneId, direction, targetYaw) => {
        if (isTransitioningRef.current || !virtualTourStore.tourData) return;
        setTooltip(prev => ({ ...prev, show: false }));
        
        switchScene(targetSceneId, direction, targetYaw, {
          sceneRef: { current: viewer.scene },
          currentGroupRef,
          nextGroupRef,
          isTransitioningRef,
          motionBlurPluginRef: { current: mbPlugin },
          vtPluginRef: { current: vtPlugin },
          audioListenerRef: { current: vtPlugin.getAudioListener() },
          currentSceneIdRef
        }, virtualTourStore.tourData, (sceneId) => {
          virtualTourStore.setCurrentScene(sceneId);
          currentSceneIdRef.current = sceneId; // keep ref in sync
        }, async (tourId, relativePath) => {
          const { getImageObjectURL } = await import('@trikomi/core/tour');
          return getImageObjectURL(tourId, relativePath);
        });
      };

      vtPlugin.onHotspotHover = (hotspotData, screenPos) => {
        if (hotspotData && screenPos) {
          setTooltip({
            show: true,
            x: screenPos.x,
            y: screenPos.y - 50,
            text: hotspotData.label || 'Go to scene'
          });
        } else {
          setTooltip(prev => ({ ...prev, show: false }));
        }
      };

      vtPlugin.onShapeClick = (shapeData, sourceBounds) => {
        if (shapeData.actionType === 'show_image' && shapeData.media) {
          setMediaModal({
            show: true,
            content: { type: 'image', url: shapeData.media.url, title: shapeData.media.title || shapeData.name, description: shapeData.media.description },
            sourceBounds
          });
        } else if (shapeData.actionType === 'open_url' && shapeData.url) {
          setMediaModal({
            show: true,
            content: { type: 'url', url: shapeData.url, title: shapeData.name, description: shapeData.description },
            sourceBounds
          });
        } else if (shapeData.actionType === 'show_info' && shapeData.infoContent) {
          setMediaModal({
            show: true,
            content: { type: 'info', content: shapeData.infoContent, title: shapeData.name },
            sourceBounds
          });
        } else if (shapeData.media) {
          setMediaModal({
            show: true,
            content: { type: 'image', url: shapeData.media.url, title: shapeData.media.title || shapeData.name, description: shapeData.media.description },
            sourceBounds
          });
        }
      };

      viewerRef.current = viewer;
      vtPluginRef.current = vtPlugin;
      motionBlurPluginRef.current = mbPlugin;

      // Update post processing to inject motion blur node and WASM security nodes
      viewer.updatePostProcessing();
      setEngineReady(true);
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose();
      }
    };
  }, []);

  // Load initial scene when data & engine are ready
  useEffect(() => {
    if (!engineReady || !virtualTourStore.tourData || !virtualTourStore.currentSceneId || !viewerRef.current) return;
    
    const currentScene = virtualTourStore.currentScene;
    if (!currentScene) return;

    // sync ref with current scene id
    currentSceneIdRef.current = virtualTourStore.currentSceneId;
    
    const viewer = viewerRef.current;
    const vtPlugin = vtPluginRef.current;

    import('@trikomi/core/tour').then(m => m.getImageObjectURL(virtualTourStore.tourData.id, currentScene.panorama)).then(resolvedUrl => {
      loadEquirectangularPanorama(resolvedUrl || currentScene.panorama).then(async (sphere) => {
        if (currentGroupRef.current) {
          viewer.scene.remove(currentGroupRef.current);
          
          currentGroupRef.current.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) child.material.dispose();
            }
          });
        }
        
        const sceneGroup = new THREE.Group();
        currentGroupRef.current = sceneGroup;
        viewer.scene.add(sceneGroup);
        sceneGroup.add(sphere);

        const resolveAssetUrl = async (tourId, relativePath) => {
          const { getImageObjectURL } = await import('@trikomi/core/tour');
          return getImageObjectURL(tourId, relativePath);
        };

        // Apply settings
        const settings = virtualTourStore.tourData.settings || {};
        vtPlugin.autoRotate = settings.auto_rotate === true;
        vtPlugin.autoRotateSpeed = settings.auto_rotate_speed !== undefined ? settings.auto_rotate_speed : 1.0;

        // Apply Nadir Patch
        import('@trikomi/core/tour').then(m => {
          m.applyNadirPatch(sphere, virtualTourStore.tourData.id, settings, resolveAssetUrl);
        });

        // Apply initial view yaw offset if available
        let initialYawOffset = 0;
        if (currentScene.initial_view && currentScene.initial_view.yaw !== undefined) {
          initialYawOffset = currentScene.initial_view.yaw;
          sphere.rotation.y = -THREE.MathUtils.degToRad(initialYawOffset);
          sphere.userData.yawOffset = initialYawOffset;
        }

        const hotspots = [];
        await createHotspotsFromJSON(sceneGroup, sphere, hotspots, currentScene.hotspots || [], virtualTourStore.tourData.id, resolveAssetUrl);
        vtPlugin.setHotspots(hotspots);

        let shapes = [];
        if (currentScene.shapes && currentScene.shapes.length > 0) {
          const texture = sphere.material.map;
          const actualWidth = texture.image ? texture.image.width : (currentScene.image_width || 4096);
          const actualHeight = texture.image ? texture.image.height : (currentScene.image_height || 2048);
          shapes = createShapesFromJSON(currentScene.shapes, actualWidth, actualHeight, 500, virtualTourStore.tourData.id, initialYawOffset, resolveAssetUrl);
          
          shapes.forEach(mesh => {
            sceneGroup.add(mesh);
            if (mesh.userData.media && mesh.userData.media.url) {
               const url = mesh.userData.media.url;
               if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg') || mesh.userData.media.type === 'audio') {
                 resolveAssetUrl(virtualTourStore.tourData.id, url).then(blobUrl => {
                   if (blobUrl) {
                     const audio = document.createElement('audio');
                     audio.src = blobUrl; audio.loop = true; audio.volume = 0;
                     mesh.userData.htmlAudioElement = audio;
                     mesh.userData.audioPosition = mesh.position.clone();
                     audio.play().catch(() => {});
                   }
                 });
               }
            }
          });
        }
        vtPlugin.setShapes(shapes);

        const audioPoints = [];
        await createAudioPointsFromJSON(sceneGroup, vtPlugin.getAudioListener(), audioPoints, currentScene.audio_points || [], virtualTourStore.tourData.id, initialYawOffset, resolveAssetUrl);
        vtPlugin.setAudioPoints(audioPoints);

        if (isMutedRef.current) {
          vtPlugin.setMute(true);
        }
      });
    });

  }, [engineReady, virtualTourStore.tourData]);

  useEffect(() => {
    if (engineReady && virtualTourStore.tourData?.settings) {
      if (!virtualTourStore.tourData.settings.welcome_screen?.enabled) {
        setTourStarted(true);
      }
    }
  }, [engineReady, virtualTourStore.tourData]);

  const toggleMute = () => {
    const vtPlugin = vtPluginRef.current;
    if (!vtPlugin) return;

    if (!isMutedRef.current && vtPlugin.getAudioListener() && vtPlugin.getAudioListener().context.state === 'suspended') {
      vtPlugin.getAudioListener().context.resume();
    }

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    isMutedRef.current = newMuted;
    vtPlugin.setMute(newMuted);
    
    if (globalAudioRef.current) {
      globalAudioRef.current.muted = newMuted;
      if (!newMuted) {
        globalAudioRef.current.play().catch(() => {});
      }
    }
  };

  const handleSelectScene = (targetSceneId) => {
    if (isTransitioningRef.current || !virtualTourStore.tourData || !viewerRef.current) return;
    if (targetSceneId === virtualTourStore.currentSceneId) return;

    switchScene(targetSceneId, null, undefined, {
      sceneRef: { current: viewerRef.current.scene },
      currentGroupRef,
      nextGroupRef,
      isTransitioningRef,
      motionBlurPluginRef,
      vtPluginRef,
      audioListenerRef: { current: vtPluginRef.current?.getAudioListener() },
      currentSceneIdRef
    }, virtualTourStore.tourData, (sceneId) => {
      virtualTourStore.setCurrentScene(sceneId);
      currentSceneIdRef.current = sceneId;
    }, async (tourId, relativePath) => {
      const { getImageObjectURL } = await import('@trikomi/core/tour');
      return getImageObjectURL(tourId, relativePath);
    });
  };

  const handleRecenter = () => {
    const vtPlugin = vtPluginRef.current;
    if (vtPlugin) {
      if (typeof vtPlugin.panCameraTo === 'function') {
        vtPlugin.panCameraTo(0, 0);
      } else if (typeof vtPlugin.setCameraRotation === 'function') {
        vtPlugin.setCameraRotation(0, 0);
      }
    }
  };

  const toggleAutoRotate = () => {
    const vtPlugin = vtPluginRef.current;
    const nextVal = !isAutoRotate;
    setIsAutoRotate(nextVal);
    if (vtPlugin) {
      vtPlugin.autoRotate = nextVal;
      if (nextVal && !vtPlugin.autoRotateSpeed) {
        vtPlugin.autoRotateSpeed = 0.5;
      }
    }
  };

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const dockItems = useMemo(() => [
    { id: 'scenes', label: 'Scenes', icon: '🖼️', badge: virtualTourStore.tourData?.scenes?.length || undefined },
    { id: 'hotspots', label: 'Hotspots', icon: '📍', badge: virtualTourStore.currentScene?.hotspots?.length || undefined },
    { id: 'shapes', label: 'Media', icon: '✨', badge: virtualTourStore.currentScene?.shapes?.length || undefined },
    { id: 'audio', label: 'Audio', icon: isMuted ? '🔇' : '🔊' },
    { id: 'floorplan', label: 'Minimap', icon: '🗺️' }
  ], [virtualTourStore.tourData, virtualTourStore.currentScene, isMuted]);

  const handleDockSelect = (tabId) => {
    if (tabId === 'floorplan') {
      setShowFloorPlan(prev => !prev);
      return;
    }
    if (tabId === 'audio') {
      toggleMute();
      return;
    }
    setActiveDockTab(tabId);
    if (!isInspectorOpen) {
      setIsInspectorOpen(true);
    }
  };

  const handleStartTour = () => {
    setTourStarted(true);
    if (!isMuted) {
      // Audio context might need to resume on user interaction
      const vtPlugin = vtPluginRef.current;
      if (vtPlugin?.getAudioListener()?.context.state === 'suspended') {
        vtPlugin.getAudioListener().context.resume();
      }
      if (globalAudioRef.current) {
        globalAudioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <>
      {(virtualTourStore.loading || !engineReady) && (
        <div style={{
          position: 'absolute', top: 0, left: 0, zIndex: 9999,
          width: '100%', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0d1117', color: 'white'
        }}>
          Loading tour...
        </div>
      )}

      {globalAudioLocalUrl && (
        <audio 
          ref={globalAudioRef} 
          src={globalAudioLocalUrl} 
          loop 
          muted={isMuted} 
        />
      )}

      {!tourStarted && virtualTourStore.tourData?.settings?.welcome_screen?.enabled && (
        <div className="welcome-screen" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
          zIndex: 9000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          textAlign: 'center',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ padding: '40px', maxWidth: '600px' }}>
            {virtualTourStore.tourData.settings.welcome_screen.html && (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(virtualTourStore.tourData.settings.welcome_screen.html) }} />
            )}
            <button
              className="vs-btn vs-btn-primary"
              style={{ fontSize: '1.1rem', padding: '14px 36px', marginTop: 28 }}
              onClick={handleStartTour}
            >
              Start Tour
            </button>
          </div>
        </div>
      )}

      {/* 360 Viewer Canvas Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          opacity: tourStarted ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
      >
        {tooltip.show && (
          <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
            <div className="tooltip-arrow" />
          </div>
        )}

        {mediaModal.show && mediaModal.content && (
          <MediaModal
            isOpen={mediaModal.show}
            onClose={() => setMediaModal({ show: false, content: null })}
            content={mediaModal.content}
            sourceBounds={mediaModal.sourceBounds}
          />
        )}

        {showFloorPlan && virtualTourStore.tourData && virtualTourStore.tourData.settings && (
          <FloorPlanMap 
            tourId={virtualTourStore.tourData.id}
            settings={virtualTourStore.tourData.settings}
            scenes={virtualTourStore.tourData.scenes || []}
            currentSceneId={virtualTourStore.currentSceneId}
            onSceneSelect={(targetScene) => {
              if (isTransitioningRef.current || !virtualTourStore.tourData) return;
              
              switchScene(targetScene.id, null, undefined, {
                sceneRef: { current: viewerRef.current.scene },
                currentGroupRef,
                nextGroupRef,
                isTransitioningRef,
                motionBlurPluginRef,
                vtPluginRef,
                audioListenerRef: { current: vtPluginRef.current?.getAudioListener() },
                currentSceneIdRef
              }, virtualTourStore.tourData, (sceneId) => {
                virtualTourStore.setCurrentScene(sceneId);
                currentSceneIdRef.current = sceneId;
              });
            }}
          />
        )}
      </div>

      {/* VictorShell UI Kit Overlays */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <AppHeaderBar
            brandTitle="TRIKOMI"
            productTitle={virtualTourStore.tourData?.title || '360° Virtual Tour'}
            backLabel="← Back to Dashboard"
            onBack={() => navigate('/dashboard')}
            theme={activeAccent}
            onThemeChange={setActiveAccent}
            showThemeSwitcher={true}
            statusBadge={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                {virtualTourStore.currentScene?.name || '360° Panorama'}
              </span>
            }
            actions={
              <button
                type="button"
                className="vs-btn vs-btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => setIsInspectorOpen(prev => !prev)}
                aria-label="Toggle tour inspector drawer"
              >
                <span>{isInspectorOpen ? '✕ Hide Drawer' : '☰ Tour Drawer'}</span>
              </button>
            }
          />
        </div>
      </div>

      {/* Floating Canvas Control Toolbar */}
      <div style={{ position: 'fixed', top: '76px', right: '20px', zIndex: 90 }}>
        <CanvasControlToolbar
          position="top-right"
          onRecenter={handleRecenter}
          extraActions={
            <div style={{ display: 'inline-flex', gap: '4px' }}>
              <button
                type="button"
                className={`vs-btn vs-btn-icon ${isAutoRotate ? 'vs-btn--active' : ''}`}
                onClick={toggleAutoRotate}
                title={isAutoRotate ? 'Stop Rotation' : 'Auto-Rotate'}
                aria-label="Toggle Auto-Rotate"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isAutoRotate ? 'var(--vs-accent-primary, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer'
                }}
              >
                {isAutoRotate ? '⏹' : '🔄'}
              </button>
              <button
                type="button"
                className="vs-btn vs-btn-icon"
                onClick={toggleMute}
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                aria-label="Toggle Sound"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer'
                }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button
                type="button"
                className="vs-btn vs-btn-icon"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                aria-label="Toggle Fullscreen"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer'
                }}
              >
                ⛶
              </button>
            </div>
          }
        />
      </div>

      {/* Floating Bottom Control Dock */}
      <FloatingControlDock
        items={dockItems}
        activeId={activeDockTab}
        onSelect={handleDockSelect}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100
        }}
      />

      {/* Glass Inspector Drawer */}
      <TourInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        tourData={virtualTourStore.tourData}
        currentScene={virtualTourStore.currentScene}
        currentSceneId={virtualTourStore.currentSceneId}
        onSelectScene={handleSelectScene}
        activeTab={activeDockTab}
        onTabChange={setActiveDockTab}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={toggleAutoRotate}
      />
    </>
  );
});

export default VirtualTour;

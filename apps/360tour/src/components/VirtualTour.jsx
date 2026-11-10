import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import * as THREE from 'three';
import virtualTourStore from '../store/VirtualTourStore';
import { loadEquirectangularPanorama, createHotspotsFromJSON, createShapesFromJSON, createAudioPointsFromJSON, switchScene } from '@trikomi/core/tour';
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

  const [isMuted, setIsMuted] = useState(true);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });
  const [mediaModal, setMediaModal] = useState({ show: false, content: null });
  const [engineReady, setEngineReady] = useState(false);
  const [tourStarted, setTourStarted] = useState(false);
  const [sceneError, setSceneError] = useState('');
  const globalAudioRef = useRef(null);

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

    // Touch controls for phones - the engine plugin only listens to mouse events
    const container = containerRef.current;
    container.style.touchAction = 'none';
    let lastTouch = null;
    let pinchDist = 0;
    const handleTouchStart = (e) => {
      if (!vtPluginRef.current) return;
      vtPluginRef.current.isDragging = true;
      if (e.touches.length === 1) {
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        pinchDist = 0;
      } else if (e.touches.length === 2) {
        lastTouch = null;
        pinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      }
    };
    const handleTouchMove = (e) => {
      const vtPlugin = vtPluginRef.current;
      if (!vtPlugin) return;
      e.preventDefault();
      if (e.touches.length === 1 && lastTouch) {
        const dx = e.touches[0].clientX - lastTouch.x;
        const dy = e.touches[0].clientY - lastTouch.y;
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        vtPlugin.targetRotation.x += dy * 0.005;
        vtPlugin.targetRotation.y += dx * 0.005;
        vtPlugin.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, vtPlugin.targetRotation.x));
      } else if (e.touches.length === 2 && pinchDist > 0) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const cam = viewerRef.current.camera;
        cam.fov = Math.max(25, Math.min(90, cam.fov - (dist - pinchDist) * 0.1));
        cam.updateProjectionMatrix();
        pinchDist = dist;
      }
    };
    const handleTouchEnd = () => {
      if (vtPluginRef.current) vtPluginRef.current.isDragging = false;
      lastTouch = null;
      pinchDist = 0;
    };
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

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
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
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
    setSceneError('');

    // sync ref with current scene id
    currentSceneIdRef.current = virtualTourStore.currentSceneId;
    
    const viewer = viewerRef.current;
    const vtPlugin = vtPluginRef.current;

    import('@trikomi/core/tour').then(m => m.getImageObjectURL(virtualTourStore.tourData.id, currentScene.panorama)).then(async resolvedUrl => {
      const panoUrl = resolvedUrl || currentScene.panorama;
      try {
        await createImageBitmap(await (await fetch(panoUrl)).blob());
      } catch {
        setSceneError('This panorama could not be loaded. Try a different image.');
        return;
      }
      loadEquirectangularPanorama(panoUrl).then(async (sphere) => {
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
      }).catch(() => {
        setSceneError('This panorama could not be loaded. Try a different image.');
      });
    }).catch(() => {
      setSceneError('This panorama could not be loaded. Try a different image.');
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
          background: '#1a1a1a', color: 'white'
        }}>
          Loading tour...
        </div>
      )}

      {sceneError && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 9999, padding: '12px 20px', borderRadius: 8, maxWidth: '80%',
          background: 'rgba(0,0,0,0.85)', color: 'white', fontSize: '0.9rem', textAlign: 'center'
        }}>
          {sceneError}
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
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{ padding: '40px' }}>
            {virtualTourStore.tourData.settings.welcome_screen.html && (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(virtualTourStore.tourData.settings.welcome_screen.html) }} />
            )}
            <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '12px 32px', marginTop: 24 }} onClick={handleStartTour}>
              Start Tour
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, overflow: 'hidden', opacity: tourStarted ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {virtualTourStore.currentScene && (
          <div className="viewer-scene-badge">
            <strong>{virtualTourStore.currentScene.name}</strong>
          </div>
        )}

        <button onClick={toggleMute} className="viewer-mute-btn">
          {isMuted ? '🔇' : '🔊'}
        </button>

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

        {virtualTourStore.tourData && virtualTourStore.tourData.settings && (
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
                audioListenerRef: { current: vtPluginRef.current.getAudioListener() },
                currentSceneIdRef
              }, virtualTourStore.tourData, (sceneId) => {
                virtualTourStore.setCurrentScene(sceneId);
                currentSceneIdRef.current = sceneId;
              });
            }}
          />
        )}
      </div>
    </>
  );
});

export default VirtualTour;

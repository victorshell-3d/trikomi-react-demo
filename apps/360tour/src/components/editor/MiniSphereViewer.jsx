/* eslint-disable */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const MiniSphereViewer = ({ imageUrl, targetYaw = 0, onCapture }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const sphereRef = useRef(null);
  const captureTimeoutRef = useRef(null);

  const triggerCapture = () => {
    if (!onCapture) return;
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
    }
    captureTimeoutRef.current = setTimeout(() => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        // Force a fresh render to make sure the drawing buffer is populated
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        const dataUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
      }
    }, 150);
  };

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = THREE.MathUtils.degToRad(targetYaw);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Sphere
    const geometry = new THREE.SphereGeometry(100, 60, 40);
    geometry.scale(-1, 1, 1); // Invert to look inside

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereRef.current = sphere;
      
      // Initial render & capture
      renderer.render(scene, camera);
      triggerCapture();
    });

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      if (sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [imageUrl]);

  // Update rotation when targetYaw changes
  useEffect(() => {
    if (cameraRef.current && rendererRef.current && sceneRef.current) {
      cameraRef.current.rotation.y = THREE.MathUtils.degToRad(targetYaw);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      triggerCapture();
    }
  }, [targetYaw]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', border: '1px solid var(--border-color)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {/* Center Crosshair */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 0 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none'
      }}>
        +
      </div>
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        background: 'rgba(0,0,0,0.6)',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        color: '#fff',
        pointerEvents: 'none'
      }}>
        View Preview
      </div>
    </div>
  );
};

export default MiniSphereViewer;

import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import { OrbitControlsPlugin, type ThreeViewer } from "@trikomi/core";

// App-layer camera and studio-light feedback. The SDK owns rendering and auth.
export function useStudioMotion(viewerRef: React.MutableRefObject<ThreeViewer | null>) {
  const cameraFrame = useRef(0);
  const lightFrame = useRef(0);
  const lightOriginal = useRef<number | null>(null);
  const lightPosition = useRef<THREE.Vector3 | null>(null);
  const introduced = useRef(false);
  const home = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const reduced = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  const stopCamera = () => { cancelAnimationFrame(cameraFrame.current); };
  const glide = (position: THREE.Vector3, target: THREE.Vector3, duration = 260) => {
    const viewer = viewerRef.current;
    const controls = viewer?.getPlugin(OrbitControlsPlugin)?.controls;
    if (!viewer || !controls) return;
    stopCamera();
    const from = viewer.camera.position.clone(), oldTarget = controls.target.clone();
    const at = performance.now();
    const move = (now: number) => {
      const t = reduced() ? 1 : Math.min((now - at) / duration, 1), ease = 1 - Math.pow(1 - t, 3);
      viewer.camera.position.lerpVectors(from, position, ease);
      controls.target.lerpVectors(oldTarget, target, ease);
      controls.update(); viewer.needsRender = true;
      if (t < 1) cameraFrame.current = requestAnimationFrame(move);
    };
    cameraFrame.current = requestAnimationFrame(move);
  };
  const rememberHome = () => {
    const viewer = viewerRef.current, controls = viewer?.getPlugin(OrbitControlsPlugin)?.controls;
    if (viewer && controls) home.current = { position: viewer.camera.position.clone(), target: controls.target.clone() };
  };
  const introduce = () => {
    rememberHome();
    if (introduced.current) return;
    introduced.current = true;
    const viewer = viewerRef.current, controls = viewer?.getPlugin(OrbitControlsPlugin)?.controls;
    if (!viewer || !controls || reduced() || !home.current) return;
    const offset = viewer.camera.position.clone().sub(controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    viewer.camera.position.copy(controls.target).add(offset); controls.update();
    glide(home.current.position, home.current.target, 1400);
  };
  const view = (name: string) => {
    const viewer = viewerRef.current, controls = viewer?.getPlugin(OrbitControlsPlugin)?.controls;
    if (!viewer || !controls) return;
    viewer.store.autoRotate = false;
    if (!home.current) rememberHome();
    if (name === "Studio" && home.current) { glide(home.current.position, home.current.target); return; }
    const target = controls.target.clone(), distance = viewer.camera.position.distanceTo(target);
    const direction = name === "Front" ? new THREE.Vector3(0, .12, 1) : name === "Profile" ? new THREE.Vector3(1, .12, 0) : new THREE.Vector3(0, 1, .03);
    glide(target.clone().add(direction.normalize().multiplyScalar(distance)), target);
  };
  const sweep = () => {
    const viewer = viewerRef.current;
    if (!viewer || reduced()) return;
    cancelAnimationFrame(lightFrame.current);
    const light = viewer.directionalLight;
    if (!light) return;
    lightOriginal.current ??= light.intensity;
    lightPosition.current ??= light.position.clone();
    const position = lightPosition.current.clone();
    const intensity = lightOriginal.current, at = performance.now();
    const move = (now: number) => {
      const t = Math.min((now - at) / 280, 1);
      light.intensity = intensity * (1 + Math.sin(t * Math.PI) * .18);
      light.position.copy(position);
      light.position.x += Math.sin(t * Math.PI * 2) * Math.max(position.length(), 1) * .12;
      viewer.needsRender = true;
      if (t < 1) lightFrame.current = requestAnimationFrame(move);
      else { light.intensity = intensity; light.position.copy(position); lightOriginal.current = null; lightPosition.current = null; }
    };
    lightFrame.current = requestAnimationFrame(move);
  };
  useEffect(() => () => {
    stopCamera(); cancelAnimationFrame(lightFrame.current);
    if (lightOriginal.current !== null && viewerRef.current?.directionalLight) { viewerRef.current.directionalLight.intensity = lightOriginal.current; if (lightPosition.current) viewerRef.current.directionalLight.position.copy(lightPosition.current); }
  }, []);
  return { introduce, rememberHome, stopCamera, view, sweep };
}

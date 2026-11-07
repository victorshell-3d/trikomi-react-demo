import * as THREE from 'three/webgpu';
import { ThreeViewer, OrbitControlsPlugin } from '@trikomi/core';

// Portrait screens are narrow, so pull the camera back far enough
// for the whole model to stay in frame.
export const pullBackForPortrait = (viewer: ThreeViewer) => {
  const camera = viewer.camera;
  if (!camera || camera.aspect >= 1) return;
  const controls = viewer.getPlugin(OrbitControlsPlugin)?.controls;
  const target = controls?.target ?? new THREE.Vector3();
  const offset = camera.position.clone().sub(target);
  camera.position.copy(target).addScaledVector(offset, 1 / camera.aspect);
  controls?.update();
};

// AR places the model about 2 meters from the camera and only shrinks
// models bigger than 5 units, so anything smaller fills the whole view.
// Scale it down before AR starts and put the size back when AR ends.
let arScale = 1;

export const shrinkModelForAR = (viewer: ThreeViewer) => {
  const group = viewer.scene.getObjectByName('ModelGroup') as THREE.Group;
  if (!group) return;
  const size = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  arScale = maxDim > 1.5 ? 1.5 / maxDim : 1;
  group.scale.multiplyScalar(arScale);
};

export const restoreModelAfterAR = (viewer: ThreeViewer) => {
  const group = viewer.scene.getObjectByName('ModelGroup') as THREE.Group;
  if (group && arScale !== 1) {
    group.scale.multiplyScalar(1 / arScale);
  }
  arScale = 1;
};

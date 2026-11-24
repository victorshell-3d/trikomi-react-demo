import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'node:fs';

const glbBuffer = fs.readFileSync('public/models/ring.glb');
const loader = new GLTFLoader();

loader.parse(glbBuffer.buffer, '', (gltf) => {
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  console.log('Ring default bounding box size:', size);
  console.log('Meshes in ring.glb:');
  model.traverse(c => {
    if (c.isMesh) {
      console.log(' - Mesh:', c.name, 'parent:', c.parent?.name);
    }
  });
});

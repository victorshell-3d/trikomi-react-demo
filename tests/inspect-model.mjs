import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfData = fs.readFileSync('public/models/SoccerJersey.gltf');
const loader = new GLTFLoader();

loader.parse(gltfData.buffer, '', (gltf) => {
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  console.log('Box Min:', box.min);
  console.log('Box Max:', box.max);
  console.log('Size:', size);
  console.log('Center:', center);

  model.traverse(child => {
    if (child.isMesh) {
      console.log('Mesh:', child.name, 'Geometry vertices:', child.geometry.attributes.position.count);
      console.log('Material:', Array.isArray(child.material) ? child.material.map(m=>m.name) : child.material.name);
      const mat = Array.isArray(child.material) ? child.material[0] : child.material;
      console.log('  Color:', mat.color ? mat.color.getHexString() : 'none');
      console.log('  Map:', Boolean(mat.map));
      console.log('  Metalness:', mat.metalness, 'Roughness:', mat.roughness);
    }
  });
}, console.error);

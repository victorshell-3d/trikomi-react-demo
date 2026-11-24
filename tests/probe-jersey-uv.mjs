import fs from 'node:fs';

// Read public/models/SoccerJersey.gltf and inspect UV coordinates in buffers
const gltf = JSON.parse(fs.readFileSync('public/models/SoccerJersey.gltf'));
console.log('Meshes count:', gltf.meshes.length);
gltf.meshes.forEach((mesh, mIdx) => {
  console.log(`Mesh ${mIdx}: ${mesh.name}`);
  mesh.primitives.forEach((prim, pIdx) => {
    console.log(`  Primitive ${pIdx}: material index ${prim.material}`);
    console.log(`    Attributes:`, Object.keys(prim.attributes));
  });
});

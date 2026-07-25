import * as THREE from 'three';

const shape = new THREE.Shape();
shape.moveTo(-1, 0);
shape.lineTo(1, 0);
shape.lineTo(1, 3);
shape.lineTo(-1, 3);

const geo = new THREE.ShapeGeometry(shape);
const pos = geo.attributes.position.array;
const uv = geo.attributes.uv.array;

for(let i=0; i<pos.length; i+=3) {
  console.log(`Vertex: (${pos[i]}, ${pos[i+1]}) -> UV: (${uv[(i/3)*2]}, ${uv[(i/3)*2+1]})`);
}

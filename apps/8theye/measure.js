import fs from 'fs';

// Read GLB file
const buffer = fs.readFileSync('public/models/stereo-glasses.glb');

// The first 12 bytes are the GLB header
const magic = buffer.toString('utf8', 0, 4);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

// Chunk 0 is JSON
const chunk0Length = buffer.readUInt32LE(12);
const chunk0Type = buffer.toString('utf8', 16, 20);

const jsonBuffer = buffer.slice(20, 20 + chunk0Length);
const jsonStr = jsonBuffer.toString('utf8');
const gltf = JSON.parse(jsonStr);

// Find accessors that define position
const accessors = gltf.accessors;
let minX = Infinity, maxX = -Infinity;

for (const accessor of accessors) {
    if (accessor.type === 'VEC3') {
        if (accessor.min && accessor.max) {
            if (accessor.min[0] < minX) minX = accessor.min[0];
            if (accessor.max[0] > maxX) maxX = accessor.max[0];
        }
    }
}

console.log("Stereo Glasses Width:", maxX - minX);

// Also measure occluder
const occBuffer = fs.readFileSync('public/models/head-occluder.glb');
const occChunk0Length = occBuffer.readUInt32LE(12);
const occJsonStr = occBuffer.slice(20, 20 + occChunk0Length).toString('utf8');
const occGltf = JSON.parse(occJsonStr);

let occMinX = Infinity, occMaxX = -Infinity;
for (const accessor of occGltf.accessors) {
    if (accessor.type === 'VEC3' && accessor.min && accessor.max) {
        if (accessor.min[0] < occMinX) occMinX = accessor.min[0];
        if (accessor.max[0] > occMaxX) occMaxX = accessor.max[0];
    }
}
console.log("Head Occluder Width:", occMaxX - occMinX);

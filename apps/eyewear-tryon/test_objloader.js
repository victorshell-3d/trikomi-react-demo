import fs from 'fs';
const objData = fs.readFileSync('public/models/head_occluder.obj', 'utf8');
const lines = objData.split('\n');
let vCount = 0;
let fCount = 0;
for (const line of lines) {
    if (line.startsWith('v ')) vCount++;
    if (line.startsWith('f ')) fCount++;
}
console.log('Vertices:', vCount, 'Faces:', fCount, 'Unindexed Count:', fCount * 3);

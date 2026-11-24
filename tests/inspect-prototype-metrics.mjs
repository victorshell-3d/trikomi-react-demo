import fs from 'node:fs';
import path from 'node:path';

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';
const pSide = path.join(outDir, 'confidence-prototype-side-by-side.png');
const pSec = path.join(outDir, 'confidence-prototype-section.png');

console.log('confidence-prototype-side-by-side.png exists:', fs.existsSync(pSide), 'size:', fs.statSync(pSide).size);
console.log('confidence-prototype-section.png exists:', fs.existsSync(pSec), 'size:', fs.statSync(pSec).size);

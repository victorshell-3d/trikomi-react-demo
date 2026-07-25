/**
 * generate-asset-list.mjs
 * Reads public/export-dist/ after a viewer build and writes asset-list.json
 * so the browser-side exportApi knows which files to fetch and bundle into the download ZIP.
 *
 * Run automatically via:  yarn build:export
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Point to the monorepo root public directory instead of local public directory
const exportDistDir = path.resolve(__dirname, '..', '..', '..', 'public', 'export-dist');
const outPath = path.resolve(exportDistDir, 'asset-list.json');

if (!fs.existsSync(exportDistDir)) {
  console.error('❌ public/export-dist/ not found. Run the viewer build first.');
  process.exit(1);
}

function listFiles(dir, base = '') {
  const result = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (fs.statSync(full).isDirectory()) {
      result.push(...listFiles(full, rel));
    } else if (entry !== 'asset-list.json') {
      result.push(rel);
    }
  }
  return result;
}

const files = listFiles(exportDistDir);
fs.writeFileSync(outPath, JSON.stringify(files, null, 2));
console.log(`✅ asset-list.json written with ${files.length} entries → ${outPath}`);

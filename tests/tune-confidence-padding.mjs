import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve('packages/ui-kit/src/styles/viewer-exact.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace('.tk-confidence-section {\n  position: relative;\n  width: 100%;\n  background: #020308;\n  padding: 40px 0;', '.tk-confidence-section {\n  position: relative;\n  width: 100%;\n  background: #020308;\n  padding: 24px 0;');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Updated padding in viewer-exact.css');

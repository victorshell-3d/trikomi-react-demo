import fs from 'node:fs';
import path from 'node:path';

const dir = 'packages/ui-kit/src/components/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const matches = content.match(/src=["'][^"']+["']/g);
  if (matches) {
    console.log(`\n=== ${f} ===`);
    [...new Set(matches)].forEach(m => console.log(`  ${m}`));
  }
}

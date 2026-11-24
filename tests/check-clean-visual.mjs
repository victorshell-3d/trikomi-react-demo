import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 800 });

  const refPath = path.join(outDir, 'ref-configure-confidence.jpg');
  const cleanPath = path.resolve('apps/viewer/public/images/viewer-clean-3d-visual.png');

  // Let's crop the left 3D artwork from the reference (from x=0 to x=370, y=0 to y=292)
  await page.goto('about:blank');
  await page.setContent(`
    <html>
      <body style="margin:0; background:#020308;">
        <canvas id="c" width="370" height="292"></canvas>
        <img id="ref" src="file://${refPath.replace(/\\/g, '/')}" style="display:none;" />
      </body>
    </html>
  `);

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.getElementById('ref');
      img.onload = () => {
        const c = document.getElementById('c');
        const ctx = c.getContext('2d');
        // crop left ~370px of reference
        ctx.drawImage(img, 0, 0, 370, 292, 0, 0, 370, 292);
        resolve();
      };
    });
  });

  const canvas = await page.$('#c');
  await canvas.screenshot({ path: path.join(outDir, 'ref-left-artwork-crop.png') });
  console.log('Saved ref-left-artwork-crop.png');

  // Also crop the right 3D viewer mockup from the reference (from x=600 to x=973, y=0 to y=292)
  await page.setContent(`
    <html>
      <body style="margin:0; background:#020308;">
        <canvas id="c2" width="373" height="292"></canvas>
        <img id="ref" src="file://${refPath.replace(/\\/g, '/')}" style="display:none;" />
      </body>
    </html>
  `);

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.getElementById('ref');
      img.onload = () => {
        const c = document.getElementById('c2');
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 600, 0, 373, 292, 0, 0, 373, 292);
        resolve();
      };
    });
  });

  const canvas2 = await page.$('#c2');
  await canvas2.screenshot({ path: path.join(outDir, 'ref-right-mockup-crop.png') });
  console.log('Saved ref-right-mockup-crop.png');

  await browser.close();
}

run().catch(console.error);

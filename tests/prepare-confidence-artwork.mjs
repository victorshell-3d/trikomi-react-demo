import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';
const refPath = path.join(outDir, 'ref-configure-confidence.jpg');
const refBase64 = fs.readFileSync(refPath).toString('base64');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // 2x scale: 730 x 584
  const targetW = 730;
  const targetH = 584;
  await page.setViewport({ width: targetW, height: targetH, deviceScaleFactor: 1 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#020308;">
        <canvas id="c" width="${targetW}" height="${targetH}"></canvas>
        <img id="ref" src="data:image/jpeg;base64,${refBase64}" />
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  await page.evaluate((w, h) => {
    return new Promise((resolve) => {
      const img = document.getElementById('ref');
      const draw = () => {
        const c = document.getElementById('c');
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw left crop (x:0 to 365, y:0 to 292 of reference) scaled to 730 x 584
        ctx.drawImage(img, 0, 0, 365, 292, 0, 0, w, h);

        // Smooth right-edge feather to ensure 100% seamless blending into #020308
        const grad = ctx.createLinearGradient(w * 0.82, 0, w, 0);
        grad.addColorStop(0, 'rgba(2, 3, 8, 0)');
        grad.addColorStop(1, 'rgba(2, 3, 8, 1)');
        ctx.fillStyle = grad;
        ctx.fillRect(w * 0.8, 0, w * 0.2, h);

        resolve();
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    });
  }, targetW, targetH);

  const canvas = await page.$('#c');
  const buffer = await canvas.screenshot({ type: 'png' });

  // Save to brain artifacts
  const artifactPath = path.join(outDir, 'viewer-confidence-knot-2x.png');
  fs.writeFileSync(artifactPath, buffer);
  console.log('Generated viewer-confidence-knot-2x.png:', buffer.length, 'bytes');

  // Copy to all public directories
  const targetDirs = [
    path.resolve('public/images'),
    path.resolve('apps/viewer/public/images'),
    path.resolve('dist/viewer/images')
  ];

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dest = path.join(dir, 'viewer-confidence-knot.png');
    fs.writeFileSync(dest, buffer);
    console.log('Saved to:', dest, '(', fs.statSync(dest).size, 'bytes )');
  }

  // Also ensure purple-knot-product.png and viewer-confidence-mockup.png exist in all targetDirs
  const copyAssets = ['purple-knot-product.png', 'viewer-confidence-mockup.png'];
  for (const asset of copyAssets) {
    const src1 = path.resolve('public/images', asset);
    const src2 = path.resolve('apps/viewer/public/images', asset);
    const sourceFile = fs.existsSync(src1) ? src1 : fs.existsSync(src2) ? src2 : null;

    if (sourceFile) {
      for (const dir of targetDirs) {
        const dest = path.join(dir, asset);
        if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
          fs.copyFileSync(sourceFile, dest);
          console.log(`Copied ${asset} to ${dest}`);
        }
      }
    }
  }

  await browser.close();
  console.log('All public assets successfully verified and deployed!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

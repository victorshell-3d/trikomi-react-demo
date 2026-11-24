import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

async function extract() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const refPath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795250812281_51983b49.jpg';
  const imgBase64 = fs.readFileSync(refPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <img id="ref" src="data:image/jpeg;base64,${imgBase64}" />
        <canvas id="canvas"></canvas>
      </body>
    </html>
  `);

  await page.waitForSelector('#ref');

  // Crop ONLY the pure product visuals, stopping BEFORE any card text or card border:
  const crops = {
    // Card 1: Jewelry Ring on pedestal
    jewelry: { sx: 202, sy: 362, sw: 76, sh: 80, targetW: 400, targetH: 420 },
    // Card 2: Eyewear Sunglasses
    eyewear: { sx: 298, sy: 380, sw: 78, sh: 65, targetW: 400, targetH: 330 },
    // Card 3: Sportswear Jersey #10
    sportswear: { sx: 396, sy: 362, sw: 76, sh: 80, targetW: 400, targetH: 420 },
    // Card 4: Packaging open box (strictly isolated product visual, stops before text at y=444, margins x=486..562)
    packaging: { sx: 486, sy: 382, sw: 76, sh: 62, targetW: 400, targetH: 330 },
    // Card 5: Virtual Tour interior room (strictly isolated room visual, stops before text at y=444, margins x=588..656)
    tour: { sx: 588, sy: 374, sw: 68, sh: 70, targetW: 400, targetH: 410 },
    // Section 5: Real-time 3D clean visual (purple knot over terrain, 100% free of text)
    clean3dVisual: { sx: 18, sy: 512, sw: 242, sh: 164, targetW: 720, targetH: 480 }
  };

  const outputDirs = [
    path.resolve('public/images'),
    path.resolve('apps/viewer/public/images'),
    'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838'
  ];

  for (const [key, crop] of Object.entries(crops)) {
    const dataUrl = await page.evaluate((c) => {
      const img = document.getElementById('ref');
      const canvas = document.getElementById('canvas');
      canvas.width = c.targetW;
      canvas.height = c.targetH;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, c.targetW, c.targetH);
      return canvas.toDataURL('image/png');
    }, crop);

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const fileNames = [];
    if (key === 'jewelry') fileNames.push('viewer-card-jewelry.png');
    else if (key === 'eyewear') fileNames.push('viewer-card-eyewear.png');
    else if (key === 'sportswear') fileNames.push('viewer-card-sportswear.png');
    else if (key === 'packaging') fileNames.push('viewer-card-packaging.png');
    else if (key === 'tour') fileNames.push('viewer-card-tour.png');
    else if (key === 'clean3dVisual') {
      fileNames.push('viewer-clean-3d-visual.png');
      fileNames.push('viewer-terrain-knot.png');
    }

    for (const fileName of fileNames) {
      for (const dir of outputDirs) {
        fs.writeFileSync(path.join(dir, fileName), buffer);
      }
      console.log(`Saved clean product asset: ${fileName} (${buffer.length} bytes)`);
    }
  }

  await browser.close();
  console.log('Extraction complete.');
}

extract();

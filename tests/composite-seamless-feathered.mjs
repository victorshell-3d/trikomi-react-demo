import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795422947294_6449823c.jpg';
const outPaths = [
  'd:/new landing page/trikomi-react-demo/public/images/viewer-cta-banner-bg.png',
  'd:/new landing page/trikomi-react-demo/apps/viewer/public/images/viewer-cta-banner-bg.png',
  'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/feathered-cta-banner-bg.png'
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + refImagePath.replace(/\\/g, '/');

  await page.goto(fileUrl);
  await new Promise(r => setTimeout(r, 600));

  const base64Data = await page.evaluate(() => {
    const origImg = document.querySelector('img');
    const w = origImg.naturalWidth;
    const h = origImg.naturalHeight;
    const scale = 2; // 1664 x 456

    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const p = imgData.data;

    // Define the bounding box of the text & button in scaled pixels:
    // Left: 54 * scale = 108
    // Right: 368 * scale = 736
    // Top: 34 * scale = 68
    // Bottom: 178 * scale = 356
    const minX = Math.round(48 * scale);
    const maxX = Math.round(376 * scale);
    const minY = Math.round(30 * scale);
    const maxY = Math.round(184 * scale);

    // Create a 2D smooth interpolated field for this region:
    // Sample pristine borders:
    const leftVals = [];
    const rightVals = [];
    for (let y = minY; y <= maxY; y++) {
      const lIdx = (y * canvas.width + minX - 4) * 4;
      const rIdx = (y * canvas.width + maxX + 4) * 4;
      leftVals.push([p[lIdx], p[lIdx+1], p[lIdx+2]]);
      rightVals.push([p[rIdx], p[rIdx+1], p[rIdx+2]]);
    }

    const topVals = [];
    const botVals = [];
    for (let x = minX; x <= maxX; x++) {
      const tIdx = ((minY - 4) * canvas.width + x) * 4;
      const bIdx = ((maxY + 4) * canvas.width + x) * 4;
      topVals.push([p[tIdx], p[tIdx+1], p[tIdx+2]]);
      botVals.push([p[bIdx], p[bIdx+1], p[bIdx+2]]);
    }

    // Replace the interior of the text zone with smooth harmonic gradient
    const F = 14 * scale; // 28px feather radius
    for (let y = minY; y <= maxY; y++) {
      const v = (y - minY) / (maxY - minY);
      // Vertical feather
      let weightY = 1;
      if (y - minY < F) weightY = (1 - Math.cos(Math.PI * (y - minY) / F)) / 2;
      else if (maxY - y < F) weightY = (1 - Math.cos(Math.PI * (maxY - y) / F)) / 2;

      const [lR, lG, lB] = leftVals[y - minY];
      const [rR, rG, rB] = rightVals[y - minY];

      for (let x = minX; x <= maxX; x++) {
        const u = (x - minX) / (maxX - minX);
        // Horizontal feather
        let weightX = 1;
        if (x - minX < F) weightX = (1 - Math.cos(Math.PI * (x - minX) / F)) / 2;
        else if (maxX - x < F) weightX = (1 - Math.cos(Math.PI * (maxX - x) / F)) / 2;

        const totalWeight = weightX * weightY;

        const [tR, tG, tB] = topVals[x - minX];
        const [bR, bG, bB] = botVals[x - minX];

        // Bilinear blend of 4 boundaries
        const hR = (1 - u) * lR + u * rR;
        const hG = (1 - u) * lG + u * rG;
        const hB = (1 - u) * lB + u * rB;

        const vR = (1 - v) * tR + v * bR;
        const vG = (1 - v) * tG + v * bG;
        const vB = (1 - v) * tB + v * bB;

        const blendR = 0.5 * (hR + vR);
        const blendG = 0.5 * (hG + vG);
        const blendB = 0.5 * (hB + vB);

        const idx = (y * canvas.width + x) * 4;
        p[idx] = Math.round((1 - totalWeight) * p[idx] + totalWeight * blendR);
        p[idx + 1] = Math.round((1 - totalWeight) * p[idx + 1] + totalWeight * blendG);
        p[idx + 2] = Math.round((1 - totalWeight) * p[idx + 2] + totalWeight * blendB);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  });

  const buf = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  for (const p of outPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, buf);
    console.log('Saved feathered CTA banner background to:', p);
  }

  await browser.close();
}

main().catch(console.error);

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
  'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/flawless-cta-banner-bg.png'
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
    const img = document.querySelector('img');
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const scale = 2; // 2x high resolution: 1664 x 456
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    // We want to inpaint the ENTIRE rectangle containing all text and the button:
    // Left: 42 * scale
    // Right: 295 * scale (well before the center purple wave which starts at ~310*scale)
    // Top: 28 * scale (below the cyan arc which curves above y = 25*scale at x > 70)
    // Bottom: 182 * scale (above the lower purple floor line which is at y >= 186*scale)
    
    const minX = 42 * scale;
    const maxX = 295 * scale;
    const minY = 28 * scale;
    const maxY = 180 * scale;

    const mask = new Uint8Array(canvas.width * canvas.height);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        // Protect the top cyan arc if it enters this area:
        // Cyan arc is bright cyan/blue (b > 110, g > 75, r < 60)
        const idx = (y * canvas.width + x) * 4;
        const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
        if (y < 42 * scale && b > 100 && g > 70) {
          // keep cyan arc
          continue;
        }
        mask[y * canvas.width + x] = 1;
      }
    }

    // Initialize the masked region with smooth bilinear interpolation from the 4 outer boundary edges
    for (let y = minY; y <= maxY; y++) {
      const vT = (y - minY) / (maxY - minY);
      for (let x = minX; x <= maxX; x++) {
        const uT = (x - minX) / (maxX - minX);

        if (mask[y * canvas.width + x] === 1) {
          // Sample top boundary
          const topIdx = (minY * canvas.width + x) * 4;
          // Sample bottom boundary
          const botIdx = (maxY * canvas.width + x) * 4;
          // Sample left boundary
          const leftIdx = (y * canvas.width + minX) * 4;
          // Sample right boundary
          const rightIdx = (y * canvas.width + maxX) * 4;

          const idx = (y * canvas.width + x) * 4;

          // Bilinear blend
          for (let c = 0; c < 3; c++) {
            const hVal = (1 - uT) * pixels[leftIdx + c] + uT * pixels[rightIdx + c];
            const vVal = (1 - vT) * pixels[topIdx + c] + vT * pixels[botIdx + c];
            pixels[idx + c] = Math.round(0.5 * (hVal + vVal));
          }
        }
      }
    }

    // Run Laplace diffusion (200 iterations) for complete harmonic smoothness
    for (let iter = 0; iter < 200; iter++) {
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (mask[y * canvas.width + x] === 1) {
            const idx = (y * canvas.width + x) * 4;
            const topIdx = ((y - 1) * canvas.width + x) * 4;
            const botIdx = ((y + 1) * canvas.width + x) * 4;
            const leftIdx = (y * canvas.width + (x - 1)) * 4;
            const rightIdx = (y * canvas.width + (x + 1)) * 4;

            pixels[idx] = (pixels[topIdx] + pixels[botIdx] + pixels[leftIdx] + pixels[rightIdx]) >> 2;
            pixels[idx + 1] = (pixels[topIdx + 1] + pixels[botIdx + 1] + pixels[leftIdx + 1] + pixels[rightIdx + 1]) >> 2;
            pixels[idx + 2] = (pixels[topIdx + 2] + pixels[botIdx + 2] + pixels[leftIdx + 2] + pixels[rightIdx + 2]) >> 2;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  });

  const buf = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  for (const p of outPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, buf);
    console.log('Saved clean CTA banner background to:', p);
  }

  await browser.close();
}

main().catch(console.error);

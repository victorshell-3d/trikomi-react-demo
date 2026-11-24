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
  'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/seamless-cta-banner-bg.png'
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

    const scale = 2; // 1664 x 456
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const p = imgData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Identify foreground pixels (text and button) strictly within the left content region
    // rx in [52..375], ry in [30..182]
    const mask = new Uint8Array(width * height);

    for (let y = 28 * scale; y < 184 * scale; y++) {
      for (let x = 50 * scale; x < 375 * scale; x++) {
        const rx = x / scale;
        const ry = y / scale;

        const idx = (y * width + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Button region: rx in [52..208], ry in [128..178]
        if (rx >= 52 && rx <= 208 && ry >= 128 && ry <= 178) {
          // The button has a purple/blue fill or glow
          if (lum > 14 || b > 25 || r > 20) {
            mask[y * width + x] = 1;
            continue;
          }
        }

        // Heading region: rx in [52..375], ry in [52..128]
        if (rx >= 52 && rx <= 375 && ry >= 52 && ry <= 128) {
          // Letters are white or light gray anti-aliased
          if (lum > 20) {
            mask[y * width + x] = 1;
            continue;
          }
        }

        // Eyebrow region: rx in [52..215], ry in [32..52]
        if (rx >= 52 && rx <= 215 && ry >= 32 && ry <= 52) {
          // Eyebrow is violet/magenta or white
          if (lum > 18 || (b > 30 && r > 25)) {
            mask[y * width + x] = 1;
            continue;
          }
        }
      }
    }

    // Dilate mask by 3px to catch all subpixel anti-aliasing around letter edges
    const dilated = new Uint8Array(width * height);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (mask[y * width + x] === 1) {
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              if (dx*dx + dy*dy <= 9) {
                dilated[(y + dy) * width + (x + dx)] = 1;
              }
            }
          }
        }
      }
    }

    // Step 1: For each pixel where dilated === 1, find nearby unmasked pixels within radius R=18
    // and compute inverse-distance weighted average
    const R = 18;
    const origP = new Uint8ClampedArray(p);

    for (let y = 25 * scale; y < 188 * scale; y++) {
      for (let x = 45 * scale; x < 380 * scale; x++) {
        if (dilated[y * width + x] === 1) {
          let sumR = 0, sumG = 0, sumB = 0, sumW = 0;

          // Check circular neighborhood
          for (let dy = -R; dy <= R; dy += 2) {
            const ny = y + dy;
            if (ny < 0 || ny >= height) continue;
            for (let dx = -R; dx <= R; dx += 2) {
              const nx = x + dx;
              if (nx < 0 || nx >= width) continue;
              if (dilated[ny * width + nx] === 0) {
                const distSq = dx*dx + dy*dy;
                if (distSq <= R*R && distSq > 0) {
                  const weight = 1 / Math.sqrt(distSq);
                  const nIdx = (ny * width + nx) * 4;
                  sumR += origP[nIdx] * weight;
                  sumG += origP[nIdx + 1] * weight;
                  sumB += origP[nIdx + 2] * weight;
                  sumW += weight;
                }
              }
            }
          }

          const idx = (y * width + x) * 4;
          if (sumW > 0) {
            p[idx] = Math.round(sumR / sumW);
            p[idx + 1] = Math.round(sumG / sumW);
            p[idx + 2] = Math.round(sumB / sumW);
          }
        }
      }
    }

    // Step 2: 40 iterations of local Laplace relaxation on the dilated pixels
    for (let iter = 0; iter < 40; iter++) {
      for (let y = 25 * scale; y < 188 * scale; y++) {
        for (let x = 45 * scale; x < 380 * scale; x++) {
          if (dilated[y * width + x] === 1) {
            const idx = (y * width + x) * 4;
            const topIdx = ((y - 1) * width + x) * 4;
            const botIdx = ((y + 1) * width + x) * 4;
            const leftIdx = (y * width + (x - 1)) * 4;
            const rightIdx = (y * width + (x + 1)) * 4;

            p[idx] = (p[topIdx] + p[botIdx] + p[leftIdx] + p[rightIdx]) >> 2;
            p[idx + 1] = (p[topIdx + 1] + p[botIdx + 1] + p[leftIdx + 1] + p[rightIdx + 1]) >> 2;
            p[idx + 2] = (p[topIdx + 2] + p[botIdx + 2] + p[leftIdx + 2] + p[rightIdx + 2]) >> 2;
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
    console.log('Saved seamless CTA banner background to:', p);
  }

  await browser.close();
}

main().catch(console.error);

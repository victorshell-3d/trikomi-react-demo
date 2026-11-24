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

    const scale = 2; // 2x: 1664 x 456
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    // Exact zones for text in 1x coordinates:
    // Zone 1: Eyebrow "READY TO GET STARTED?": x in [60..210], y in [34..52]
    // Zone 2: Heading "Let's Build Your 3D Experience Together": x in [60..372], y in [52..130]
    // Zone 3: Button: x in [56..202], y in [130..176]

    const isInsideTextZone = (x, y) => {
      const rx = x / scale;
      const ry = y / scale;

      // Eyebrow
      if (rx >= 58 && rx <= 212 && ry >= 34 && ry <= 52) return true;
      // Heading
      if (rx >= 58 && rx <= 372 && ry > 52 && ry <= 130) return true;
      // Button
      if (rx >= 52 && rx <= 204 && ry > 130 && ry <= 178) return true;

      return false;
    };

    const mask = new Uint8Array(canvas.width * canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (isInsideTextZone(x, y)) {
          mask[y * canvas.width + x] = 1;
        }
      }
    }

    // Dilate mask by 3px for completely smooth borders
    const dilated = new Uint8Array(canvas.width * canvas.height);
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        if (mask[y * canvas.width + x] === 1) {
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              dilated[(y + dy) * canvas.width + (x + dx)] = 1;
            }
          }
        }
      }
    }

    // Row-by-row interpolation from unmasked left boundary to unmasked right boundary
    for (let y = 30 * scale; y < 184 * scale; y++) {
      // Find left boundary and right boundary of mask on this row
      let leftBorder = -1;
      let rightBorder = -1;
      for (let x = 40 * scale; x < canvas.width; x++) {
        if (dilated[y * canvas.width + x] === 1) {
          if (leftBorder === -1) leftBorder = x - 1;
          rightBorder = x + 1;
        }
      }

      if (leftBorder > 0 && rightBorder < canvas.width) {
        const lIdx = (y * canvas.width + leftBorder) * 4;
        const rIdx = (y * canvas.width + rightBorder) * 4;
        const span = rightBorder - leftBorder;

        for (let x = leftBorder + 1; x < rightBorder; x++) {
          const t = (x - leftBorder) / span;
          const idx = (y * canvas.width + x) * 4;
          // Smooth cosine curve for natural gradient lighting
          const smoothT = (1 - Math.cos(t * Math.PI)) / 2;

          for (let c = 0; c < 3; c++) {
            pixels[idx + c] = Math.round(pixels[lIdx + c] * (1 - smoothT) + pixels[rIdx + c] * smoothT);
          }
        }
      }
    }

    // Laplace relaxation on masked pixels (120 iterations)
    for (let iter = 0; iter < 120; iter++) {
      for (let y = 30 * scale; y < 184 * scale; y++) {
        for (let x = 45 * scale; x < 380 * scale; x++) {
          if (dilated[y * canvas.width + x] === 1) {
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

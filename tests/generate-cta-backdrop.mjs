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
  'd:/new landing page/trikomi-react-demo/apps/viewer/public/images/viewer-cta-banner-bg.png'
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

    const scale = 2; // 2x high resolution
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    // Detect ONLY the text glyphs and the button pixels:
    // Left boundary: x >= 56*scale, Right boundary: x <= 365*scale
    // Top boundary: y >= 34*scale, Bottom boundary: y <= 176*scale
    const isGlyphOrButton = (x, y) => {
      if (x < 56 * scale || x > 365 * scale || y < 34 * scale || y > 176 * scale) return false;
      const idx = (y * canvas.width + x) * 4;
      const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // 1. Button area: x in [60..195]*scale, y in [134..174]*scale
      if (x >= 60 * scale && x <= 195 * scale && y >= 134 * scale && y <= 174 * scale) {
        if (b > 35 || r > 28 || lum > 25) return true;
      }

      // 2. Heading "Let's Build Your 3D Experience Together":
      if (y >= 54 * scale && y <= 126 * scale) {
        if (lum > 24) return true;
      }

      // 3. Label "READY TO GET STARTED?":
      if (y >= 34 * scale && y <= 54 * scale && x <= 220 * scale) {
        if (lum > 20 || (b > 35 && r > 25)) return true;
      }

      return false;
    };

    // Mask with tight 2px dilation
    const mask = new Uint8Array(canvas.width * canvas.height);
    for (let y = 32 * scale; y < 178 * scale; y++) {
      for (let x = 54 * scale; x < 368 * scale; x++) {
        if (isGlyphOrButton(x, y)) {
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              mask[(y + dy) * canvas.width + (x + dx)] = 1;
            }
          }
        }
      }
    }

    // Initialize masked pixels by interpolating from unmasked left/right boundary pixels
    for (let y = 32 * scale; y < 178 * scale; y++) {
      let leftIdx = -1, rightIdx = -1;
      for (let x = 50 * scale; x < 370 * scale; x++) {
        const m = mask[y * canvas.width + x];
        if (m === 1 && leftIdx === -1) {
          leftIdx = Math.max(0, x - 1);
        }
        if (m === 0 && leftIdx !== -1 && rightIdx === -1) {
          rightIdx = x;
          // Interpolate the span
          const lP = (y * canvas.width + leftIdx) * 4;
          const rP = (y * canvas.width + rightIdx) * 4;
          const span = rightIdx - leftIdx;
          for (let k = leftIdx + 1; k < rightIdx; k++) {
            const t = (k - leftIdx) / span;
            const target = (y * canvas.width + k) * 4;
            pixels[target] = Math.round(pixels[lP] * (1 - t) + pixels[rP] * t);
            pixels[target + 1] = Math.round(pixels[lP + 1] * (1 - t) + pixels[rP + 1] * t);
            pixels[target + 2] = Math.round(pixels[lP + 2] * (1 - t) + pixels[rP + 2] * t);
          }
          leftIdx = -1;
          rightIdx = -1;
        }
      }
    }

    // Solve Laplace's equation for seamless boundary harmony (80 iterations)
    for (let iter = 0; iter < 80; iter++) {
      for (let y = 32 * scale; y < 178 * scale; y++) {
        for (let x = 52 * scale; x < 368 * scale; x++) {
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
    console.log('Saved CTA banner background to:', p);
  }

  await browser.close();
}

main().catch(console.error);

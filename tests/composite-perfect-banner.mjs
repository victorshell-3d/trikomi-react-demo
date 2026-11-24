import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795422947294_6449823c.jpg';
const cleanRightPath = 'd:/new landing page/trikomi-react-demo/apps/viewer/public/images/viewer-cta-ref-clean-right.png';
const outPaths = [
  'd:/new landing page/trikomi-react-demo/public/images/viewer-cta-banner-bg.png',
  'd:/new landing page/trikomi-react-demo/apps/viewer/public/images/viewer-cta-banner-bg.png',
  'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/perfect-cta-banner-bg.png'
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

  const base64Data = await page.evaluate(async (cleanRightUri) => {
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

    // 1. Fill base with deep midnight gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#010206');
    grad.addColorStop(0.25, '#02040c');
    grad.addColorStop(0.45, '#050818');
    grad.addColorStop(1, '#050818');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the authentic top-left cyan arc from the original image
    // Original image:
    const origCanvas = document.createElement('canvas');
    origCanvas.width = canvas.width;
    origCanvas.height = canvas.height;
    const origCtx = origCanvas.getContext('2d');
    origCtx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
    const origData = origCtx.getImageData(0, 0, canvas.width, canvas.height);
    const op = origData.data;

    // Create an overlay canvas for authentic elements (top-left arc and bottom floor)
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    const oCtx = overlayCanvas.getContext('2d');
    const oData = oCtx.createImageData(canvas.width, canvas.height);
    const odp = oData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const rx = x / scale;
        const ry = y / scale;
        const idx = (y * canvas.width + x) * 4;

        // Condition A: Top-left corner & arc: rx < 240, ry < 48
        if (rx < 240 && ry < 48) {
          // If close to the arc (y < 42), smoothly copy
          let alpha = 1;
          if (ry > 32) alpha = (48 - ry) / 16;
          if (rx > 180) alpha *= (240 - rx) / 60;
          odp[idx] = op[idx];
          odp[idx+1] = op[idx+1];
          odp[idx+2] = op[idx+2];
          odp[idx+3] = Math.round(255 * alpha);
          continue;
        }

        // Condition B: Bottom curve / floor contour: ry > 180, rx < 370
        if (ry > 180 && rx < 370) {
          let alpha = 1;
          if (ry < 188) alpha = (ry - 180) / 8;
          odp[idx] = op[idx];
          odp[idx+1] = op[idx+1];
          odp[idx+2] = op[idx+2];
          odp[idx+3] = Math.round(255 * alpha);
          continue;
        }

        // Condition C: Left edge before text: rx < 54
        if (rx < 54) {
          let alpha = 1;
          if (rx > 42) alpha = (54 - rx) / 12;
          odp[idx] = op[idx];
          odp[idx+1] = op[idx+1];
          odp[idx+2] = op[idx+2];
          odp[idx+3] = Math.round(255 * alpha);
        }
      }
    }
    oCtx.putImageData(oData, 0, 0);
    ctx.drawImage(overlayCanvas, 0, 0);

    // 3. Load and draw clean right image (which has the complete purple wave and showroom)
    const rightImg = new Image();
    await new Promise((res, rej) => {
      rightImg.onload = res;
      rightImg.onerror = rej;
      rightImg.src = cleanRightUri;
    });

    // Draw right image at x = canvas.width - rightImg.width (728px, exactly x=364 in 1x)
    ctx.drawImage(rightImg, canvas.width - rightImg.width, 0);

    return canvas.toDataURL('image/png');
  }, 'file:///' + cleanRightPath.replace(/\\/g, '/'));

  const buf = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  for (const p of outPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, buf);
    console.log('Saved perfect CTA banner background to:', p);
  }

  await browser.close();
}

main().catch(console.error);

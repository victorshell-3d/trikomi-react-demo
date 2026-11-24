import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795422947294_6449823c.jpg';

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

  const data = await page.evaluate(() => {
    const img = document.querySelector('img');
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, w, h);
    const p = imgData.data;

    // Trace top-left cyan arc:
    // From x=0 to x=250, find the y with max cyan intensity (b + g - r)
    const arcPoints = [];
    for (let x = 0; x < 260; x += 5) {
      let bestY = -1, maxCyan = 30;
      for (let y = 5; y < 100; y++) {
        const idx = (y * w + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        const cyan = (b * 1.5 + g) - r * 1.2;
        if (cyan > maxCyan) {
          maxCyan = cyan;
          bestY = y;
        }
      }
      if (bestY > 0) {
        arcPoints.push({ x, y: bestY });
      }
    }

    // Trace lower-left purple curve:
    // From x=0 to x=400, find the y with max purple intensity (r + b - g)
    const purplePoints = [];
    for (let x = 0; x < 420; x += 8) {
      let bestY = -1, maxPurple = 30;
      for (let y = 140; y < h; y++) {
        const idx = (y * w + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        const purple = (r * 1.2 + b * 1.5) - g * 1.5;
        if (purple > maxPurple) {
          maxPurple = purple;
          bestY = y;
        }
      }
      if (bestY > 0) {
        purplePoints.push({ x, y: bestY });
      }
    }

    // Button bounding box & shape:
    let bMinX = w, bMaxX = 0, bMinY = h, bMaxY = 0;
    for (let y = 130; y < 185; y++) {
      for (let x = 50; x < 200; x++) {
        const idx = (y * w + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        if (b > 110 && r > 60 && g < 110) {
          if (x < bMinX) bMinX = x;
          if (x > bMaxX) bMaxX = x;
          if (y < bMinY) bMinY = y;
          if (y > bMaxY) bMaxY = y;
        }
      }
    }

    // Save reference cropped images
    const refDataUrl = canvas.toDataURL('image/png');
    return {
      w,
      h,
      arcPoints,
      purplePoints,
      button: { bMinX, bMaxX, bMinY, bMaxY, w: bMaxX - bMinX, h: bMaxY - bMinY },
      refDataUrl
    };
  });

  const base64Data = data.refDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/ref-cta-exact.png', base64Data, 'base64');
  console.log('Saved ref-cta-exact.png');
  console.log('ALL Arc points:', JSON.stringify(data.arcPoints));
  console.log('Purple points count:', data.purplePoints.length, 'points:', data.purplePoints);
  console.log('Button:', data.button);

  await browser.close();
}

main().catch(console.error);
